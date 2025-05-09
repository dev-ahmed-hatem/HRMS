from rest_framework.response import Response
from rest_framework import viewsets
from .serializers import DepartmentSerializer, EmployeeReadSerializer, EmployeeWriteSerializer, EmployeeListSerializer
from .models import Department, Employee
from rest_framework.decorators import action
from django.db.models import Q


class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return EmployeeWriteSerializer
        return EmployeeListSerializer

    @action(detail=True, methods=['get'])
    def detailed(self, request, pk=None):
        employee = Employee.objects.filter(id=pk).first()
        if not employee:
            raise Employee.DoesNotExist
        data = EmployeeReadSerializer(employee, context={"request": self.request}).data
        return Response(data)

    def get_queryset(self):
        search = self.request.query_params.get('search', None)
        queryset = Employee.objects.all()

        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(employee_id__icontains=search))

        return queryset
