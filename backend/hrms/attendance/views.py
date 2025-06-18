from .models import Attendance
from .serializers import AttendanceWriteSerializer, AttendanceReadSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from django.utils.translation import gettext_lazy as _


class AttendanceViewSet(viewsets.ModelViewSet):
    pagination_class = None

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return AttendanceWriteSerializer
        return AttendanceReadSerializer

    def get_queryset(self):
        queryset = Attendance.objects.all()
        date = self.request.query_params.get("date", None)
        if date is not None:
            queryset = queryset.filter(date=date)
        return queryset


@api_view(["POST"])
def update_day_attendance(request):
    date = request.data.get("date", None)
    records = request.data.get("records", [])

    if date is None:
        return Response({"detail": _('يجب توفير تاريخ اليوم')}, status=status.HTTP_400_BAD_REQUEST)

    for record in records:
        if record["saved"]:
            attendance = Attendance.objects.get(pk=record["id"])
            serializer = AttendanceWriteSerializer(attendance, data=record, partial=True, context={"request": request})
            if serializer.is_valid():
                serializer.save()
        else:
            serializer = AttendanceWriteSerializer(data={**record, "date": date}, context={"request": request})
            if serializer.is_valid():
                serializer.save()

    return Response()
