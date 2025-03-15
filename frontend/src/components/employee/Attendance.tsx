import { Table, DatePicker, Typography, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { Employee } from "../../types/employee";

const Attendance = ({ attendance }: { attendance: Employee["attendance"] }) => {
  const [selectedMonth, setSelectedMonth] = useState<Dayjs>(dayjs()); // Default to current week

  // Ensure all 7 days are shown
  const getMonthAttendance = () => {
    const startOfMonth = selectedMonth.startOf("month");
    const endOfMonth = selectedMonth.endOf("month");

    let monthData = [];

    for (let i = 0; i < endOfMonth.date(); i++) {
      const day = startOfMonth.add(i, "day");
      const record = attendance.find((att) =>
        dayjs(att.date).isSame(day, "day")
      );

      monthData.push({
        date: day.format("YYYY-MM-DD"),
        checkIn: record?.checkIn || "-",
        checkOut: record?.checkOut || "-",
      });
    }
    return monthData;
  };

  // Table columns
  const columns: ColumnsType<Employee["attendance"][number]> = [
    {
      title: "التاريخ",
      dataIndex: "date",
      key: "date",
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "اليوم",
      dataIndex: "date",
      key: "day",
      render: (date) => dayjs(date).format("dddd"),
    },
    {
      title: "وقت الحضور",
      dataIndex: "checkIn",
      key: "checkIn",
    },
    {
      title: "وقت المغادرة",
      dataIndex: "checkOut",
      key: "checkOut",
    },
  ];

  return (
    <div>
      {/* Week Picker */}
      <Space
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <DatePicker
          picker="month"
          onChange={(date) => setSelectedMonth(date || dayjs())}
          format="[شهر ]MM - [سنة ]YYYY"
          placeholder="اختر الشهر"
          className="w-full md:w-60"
        />
      </Space>

      {/* Attendance Table */}
      <Table
        dataSource={getMonthAttendance()}
        columns={columns}
        rowKey="date"
        pagination={false}
        bordered
        title={() =>
          `سجل الحضور - شهر ${dayjs(selectedMonth).format("MM")} - سنة ${dayjs(
            selectedMonth
          ).format("YYYY")}`
        }
        scroll={{ x: "max-content" }}
      />
    </div>
  );
};

export default Attendance;
