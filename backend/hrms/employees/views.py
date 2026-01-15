from rest_framework.response import Response
from rest_framework import viewsets, status

from users.models import User
from users.serializers import UserSerializer
from .serializers import DepartmentSerializer, EmployeeReadSerializer, EmployeeWriteSerializer, EmployeeListSerializer
from .models import Department, Employee
from rest_framework.decorators import action, api_view
from django.db.models import Q
from django.utils.translation import gettext_lazy as _


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return EmployeeWriteSerializer
        return EmployeeListSerializer

    def get_queryset(self):
        search = self.request.query_params.get('search', None)
        queryset = Employee.objects.all()

        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(employee_id__icontains=search))

        return queryset

    @action(detail=True, methods=['get'])
    def detailed(self, request, pk=None):
        try:
            employee = Employee.objects.get(pk=pk)
            data = EmployeeReadSerializer(employee, context={"request": self.request}).data
            return Response(data)
        except Exception:
            return Response({'detail': _('موظف غير موجود')}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'])
    def switch_active(self, request, pk=None):
        try:
            employee = Employee.objects.get(pk=pk)
            employee.is_active = not employee.is_active
            employee.save()
            return Response({"is_active": employee.is_active})
        except Exception:
            return Response({'detail': _('موظف غير موجود')}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['get'])
    def form_data(self, request, pk=None):
        try:
            employee = Employee.objects.get(id=pk)
            serializer = EmployeeWriteSerializer(employee, context={"request": self.request}).data
            return Response(serializer)
        except Employee.DoesNotExist:
            return Response({'detail': _('موظف غير موجود')}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=["get"], url_path="performance")
    def performance(self, request, pk=None):
        try:
            employee = Employee.objects.get(id=pk)

            projects = employee.supervised_projects.all()
            tasks = employee.tasks.all()

            data = {
                "projects": [
                    {
                        "id": project.id,
                        "name": project.name,
                        "description": project.description,
                        "status": project.get_status_display(),
                        "start_date": project.start_date,
                        "end_date": project.end_date,
                        "budget": project.budget,
                        "client": project.client,
                    }
                    for project in projects
                ],
                "tasks": [
                    {
                        "id": task.id,
                        "title": task.title,
                        "description": task.description,
                        "status": task.get_status_display(),
                        "priority": task.get_priority_display(),
                        "due_date": task.due_date,
                        "project": {
                            "id": task.project.id,
                            "name": task.project.name,
                        } if task.project else None,
                    }
                    for task in tasks
                ],
            }
            return Response(data, status=status.HTTP_200_OK)

        except Employee.DoesNotExist:
            return Response({'detail': _('موظف غير موجود')}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def create_account(self, request, pk=None):
        try:
            employee = Employee.objects.get(id=pk)

            if employee.user:
                return Response(
                    {'error': 'هذا الموظف لديه حساب بالفعل'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            username = request.data['username']
            if User.objects.filter(username=username).exists():
                return Response({'username': [_('اسم مستخدم موجود')]}, status=status.HTTP_404_NOT_FOUND)
            password = request.data['password']
            password2 = request.data['password2']
            if password != password2:
                return Response({"password2": [_("كلمات المرور غير متطابقة")]}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create_user(username=username,
                                            password=password,
                                            name=employee.name,
                                            phone=employee.phone,
                                            national_id=employee.national_id,
                                            )

            employee.user = user
            employee.save()

            return Response(UserSerializer(user, context={"request": request}).data, status=status.HTTP_201_CREATED)

        except Employee.DoesNotExist:
            return Response({'detail': _('موظف غير موجود')}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['delete'])
    def delete_account(self, request, pk=None):
        try:
            employee = Employee.objects.get(id=pk)

            if not employee.user:
                return Response(
                    {'error': 'هذا الموظف ليس لديه حساب'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            employee.user.delete()

            return Response({"detail": "تم حذف حساب الموظف"}, status=status.HTTP_204_NO_CONTENT)

        except Employee.DoesNotExist:
            return Response({'detail': _('موظف غير موجود')}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['patch'])
    def update_user_account(self, request, pk=None):
        employee = self.get_object()

        if not hasattr(employee, 'user'):
            return Response(
                {'error': 'Employee does not have a user account'},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response()

        user = employee.user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def change_password(self, request, pk=None):
        try:
            employee = Employee.objects.get(id=pk)
            user = employee.user if hasattr(employee, 'user') else None

            if not user:
                return Response(
                    {'error': 'هذا الموظف ليس لديه حساب'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            is_admin_change = request.user.is_staff or request.user.is_superuser

            if not is_admin_change:
                if not user.check_password(request.data['current_password']):
                    return Response({"current_password": "كلمة المرور الحالية غير صحيحة"})

            new_password = request.data['new_password']
            confirm_new_password = request.data['confirm_new_password']

            if new_password != confirm_new_password:
                return Response(
                    {'confirm_new_password': [_('كلمات المرور الجديدة غير متطابقة')]},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.set_password(new_password)
            user.save()

            return Response(status=status.HTTP_204_NO_CONTENT)

        except Employee.DoesNotExist:
            return Response(
                {'detail': _('موظف غير موجود')},
                status=status.HTTP_404_NOT_FOUND
            )


@api_view(["DELETE"])
def multiple_delete(request):
    for emp_id in list(request.data):
        emp = Employee.objects.filter(id=emp_id).first()
        if emp:
            emp.delete()
    return Response()
