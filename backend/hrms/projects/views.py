from math import floor
from datetime import datetime

from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, action
from .models import Project, Task
from .serializers import ProjectListSerializer, ProjectWriteSerializer, ProjectReadSerializer, TaskReadSerializer, \
    TaskWriteSerializer, TaskListSerializer
from django.db.models import Q
from django.utils.translation import gettext_lazy as _


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return ProjectWriteSerializer
        return ProjectListSerializer

    def get_queryset(self):
        search = self.request.query_params.get('search', None)
        status_filters = self.request.query_params.get('status_filters', None)
        queryset = Project.objects.all()

        if search is not None:
            queryset = queryset.filter(name__icontains=search)

        if status_filters:
            today = datetime.today().astimezone(settings.CAIRO_TZ).date()
            filters = status_filters.split(",")

            overdue_filter = Q(end_date__lt=today, status__in=["ongoing", "paused"])
            normal_status_filter = Q(status__in=filters)

            if "overdue" in filters:
                queryset = queryset.filter(normal_status_filter | overdue_filter)
            else:
                queryset = queryset.filter(normal_status_filter).exclude(overdue_filter)

        return queryset

    @action(detail=True, methods=["get"])
    def detailed(self, request, pk=None):
        try:
            project = Project.objects.filter(pk=pk).first()
            serializer = ProjectReadSerializer(project, context={"request": request}).data
            return Response(serializer, status=status.HTTP_200_OK)
        except Exception:
            return Response({"detail": _("مشروع غير موجود")}, status=status.HTTP_404_NOT_FOUND)


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return TaskWriteSerializer
        return TaskListSerializer

    def get_queryset(self):
        search = self.request.query_params.get('search', None)
        status_filters = self.request.query_params.get('status_filters', None)
        priority_filters = self.request.query_params.get('priority_filters', None)
        queryset = Task.objects.all()

        if search is not None:
            queryset = queryset.filter(title__icontains=search)

        if status_filters is not None:
            today = datetime.today().astimezone(settings.CAIRO_TZ).date()
            filters = status_filters.split(",")

            overdue_filter = Q(due_date__lt=today, status="incomplete")
            normal_status_filter = Q(status__in=filters)

            if "overdue" in filters:
                queryset = queryset.filter(normal_status_filter | overdue_filter)
            else:
                queryset = queryset.filter(normal_status_filter).exclude(overdue_filter)

        if priority_filters is not None:
            filters = priority_filters.split(",")
            queryset = queryset.filter(priority__in=filters)

        return queryset

    @action(detail=True, methods=["get"])
    def detailed(self, request, pk=None):
        try:
            task = Task.objects.get(pk=pk)
            serializer = TaskReadSerializer(task, context={"request": request}).data
            return Response(serializer, status=status.HTTP_200_OK)
        except Exception:
            return Response({"detail": _("مهمة غير موجود")}, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
def projects_stats(request):
    today = datetime.today().astimezone(settings.CAIRO_TZ).date()
    total = Project.objects.count()
    ongoing = Project.objects.filter(status="ongoing").count()
    completed = Project.objects.filter(status="completed").count()
    pending_approval = Project.objects.filter(status="pending-approval").count()
    paused = Project.objects.filter(status="paused").count()
    overdue = Project.objects.filter((Q(status="ongoing") | Q(status="paused")) & Q(end_date__lt=today)).count()
    return Response(data={
        'total': total,
        'ongoing': ongoing,
        'completed': completed,
        'pending_approval': pending_approval,
        'paused': paused,
        'overdue': overdue
    }, status=status.HTTP_200_OK)


@api_view(["GET"])
def tasks_stats(request):
    today = datetime.today().astimezone(settings.CAIRO_TZ).date()
    total = Task.objects.count()
    completed = Task.objects.filter(status="completed").count()
    overdue = Task.objects.filter(Q(status="incomplete") & Q(due_date__lt=today)).count()
    incomplete = total - completed
    rate = floor((completed / total) * 100)

    return Response({
        'total': total,
        'completed': completed,
        'incomplete': incomplete,
        'overdue': overdue,
        'rate': rate
    }, status=status.HTTP_200_OK)
