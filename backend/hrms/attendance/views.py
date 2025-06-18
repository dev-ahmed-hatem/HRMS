from hrms.rest_framework_utils.custom_pagination import CustomPageNumberPagination
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


# TODO: calculate deductions
# js version:
#
#   // // Calculate deduction based on lateness and early departure
#   // const calculateDeduction = (checkIn: string, checkOut: string) => {
#   //   const checkInTime = dayjs(checkIn, "HH:mm");
#   //   const checkOutTime = dayjs(checkOut, "HH:mm");
#   //   const standardInTime = dayjs(standardCheckIn, "HH:mm");
#   //   const standardOutTime = dayjs(standardCheckOut, "HH:mm");
#
#   //   let lateMinutes = checkInTime.isAfter(standardInTime)
#   //     ? checkInTime.diff(standardInTime, "minute")
#   //     : 0;
#   //   let earlyLeaveMinutes = checkOutTime.isBefore(standardOutTime)
#   //     ? standardOutTime.diff(checkOutTime, "minute")
#   //     : 0;
#
#   //   return `${lateMinutes + earlyLeaveMinutes} دقيقة`;
#   // };


@api_view(['GET'])
def get_attendance_summary(request):
    date = request.query_params.get("date", None)
    if date is None:
        return Response({"detail": _('يجب توفير تاريخ اليوم')}, status=status.HTTP_400_BAD_REQUEST)

    attendances = Attendance.objects.filter(date=date)

    paginator = CustomPageNumberPagination()
    paginator.page_size = 10
    paginated_result = paginator.paginate_queryset(attendances, request)

    records = [{
        "employee": record.employee.name,
        "check_in": record.check_in,
        "check_out": record.check_out,
        "deductions": 15,
        "extra": 10
    }
        for record in paginated_result]

    data = {
        'total_pages': paginator.page.paginator.num_pages,
        'page': paginator.page.number,
        'count': paginator.page.paginator.count,
        'next': paginator.get_next_link(),
        'previous': paginator.get_previous_link(),
        "data": records,

    }

    return Response(data, status=status.HTTP_200_OK)


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
