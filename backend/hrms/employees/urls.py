from rest_framework.routers import DefaultRouter
from .views import DepartmentViewSet, EmployeeViewSet
from django.urls import path, include

router = DefaultRouter()
router.register('departments', DepartmentViewSet, basename='department')
router.register('employees', EmployeeViewSet, basename='employee')

urlpatterns = [
    path('', include(router.urls)),
]
