from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, projects_stats
from django.urls import path, include

router = DefaultRouter()
router.register('projects', ProjectViewSet, basename='project')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', projects_stats, name='stats'),
]
