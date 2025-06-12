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
import dayjs from "dayjs";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useGetDayAttendanceQuery } from "@/app/api/endpoints/attendance";
import Loading from "@/components/Loading";
import ErrorPage from "@/pages/Error";
import { useGetAllEmployeesQuery } from "@/app/api/endpoints/employees";
import { AssignedEmployee } from "@/types/employee";

type AttendanceRecord = {
  key: string | number;
  employee?: AssignedEmployee | null;
  check_in?: string | null;
  check_out?: string | null;
  editing?: boolean;
  saved: boolean;
};

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
        employee: null,
        check_in: null,
        check_out: null,
        editing: true,
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
        name: `employee-${key}`,
        value: { label: record?.employee?.name, value: record?.employee?.id },
      },
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
  const handleSave = () => {
    form
      .validateFields({ recursive: false, validateOnly: false })
      .then((values) => {
        console.log(values);
      })
      .catch((errorInfo) => {
        console.log(errorInfo);
      });
  };

  // Delete a Row
  const handleDelete = (key: string) => {
    setAttendanceRecords((prev) => prev.filter((record) => record.key !== key));
    //////////////////// TODO: check wether deleted record is savd in database or not ////////////////////
  };

  // Table Columns
  const columns = [
    {
      title: "الموظف",
      dataIndex: "employee",
      render: (employee: AssignedEmployee, record: any) =>
        record.editing && !record.saved ? (
          <Form.Item
            name={`employee-${record.key}`}
            rules={[
              { required: true, message: "اختر الموظف" },
              {
                validator: (rule, value) => {
                  if (
                    attendanceRecords.find(
                      (current) =>
                        current.employee?.id === value &&
                        current.key !== record.key
                    )
                  ) {
                    return Promise.reject(new Error("يوجد تسجيل لهذا الموظف"));
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Select
              style={{ width: "100%" }}
              placeholder="اختر الموظف"
              onChange={(value, option) =>
                handleEdit(record.key, "employee", {
                  id: value,
                  name: (
                    option as {
                      value: number;
                      label: string;
                    }
                  ).label,
                })
              }
              allowClear={false}
              showSearch={true}
              options={employees?.map((emp) => ({
                value: emp.id,
                label: emp.name,
              }))}
              optionFilterProp="label"
            />
          </Form.Item>
        ) : (
          employee.name
        ),
    },
    {
      title: "وقت الحضور",
      dataIndex: "check_in",
      render: (text: string, record: any) =>
        record.editing ? (
          <Form.Item
            name={`check-in-${record.key}`}
            rules={[{ required: true, message: "حدد وقت الحضور" }]}
          >
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
          <Form.Item
            name={`check-out-${record.key}`}
            rules={[
              {
                validator: (_, value) => {
                  const checkIn = form.getFieldValue(`check-in-${record.key}`);
                  if (!value || !checkIn || value.isAfter(checkIn)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("وقت الانصراف يجب أن يكون بعد وقت الحضور")
                  );
                },
              },
            ]}
          >
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
    refetch,
  } = useGetDayAttendanceQuery({
    date: date.format("YYYY-MM-DD"),
  });

  // fetch employees
  const {
    data: employees,
    isError: employeesError,
    isFetching: employeesFetching,
  } = useGetAllEmployeesQuery();

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
          saved: true,
        }))
      );
    }
  }, [savedAttendanceRecords]);

  if (isLoading || employeesFetching) return <Loading />;
  if (isError || employeesError) {
    return (
      <ErrorPage subtitle={"حدث خطأ أثناء تحميل بيانات الحضور"} reload={true} />
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

            {attendanceRecords.some((record) => record.editing) && (
              <Space>
                <Button
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleSave}
                  // loading={record.saving}
                >
                  حفظ
                </Button>
              </Space>
            )}
          </div>
        </>
      )}
    </Card>
  );
};

export default AttendanceRecords;
