import React from "react";
import { Card, Avatar, Tabs, Button } from "antd";
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
  id: "TF2018",
  name: "تيد فيرغسون",
  gender: "ذكر",
  email: "ted.ferguson@example.com",
  phone: "+966 50 123 4567",
  address: "الرياض، المملكة العربية السعودية",
  age: 40,
  birthDate: "12 مارس 1984",
  nationalId: "1234567890",
  maritalStatus: "متزوج",
  position: "مدير",
  department: "الموارد البشرية",
  hireDate: "04 يونيو 2018",
  employeeID: "TF 2002",
  enterpriseID: "MGT 5565",
  cv: "https://example.com/ted_cv.pdf",
  avatar: "",
  mode: "من المقر",

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
  return (
    <div className="padding-container mx-auto py-6">
      {/* Employee Header */}
      <Card className="shadow-lg rounded-xl">
        <div className="flex items-center justify-between flex-wrap gap-y-6">
          {/* Avatar with Fallback */}
          <div className="flex items-center flex-wrap gap-4">
            {employee.avatar ? (
              <Avatar size={80} src={employee.avatar} />
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
          <div>
            <Button type="primary">نشط</Button>
          </div>
        </div>
      </Card>

      {/* Tabs Section */}
      <Tabs
        // defaultActiveKey="0"
        className="mt-4"
        items={items}
        direction="rtl"
      />

      {/* Action Button */}
      <div className="flex md:justify-end mt-4 flex-wrap gap-4">
        <Button type="primary" icon={<EditOutlined />}>
          تعديل المعلومات
        </Button>
        <Button
          className="bg-red-500 border-red-500 hover:border-red-400 hover:bg-red-400 text-white"
          icon={<DeleteOutlined />}
        >
          حذف الموظف
        </Button>
      </div>
    </div>
  );
};

export default EmployeeProfilePage;
