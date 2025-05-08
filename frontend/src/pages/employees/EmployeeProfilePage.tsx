import { useState } from "react";
import { Card, Avatar, Tabs, Button, Switch } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getInitials } from "../../utils";
import { Employee } from "../../types/employee";
import JopDetails from "../../components/employee/JopDetails";
import PersonalInfo from "../../components/employee/PersonalInfo";
import Performance from "../../components/employee/Performance";
import Attendance from "../../components/employee/Attendance";
import SalaryHistory from "../../components/employee/SalaryHistory";

// Sample Employee Data
const employee: Employee = {
  id: 1,
  url: "http://127.0.0.1:8000/api/employees/employees/1/",
  department: "Social Media",
  gender: "ذكر",
  marital_status: "أعزب",
  mode: "عن بُعد",
  created_by: "Dev Ahmed Hatem",
  name: "Employee 1",
  email: "e@a.com",
  phone: "123",
  employee_id: "E12",
  address: "16 moharam bek",
  birth_date: "2000-07-22",
  age: 25,
  national_id: "123123",
  position: "Full Stack Developer",
  hire_date: "2023-12-02",
  cv: "http://127.0.0.1:8000/media/employees/cv/Screenshot_2025-03-18_221316.png",
  image: "http://127.0.0.1:8000/media/employees/images/6mouhk.png",
  created_at: "2025-05-08T14:31:02.935535Z",

  performance: {
    totalProjects: 15,
    activeProjects: 3,
    totalAssignments: 20,
    activeAssignments: 5,
  },

  attendance: [
    { date: "2025-03-10", checkIn: "08:30 AM", checkOut: "05:00 PM" },
    { date: "2025-03-11", checkIn: "09:00 AM", checkOut: "04:45 PM" },
    { date: "2025-03-12" }, // No record for this day
    { date: "2025-03-13", checkIn: "07:45 AM", checkOut: "05:30 PM" },
    { date: "2025-03-14" }, // No record
  ],

  salaryHistory: [
    { date: "2025-01", baseSalary: 15000, bonuses: 2000 },
    { date: "2025-02", baseSalary: 15000, bonuses: 1500 },
    { date: "2025-03", baseSalary: 15000, bonuses: 1800 },
  ],
};

const items = [
  {
    label: `التفاصيل الوظيفية`,
    key: "1",
    children: <JopDetails employee={employee} />,
  },
  {
    label: `المعلومات الشخصية`,
    key: "2",
    children: <PersonalInfo employee={employee} />,
  },
  {
    label: `الأداء الوظيفي`,
    key: "3",
    children: <Performance performance={employee.performance} />,
  },
  {
    label: `الحضور والانصراف`,
    key: "4",
    children: <Attendance attendance={employee.attendance} />,
  },
  {
    label: `تاريخ الراتب`,
    key: "5",
    children: <SalaryHistory salaryHistory={employee.salaryHistory} />,
  },
];

const EmployeeProfilePage: React.FC = () => {
  const [status, setStatus] = useState("نشط");
  const toggleStatus = (checked: boolean) => {
    setStatus(checked ? "نشط" : "غير نشط");
    // Optionally: call backend to update status
  };

  return (
    <>
      {/* Employee Header */}
      <Card className="shadow-lg rounded-xl">
        <div className="flex items-center justify-between flex-wrap gap-y-6">
          {/* Avatar with Fallback */}
          <div className="flex items-center flex-wrap gap-4">
            {employee.image ? (
              <Avatar size={80} src={employee.image} />
            ) : (
              <Avatar size={80} className="bg-orange-700 font-semibold">
                {getInitials(employee.name)}
              </Avatar>
            )}

            <div>
              <h2 className="text-xl font-bold">{employee.name}</h2>
              <p className="text-gray-500">{employee.position}</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <Switch
              checked={status === "نشط"}
              onChange={toggleStatus}
              checkedChildren="نشط"
              unCheckedChildren="غير نشط"
            />
          </div>
        </div>
      </Card>

      {/* Tabs Section */}
      <Tabs
        renderTabBar={(props, DefaultTabBar) => (
          <DefaultTabBar {...props} className="md:ps-2" />
        )}
        className="mt-4"
        items={items}
        direction="rtl"
      />

      {/* Action Button */}
      <div className="flex md:justify-end mt-4 flex-wrap gap-4">
        <Button type="primary" icon={<EditOutlined />}>
          تعديل البيانات
        </Button>
        <Button
          className="enabled:bg-red-500 enabled:border-red-500 enabled:shadow-[0_2px_0_rgba(0,58,58,0.31)]
          enabled:hover:border-red-400 enabled:hover:bg-red-400 enabled:text-white"
          icon={<DeleteOutlined />}
        >
          حذف الموظف
        </Button>
      </div>
    </>
  );
};

export default EmployeeProfilePage;
