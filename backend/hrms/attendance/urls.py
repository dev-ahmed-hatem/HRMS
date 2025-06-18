from rest_framework.routers import DefaultRouter
from .views import AttendanceViewSet, update_day_attendance
from django.urls import path, include

router = DefaultRouter()
router.register('attendance', AttendanceViewSet, basename='attendance')

urlpatterns = [
    path('', include(router.urls)),
    path('update-day-attendance/', update_day_attendance, name="update-day-attendance"),
]
