from django.db.models import F
from rest_framework import serializers
from users.serializers import UserSerializer
from .models import Department, Employee
from hrms.utils import calculate_age
from django.conf import settings
from django.utils import timezone
from datetime import timedelta, datetime
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
    tenure = serializers.SerializerMethodField()
    completion_rate = serializers.SerializerMethodField()
    user = UserSerializer(read_only=True)

    class Meta:
        model = Employee
        fields = '__all__'

    def get_created_at(self, obj: Employee) -> str:
        return obj.created_at.astimezone(settings.CAIRO_TZ).strftime('%Y-%m-%d')

    def get_tenure(self, obj):
        if obj.hire_date:
            return (datetime.now(settings.CAIRO_TZ).date() - obj.hire_date).days
        return 0

    def get_completion_rate(self, obj: Employee):
        tasks = obj.tasks.all()
        total = obj.tasks.count()
        completed = tasks.filter(status="completed").count()

        if not total or total == 0:
            return 0

        return round((completed / total) * 100)


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
    completionRate = serializers.SerializerMethodField()
    weekly_performance = serializers.SerializerMethodField()
    weekly_completed_tasks = serializers.SerializerMethodField()
    rank = serializers.SerializerMethodField()
    notifications = serializers.SerializerMethodField()
    unread_messages = serializers.SerializerMethodField()

    class Meta:
        model = Employee
        fields = [
            'id', 'name', 'employee_id', 'position', 'department',
            'image', 'hire_date', 'tasks', 'projects', 'performance_score',
            'completionRate', 'weekly_performance', 'weekly_completed_tasks',
            'rank', 'notifications', 'unread_messages',
        ]

    # ---------------------------
    # Tasks
    # ---------------------------
    def get_tasks(self, obj):
        today = datetime.now(settings.CAIRO_TZ).date()
        tasks_qs = obj.tasks.all().order_by('due_date', 'priority')
        total = tasks_qs.count()
        completed = tasks_qs.filter(status='completed').count()

        today_focus = []
        upcoming = []

        for task in tasks_qs:
            task_data = {
                "id": task.id,
                "title": task.title,
                "description": task.description or None,
                "status": task.get_status_display(),  # Arabic display
                "priority": task.get_priority_display(),  # Arabic display
                "due_date": task.due_date.isoformat(),
                "project": task.project.name if task.project else None,
            }

            if task.due_date <= today:
                today_focus.append(task_data)
            else:
                upcoming.append(task_data)

        return {
            "total": total,
            "completed": completed,
            "today_focus": today_focus,
            "upcoming": upcoming,
        }

    # ---------------------------
    # Projects
    # ---------------------------
    def get_projects(self, obj):
        projects_qs = obj.supervised_projects.all()
        total = projects_qs.count()
        active_qs = projects_qs.filter(status='ongoing')
        active = active_qs.count()
        completed_tasks = Task.objects.filter(project__in=projects_qs, status='completed').count()
        total_tasks = Task.objects.filter(project__in=projects_qs).count()

        active_projects = []
        for project in active_qs:
            active_projects.append({
                "id": project.id,
                "name": project.name,
                "description": project.description or None,
                "status": project.get_status_display(),
                "progress": int(
                    ((total_tasks > 0 and Task.objects.filter(project=project, status='completed').count()) /
                     total_tasks) * 100 if total_tasks else 0
                ),
                "end_date": project.end_date.isoformat() if project.end_date else None,
                "team_size": project.supervisors.count(),
            })

        return {
            "total": total,
            "active": active,
            "completed_tasks": completed_tasks,
            "total_tasks": total_tasks,
            "active_projects": active_projects,
        }

    # ---------------------------
    # Performance
    # ---------------------------
    def get_performance_score(self, obj):
        tasks_qs = obj.tasks.all()
        if not tasks_qs.exists():
            return 85
        completed = tasks_qs.filter(status='completed').count()
        on_time = tasks_qs.filter(
            status='completed',
            completed_at__lte=F('due_date')
        ).count()
        return int((completed / tasks_qs.count()) * 40 + (on_time / max(completed, 1)) * 60)

    def get_completionRate(self, obj):
        tasks_qs = obj.tasks.all()
        total = tasks_qs.count()
        completed = tasks_qs.filter(status='completed').count()
        if total == 0:
            return 0
        return round((completed / total) * 100)

    def get_weekly_performance(self, obj):
        week_start = timezone.now() - timedelta(days=7)
        tasks_qs = obj.tasks.filter(created_at__gte=week_start)
        total = tasks_qs.count()
        completed = tasks_qs.filter(status='completed').count()
        if total == 0:
            return 0
        return int((completed / total) * 100)

    def get_weekly_completed_tasks(self, obj):
        week_start = timezone.now() - timedelta(days=7)
        return obj.tasks.filter(created_at__gte=week_start, status='completed').count()

    # ---------------------------
    # Rank
    # ---------------------------
    def get_rank(self, obj):
        dept_employees = Employee.objects.filter(department=obj.department)
        scores = []
        for emp in dept_employees:
            score = self.get_performance_score(emp)
            scores.append((emp.id, score))
        scores.sort(key=lambda x: x[1], reverse=True)
        for i, (emp_id, _) in enumerate(scores):
            if emp_id == obj.id:
                return i + 1
        return None

    # ---------------------------
    # Notifications
    # ---------------------------
    def get_notifications(self, obj):
        # Placeholder for now
        return [
            {
                "title": "مهمة جديدة",
                "message": "تم إسناد مهمة جديدة لك",
                "type": "info",
                "link": "/tasks/1",
            },
            {
                "title": "تأخير مشروع",
                "message": "مشروع بوابة الموظفين يقترب من الموعد النهائي",
                "type": "warning",
                "link": "/projects/1",
            }
        ]

    def get_unread_messages(self, obj):
        # Placeholder count
        return 3
