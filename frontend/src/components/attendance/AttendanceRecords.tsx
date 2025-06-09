import { useEffect, useState } from "react";
import {
  Card,
  DatePicker,
  Table,
  Button,
  Select,
  Popconfirm,
  TimePicker,
  Space,
  Form,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useGetDayAttendanceQuery } from "@/app/api/endpoints/attendance";
import Loading from "../Loading";
import Error from "@/pages/Error";

const { Option } = Select;

const employees = ["محمد", "أحمد", "سارة", "خالد", "يوسف"];

type AttendanceRecord = {
  key: string | number;
  employee?: string;
  check_in?: string | null;
  check_out?: string | null;
  editing?: boolean;
  saving: boolean;
  saved: boolean;
};

const savedAttendanceRecords = [
  {
    key: "rec-001",
    employee: "محمد",
    check_in: "08:30",
    check_out: "17:00",
    editing: false, // Saved records are not editing
    saving: false,
    saved: false,
  },
  {
    key: "rec-002",
    employee: "أحمد",
    check_in: "09:00",
    check_out: "18:00",
    editing: false,
    saving: false,
    saved: false,
  },
];

const AttendanceRecords = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<
    AttendanceRecord[]
  >([]);
  const [form] = Form.useForm();

  const [date, setDate] = useState(dayjs()); // Default to today's date

  // Add New Attendance Row
  const addAttendanceRow = () => {
    setAttendanceRecords([
      ...attendanceRecords,
      {
        key: Date.now(),
        employee: "",
        check_in: null,
        check_out: null,
        editing: true,
        saving: false,
        saved: false,
      },
    ]);
  };

  // Handle Cell Editing
  const handleEdit = (key: string, field: string, value: any) => {
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.key === key ? { ...record, [field]: value } : record
      )
    );
    form.setFields([{ name: `${field}-${key}`, errors: undefined }]);
  };

  // Make a record editable
  const editRecord = (key: string) => {
    const record = attendanceRecords.find((record) => record.key === key);
    setAttendanceRecords((prev) =>
      prev.map((record) =>
        record.key === key ? { ...record, editing: true } : record
      )
    );

    // set initial values
    form.setFields([
      {
        name: `check-in-${key}`,
        value: record?.check_in ? dayjs(record.check_in, "HH:mm") : null,
      },
      {
        name: `check-out-${key}`,
        value: record?.check_out ? dayjs(record.check_out, "HH:mm") : null,
      },
    ]);
  };

  // save record changes
  const saveChanges = (key: string) => {
    const record = attendanceRecords.find((record) => record.key === key);
    const { employee, check_in, check_out } = record as AttendanceRecord;

    // reset record errors
    form.setFields([
      { errors: undefined, name: `employee-${key}` },
      { errors: undefined, name: `check-in-${key}` },
    ]);

    if (employee == "") {
      form.setFields([{ errors: ["اختر الموظف"], name: `employee-${key}` }]);
    }

    if (check_in === null) {
      form.setFields([{ errors: ["حدد وقت الحضور"], name: `check-in-${key}` }]);
    }

    setAttendanceRecords((prev) => [
      ...prev.map((record) =>
        record.key === key ? { ...record, saving: true } : record
      ),
    ]);
  };

  // Delete a Row
  const handleDelete = (key: string) => {
    setAttendanceRecords((prev) => prev.filter((record) => record.key !== key));
  };

  // Table Columns
  const columns = [
    {
      title: "الموظف",
      dataIndex: "employee",
      render: (text: string, record: any) =>
        record.editing && !record.saved ? (
          <Form.Item name={`employee-${record.key}`}>
            <Select
              style={{ width: "100%" }}
              placeholder="اختر الموظف"
              value={text || undefined}
              onChange={(value) => handleEdit(record.key, "employee", value)}
              allowClear={false}
            >
              {employees.map((name) => (
                <Option key={name} value={name}>
                  {name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        ) : (
          text
        ),
    },
    {
      title: "وقت الحضور",
      dataIndex: "check_in",
      render: (text: string, record: any) =>
        record.editing ? (
          <Form.Item name={`check-in-${record.key}`}>
            <TimePicker
              placeholder="حدد وقت الحضور"
              className="w-40"
              format={"HH:mm"}
              onChange={(value) =>
                handleEdit(record.key, "check_in", value?.format("HH:mm"))
              }
              allowClear={false}
            />
          </Form.Item>
        ) : (
          text
        ),
    },
    {
      title: "وقت الانصراف",
      dataIndex: "check_out",
      render: (text: string, record: any) =>
        record.editing ? (
          <Form.Item name={`check-out-${record.key}`}>
            <TimePicker
              placeholder="حدد وقت الانصراف"
              className="w-40"
              format={"HH:mm"}
              onChange={(value) =>
                handleEdit(record.key, "check_out", value?.format("HH:mm"))
              }
            />
          </Form.Item>
        ) : text ? (
          text
        ) : (
          "-"
        ),
    },
    {
      title: "إجراءات",
      dataIndex: "actions",
      render: (_: any, record: any) => (
        <div className="flex gap-4 justify-between">
          <Space>
            {!record.editing && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => editRecord(record.key)}
              />
            )}

            <Popconfirm
              title="هل أنت متأكد من حذف هذا السجل؟"
              onConfirm={() => handleDelete(record.key)}
              okText="نعم"
              cancelText="لا"
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                disabled={record.saving}
              />
            </Popconfirm>
          </Space>

          {record.editing && (
            <Space>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={() => saveChanges(record.key)}
                loading={record.saving}
              >
                حفظ
              </Button>
            </Space>
          )}
        </div>
      ),
    },
  ];

  // fetch attendance data
  const {
    data: savedAttendanceRecords,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetDayAttendanceQuery({
    date: date.format("YYYY-MM-DD"),
  });

  useEffect(() => {
    refetch();
  }, [date]);

  useEffect(() => {
    if (savedAttendanceRecords) {
      setAttendanceRecords(
        savedAttendanceRecords.map((attendance) => ({
          key: attendance.id,
          employee: attendance.employee,
          check_in: attendance.check_in,
          check_out: attendance.check_out,
          editing: false,
          saving: false,
          saved: true,
        }))
      );
    }
  }, [savedAttendanceRecords]);

  if (isLoading) return <Loading />;
  if (isError) {
    return (
      <Error subtitle={"حدث خطأ أثناء تحميل بيانات الحضور"} reload={true} />
    );
  }

  return (
    <Card>
      {/* Date Picker for Attendance Records */}
      <div className="mb-4 flex gap-5 items-center flex-wrap">
        <h2 className="text-lg font-bold">تاريخ اليوم:</h2>
        <DatePicker
          value={date}
          onChange={(value) => setDate(value)}
          format="YYYY-MM-DD"
          allowClear={false}
        />
      </div>
      {isFetching ? (
        <Loading />
      ) : (
        <>
          <Form form={form}>
            {/* Attendance Table */}
            <Table
              columns={columns}
              dataSource={attendanceRecords}
              pagination={false}
              className="calypso-header"
              scroll={{ x: "max-content" }}
            />
          </Form>

          {/* Add Row Button */}

          <div className="flex md:justify-between items-center mt-4 flex-wrap gap-4">
            <Button
              type="dashed"
              onClick={addAttendanceRow}
              icon={<PlusOutlined />}
            >
              إضافة صف
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default AttendanceRecords;
