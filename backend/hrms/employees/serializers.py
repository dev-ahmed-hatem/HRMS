from rest_framework import serializers
from users.serializers import UserSerializer
from .models import Department, Employee
from hrms.utils import calculate_age
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from projects.models import Task


class DepartmentSerializer(serializers.ModelSerializer):
    employee_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Department
        fields = '__all__'

    def get_employee_count(self, obj: Department):
        return obj.employee_set.count()


class EmployeeReadSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='employee-detail')
    department = serializers.StringRelatedField(read_only=True)
    gender = serializers.CharField(read_only=True, source='get_gender_display')
    marital_status = serializers.CharField(read_only=True, source='get_marital_status_display')
    mode = serializers.CharField(read_only=True, source='get_mode_display')
    created_by = serializers.CharField(read_only=True, source='created_by.name')
    created_at = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)

    class Meta:
        model = Employee
        fields = '__all__'

    def get_created_at(self, obj: Employee) -> str:
        return obj.created_at.astimezone(settings.CAIRO_TZ).strftime('%Y-%m-%d')


class EmployeeListSerializer(serializers.ModelSerializer):
    department = serializers.StringRelatedField(read_only=True)
    assignments = serializers.SerializerMethodField()
    url = serializers.HyperlinkedIdentityField(view_name='employee-detail')

    class Meta:
        model = Employee
        fields = ['id', 'url', 'name', 'position', 'employee_id', 'assignments', 'image', 'department', 'is_active']

    def get_assignments(self, obj):
        return 5


class EmployeeWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        exclude = ['created_by']

    def create(self, validated_data):
        auth_user = self.context['request'].user
        return Employee.objects.create(**validated_data, created_by=auth_user)

    def update(self, instance: Employee, validated_data):
        cv = validated_data.pop('cv', None)
        image = validated_data.pop('image', None)

        birth_date = validated_data.get("birth_date")
        if birth_date:
            instance.age = calculate_age(birth_date)

        instance = super().update(instance, validated_data)

        if cv:
            if instance.cv:
                instance.cv.delete(save=False)
            instance.cv = cv

        if image:
            if instance.image:
                instance.image.delete(save=False)
            instance.image = image

        instance.save()
        return instance


class EmployeeDashboardSerializer(serializers.ModelSerializer):
    tasks = serializers.SerializerMethodField()
    projects = serializers.SerializerMethodField()
    performance_score = serializers.SerializerMethodField()
    weekly_performance = serializers.SerializerMethodField()
    rank = serializers.SerializerMethodField()
    tenure = serializers.SerializerMethodField()
    notifications = serializers.SerializerMethodField()
    unread_messages = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = [
            'id', 'name', 'employee_id', 'position', 'department',
            'image', 'hire_date', 'tasks', 'projects', 'performance_score',
            'weekly_performance', 'rank', 'tenure', 'notifications',
            'unread_messages', 'avg_completion_time', 'quality_score',
            'collaboration_score', 'weekly_completed_tasks'
        ]

    def get_tasks(self, obj):
        today = timezone.now().date()
        tasks = obj.tasks.all()

        return {
            'total': tasks.count(),
            'completed': tasks.filter(status='completed').count(),
            'today': TaskSerializer(
                tasks.filter(due_date=today).order_by('priority'),
                many=True,
                context=self.context
            ).data,
            'upcoming': TaskSerializer(
                tasks.filter(due_date__gte=today)
                .exclude(status='completed')
                .order_by('due_date')[:10],
                many=True,
                context=self.context
            ).data,
        }

    def get_projects(self, obj):
        projects = obj.supervised_projects.all()

        return {
            'total': projects.count(),
            'active': projects.filter(status='ongoing').count(),
            'active_projects': ProjectSerializer(
                projects.filter(status='ongoing'),
                many=True,
                context=self.context
            ).data,
            'completed_tasks': Task.objects.filter(
                project__in=projects,
                status='completed'
            ).count(),
            'total_tasks': Task.objects.filter(
                project__in=projects
            ).count(),
        }

    def get_performance_score(self, obj):
        # Calculate performance score based on completed tasks, timeliness, etc.
        tasks = obj.tasks.all()
        if tasks.count() == 0:
            return 85  # Default score

        completed = tasks.filter(status='completed').count()
        on_time = tasks.filter(
            status='completed',
            completed_at__lte=models.F('due_date')
        ).count()

        return int((completed / tasks.count()) * 40 + (on_time / max(completed, 1)) * 60)

    def get_weekly_performance(self, obj):
        week_start = timezone.now() - timedelta(days=7)
        tasks = obj.tasks.filter(created_at__gte=week_start)

        if tasks.count() == 0:
            return 0

        completed = tasks.filter(status='completed').count()
        return int((completed / tasks.count()) * 100)

    def get_rank(self, obj):
        # Calculate rank within department based on performance
        dept_employees = Employee.objects.filter(department=obj.department)
        scores = []
        for emp in dept_employees:
            # Use your performance calculation logic
            score = self.get_performance_score(emp)
            scores.append((emp.id, score))

        scores.sort(key=lambda x: x[1], reverse=True)
        for i, (emp_id, _) in enumerate(scores):
            if emp_id == obj.id:
                return i + 1
        return None

    def get_notifications(self, obj):
        """ TODO """
        pass

    def get_unread_messages(self, obj):
        """ TODO """
        pass
