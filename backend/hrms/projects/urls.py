from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, TaskViewSet, projects_stats, tasks_stats, ProjectAssignmentViewSet, \
    TaskAssignmentViewSet
from django.urls import path, include

router = DefaultRouter()
router.register('projects', ProjectViewSet, basename='project')
router.register('tasks', TaskViewSet, basename='task')
router.register('project-assignments', ProjectAssignmentViewSet, basename='project-assignment')
router.register('task-assignments', TaskAssignmentViewSet, basename='task-assignment')

urlpatterns = [
    path('', include(router.urls)),
    path('projects-stats/', projects_stats, name='projects-stats'),
    path('tasks-stats/', tasks_stats, name='tasks-stats'),
]
