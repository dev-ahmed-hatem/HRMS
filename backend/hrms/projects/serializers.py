from django.conf import settings
from rest_framework import serializers
from .models import Project, Task


class ProjectReadSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='project-detail')
    status = serializers.StringRelatedField(source="get_status_display")
    supervisors = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()
    created_by = serializers.StringRelatedField(source="created_by.name")

    class Meta:
        model = Project
        fields = '__all__'

    def get_created_at(self, obj: Project) -> str:
        return obj.created_at.astimezone(settings.CAIRO_TZ).strftime('%Y-%m-%d')

    def get_supervisors(self, obj: Project):
        return [{"id": s.id, "name": s.name} for s in obj.supervisors.all()]


class ProjectListSerializer(serializers.ModelSerializer):
    supervisors = serializers.SerializerMethodField()
    status = serializers.StringRelatedField(source="get_status_display")

    class Meta:
        model = Project
        fields = ['id', 'name', 'status', 'start_date', 'end_date', 'supervisors']

    def get_supervisors(self, obj: Project):
        return [{"id": s.id, "name": s.name} for s in obj.supervisors.all()]


class ProjectWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
