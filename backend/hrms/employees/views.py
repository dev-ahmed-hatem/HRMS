from rest_framework.response import Response
from rest_framework import viewsets, status
from .serializers import DepartmentSerializer, EmployeeReadSerializer, EmployeeWriteSerializer, \
    EmployeeListSerializer, EmployeeFormSerializer
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
        employee = Employee.objects.filter(id=pk).first()
        if not employee:
            return Response({'detail': _('موظف غير موجود')}, status=status.HTTP_404_NOT_FOUND)
        data = EmployeeReadSerializer(employee, context={"request": self.request}).data
        return Response(data)

    @action(detail=True, methods=['get'])
    def switch_active(self, request, pk=None):
        employee = Employee.objects.filter(id=pk).first()
        if not employee:
            return Response({'detail': _('موظف غير موجود')}, status=status.HTTP_404_NOT_FOUND)
        employee.is_active = not employee.is_active
        employee.save()
        return Response({"is_active": employee.is_active})

    @action(detail=True, methods=['get'])
    def form_data(self, request, pk=None):
        employee = Employee.objects.filter(id=pk).first()
        if not employee:
            return Response({'detail': _('موظف غير موجود')}, status=status.HTTP_404_NOT_FOUND)
        serializer = EmployeeFormSerializer(employee, context={"request": self.request}).data
        return Response(serializer)


@api_view(["DELETE"])
def multiple_delete(request):
    for emp_id in list(request.data):
        emp = Employee.objects.filter(id=emp_id).first()
        if emp:
            emp.delete()
    return Response()
