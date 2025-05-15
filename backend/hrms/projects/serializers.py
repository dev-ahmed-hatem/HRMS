from rest_framework import serializers
from .models import Project, Task


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
