import { useState } from "react";
import { Table, DatePicker, Card } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { tablePaginationConfig } from "../../utils/antd";

const AttendanceSummary = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: 1,
      employee: "محمد أحمد",
      checkIn: "10:15",
      checkOut: "17:10",
    },
    {
      id: 2,
      employee: "سارة علي",
      checkIn: "11:05",
      checkOut: "16:45",
    },
  ]);

  const [standardCheckIn, setStandardCheckIn] = useState("10:00");
  const [standardCheckOut, setStandardCheckOut] = useState("17:00");

  // Calculate deduction based on lateness and early departure
  const calculateDeduction = (checkIn: string, checkOut: string) => {
    const checkInTime = dayjs(checkIn, "HH:mm");
    const checkOutTime = dayjs(checkOut, "HH:mm");
    const standardInTime = dayjs(standardCheckIn, "HH:mm");
    const standardOutTime = dayjs(standardCheckOut, "HH:mm");

    let lateMinutes = checkInTime.isAfter(standardInTime)
      ? checkInTime.diff(standardInTime, "minute")
      : 0;
    let earlyLeaveMinutes = checkOutTime.isBefore(standardOutTime)
      ? standardOutTime.diff(checkOutTime, "minute")
      : 0;

    return `${lateMinutes + earlyLeaveMinutes} دقيقة`;
  };

  const columns = [
    {
      title: "الموظف",
      dataIndex: "employee",
      key: "employee",
    },
    {
      title: "وقت الحضور",
      dataIndex: "checkIn",
      key: "checkIn",
    },
    {
      title: "وقت الانصراف",
      dataIndex: "checkOut",
      key: "checkOut",
    },
    {
      title: "الخصم (دقائق)",
      key: "deduction",
      render: (_: string, record: { checkIn: string; checkOut: string }) =>
        calculateDeduction(record.checkIn, record.checkOut),
    },
  ];

  return (
    <Card title="ملخص الحضور" className="shadow-lg rounded-xl">
      <div className="flex items-center gap-4 mb-4">
        <span className="font-semibold">اختر اليوم:</span>
        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          format="YYYY-MM-DD"
        />
      </div>
      <Table
        dataSource={attendanceRecords}
        columns={columns}
        pagination={tablePaginationConfig()}
        rowKey="id"
        className="calypso-header"
        scroll={{ x: "max-content" }}
      />
    </Card>
  );
};

export default AttendanceSummary;
