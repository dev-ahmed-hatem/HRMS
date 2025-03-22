import { useEffect, useState } from "react";
import {
  Card,
  DatePicker,
  Table,
  Button,
  Select,
  Popconfirm,
  TimePicker,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { DeleteOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";

const { Option } = Select;

const employees = ["محمد", "أحمد", "سارة", "خالد", "يوسف"];

const savedAttendanceRecords = [
  {
    key: "rec-001",
    employee: "محمد",
    checkIn: "08:30",
    checkOut: "17:00",
    editable: false, // Saved records are not editable
  },
  {
    key: "rec-002",
    employee: "أحمد",
    checkIn: "09:00",
    checkOut: "18:00",
    editable: false, // Saved records are not editable
  },
];

const AttendanceRecords = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([
    ...savedAttendanceRecords,
  ]);
  const [date, setDate] = useState(dayjs()); // Default to today's date

  // Add New Attendance Row
  const addAttendanceRow = () => {
    setAttendanceRecords([
      ...attendanceRecords,
      {
        key: Date.now(),
        employee: "",
        checkIn: null,
        checkOut: null,
        editable: true,
      },
    ]);
  };

  // Handle Cell Editing
  const handleEdit = (key: number, field: string, value: any) => {
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.key === key ? { ...record, [field]: value } : record
      )
    );
  };

  // Delete a Row
  const handleDelete = (key: number) => {
    setAttendanceRecords((prev) => prev.filter((record) => record.key !== key));
  };

  // Table Columns
  const columns = [
    {
      title: "الموظف",
      dataIndex: "employee",
      render: (text: string, record: any) =>
        record.editable ? (
          <Select
            style={{ width: "100%" }}
            placeholder="اختر الموظف"
            value={text || undefined}
            onChange={(value) => handleEdit(record.key, "employee", value)}
          >
            {employees.map((name) => (
              <Option key={name} value={name}>
                {name}
              </Option>
            ))}
          </Select>
        ) : (
          text
        ),
    },
    {
      title: "وقت الحضور",
      dataIndex: "checkIn",
      render: (text: string, record: any) =>
        record.editable ? (
          <TimePicker
            placeholder="حدد وقت الحضور"
            className="w-40"
            value={text ? dayjs(text, "HH:mm") : null}
            onChange={(value) =>
              handleEdit(record.key, "checkIn", value?.format("HH:mm"))
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "وقت الانصراف",
      dataIndex: "checkOut",
      render: (text: string, record: any) =>
        record.editable ? (
          <TimePicker
            placeholder="حدد وقت الانصراف"
            className="w-40"
            value={text ? dayjs(text, "HH:mm") : null}
            onChange={(value) =>
              handleEdit(record.key, "checkOut", value?.format("HH:mm"))
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "إجراءات",
      dataIndex: "actions",
      render: (_: any, record: any) => (
        <Popconfirm
          title="هل أنت متأكد من حذف هذا السجل؟"
          onConfirm={() => handleDelete(record.key)}
          okText="نعم"
          cancelText="لا"
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card>
      {/* Date Picker for Attendance Records */}
      <div className="mb-4 flex gap-5 items-center flex-wrap">
        <h2 className="text-lg font-bold">تاريخ اليوم:</h2>
        <DatePicker
          value={date}
          onChange={(value) => setDate(value)}
          format="YYYY-MM-DD"
        />
      </div>

      {/* Attendance Table */}
      <Table
        columns={columns}
        dataSource={attendanceRecords}
        pagination={false}
        className="calypso-header"
        scroll={{ x: "max-content" }}
      />

      {/* Add Row Button */}

      <div className="flex md:justify-between items-center mt-4 flex-wrap gap-4">
        <Button
          type="dashed"
          onClick={addAttendanceRow}
          icon={<PlusOutlined />}
        >
          إضافة صف
        </Button>

        {attendanceRecords.some((value) => value.editable === true) && (
          <Button type="primary" icon={<SaveOutlined />}>
            حفظ
          </Button>
        )}
      </div>
    </Card>
  );
};

export default AttendanceRecords;
