from datetime import datetime

from django.conf import settings
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Project, Task
from .serializers import ProjectListSerializer, ProjectWriteSerializer
from django.db.models import Q


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
    })
