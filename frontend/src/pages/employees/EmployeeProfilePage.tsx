import { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Tabs,
  Button,
  Switch,
  Image,
  Space,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getInitials } from "../../utils";
import { Employee } from "../../types/employee";
import JopDetails from "../../components/employee/JopDetails";
import PersonalInfo from "../../components/employee/PersonalInfo";
import Performance from "../../components/employee/Performance";
import Attendance from "../../components/employee/Attendance";
import SalaryHistory from "../../components/employee/SalaryHistory";
import {
  employeesEndpoints,
  useDeleteEmployeeMutation,
  useGetEmployeeQuery,
  useSwitchEmployeeActiveMutation,
} from "@/app/api/endpoints/employees";
import { useParams } from "react-router";
import Loading from "@/components/Loading";
import Error from "../Error";
import { useNavigate } from "react-router";
import { axiosBaseQueryError } from "@/app/api/axiosBaseQuery";
import { useAppDispatch } from "@/app/redux/hooks";
import { useNotification } from "@/providers/NotificationProvider";
import EmployeeAccount from "@/components/employee/EmployeeAccount";

// Mock Project data
export const mockProjects = [
  {
    id: "1",
    name: "تطوير نظام إدارة الموارد البشرية",
    status: "ongoing",
    start_date: "2024-01-15",
    end_date: "2024-06-30",
    progress_started: "2024-01-20T08:00:00",
    client: "شركة التقنية المتحدة",
    budget: 500000,
    description:
      "تطوير نظام متكامل لإدارة الموارد البشرية يشمل التوظيف والحضور والرواتب",
    created_at: "2023-12-10T10:00:00",
    created_by: 101,
    supervisors: [1, 3], // Employee IDs
  },
  {
    id: 2,
    name: "تحديث البنية التحتية للشبكة",
    status: "completed",
    start_date: "2023-11-01",
    end_date: "2024-02-28",
    progress_started: "2023-11-05T09:00:00",
    client: "إدارة تكنولوجيا المعلومات",
    budget: 250000,
    description: "ترقية كاملة للبنية التحتية للشبكة وتحسين الأمان",
    created_at: "2023-10-20T14:30:00",
    created_by: 1,
    supervisors: [1],
  },
  {
    id: 3,
    name: "تطبيق الهواتف المحمولة للعملاء",
    status: "ongoing",
    start_date: "2024-02-01",
    end_date: "2024-09-30",
    progress_started: "2024-02-10T08:30:00",
    client: "قطاع التجزئة",
    budget: 750000,
    description: "تطوير تطبيق جوال للعملاء لتصفح المنتجات وإجراء الطلبات",
    created_at: "2023-12-15T11:00:00",
    created_by: 102,
    supervisors: [1, 2],
  },
  {
    id: 4,
    name: "نظام إدارة المخزون الذكي",
    status: "paused",
    start_date: "2023-09-01",
    end_date: "2024-03-31",
    progress_started: "2023-09-10T10:00:00",
    client: "مستودعات الشرق",
    budget: 300000,
    description: "نظام متقدم لإدارة المخزون باستخدام الذكاء الاصطناعي",
    created_at: "2023-08-20T16:00:00",
    created_by: 1,
    supervisors: [1],
  },
  {
    id: 5,
    name: "بوابة الخدمات الإلكترونية",
    status: "pending-approval",
    start_date: "2024-03-15",
    end_date: "2024-08-15",
    client: "الحكومة الإلكترونية",
    budget: 900000,
    description: "تطوير بوابة إلكترونية متكاملة للخدمات الحكومية",
    created_at: "2024-02-28T09:00:00",
    created_by: 103,
    supervisors: [1, 4],
  },
  {
    id: 6,
    name: "تحليل البيانات التسويقية",
    status: "completed",
    start_date: "2023-12-01",
    end_date: "2024-01-31",
    progress_started: "2023-12-05T08:00:00",
    client: "قسم التسويق",
    budget: 120000,
    description: "تحليل بيانات العملاء وتحسين استراتيجيات التسويق",
    created_at: "2023-11-20T10:30:00",
    created_by: 1,
    supervisors: [1],
  },
];

// Mock Task data
export const mockTasks = [
  {
    id: 1,
    title: "تصميم واجهة المستخدم لوحة التحكم",
    description: "تصميم واجهة مستخدم بديهية ومرنة لوحة تحكم الموظفين",
    status: "completed",
    priority: "high",
    due_date: "2024-01-31",
    project: 1,
    assigned_to: [1, 5],
    created_at: "2024-01-10T09:00:00",
    created_by: 101,
    departments: [1, 3],
  },
  {
    id: 2,
    title: "تطوير واجهة برمجة التطبيقات للرواتب",
    description: "بناء API آمن ومعالج لعمليات حساب الرواتب",
    status: "incomplete",
    priority: "high",
    due_date: "2024-03-15",
    project: 1,
    assigned_to: [1, 6],
    created_at: "2024-01-15T10:30:00",
    created_by: 101,
    departments: [2],
  },
  {
    id: 3,
    title: "اختبار اختراق النظام",
    description: "إجراء اختبارات اختراق شاملة للتأكد من أمان النظام",
    status: "incomplete",
    priority: "medium",
    due_date: "2024-04-10",
    project: 1,
    assigned_to: [1],
    created_at: "2024-02-01T14:00:00",
    created_by: 101,
    departments: [4],
  },
  {
    id: 4,
    title: "تثبيت أجهزة راوتر جديدة",
    description: "تركيب وتكوين أجهزة راوتر من الجيل الجديد",
    status: "completed",
    priority: "medium",
    due_date: "2024-01-15",
    project: 2,
    assigned_to: [1, 7],
    created_at: "2023-11-10T08:00:00",
    created_by: 102,
    departments: [5],
  },
  {
    id: 5,
    title: "تصميم شاشة تسجيل الدخول للتطبيق",
    description: "تصميم واجهة تسجيل دخول آمنة وجذابة للتطبيق",
    status: "incomplete",
    priority: "low",
    due_date: "2024-02-28",
    project: 3,
    assigned_to: [1, 8],
    created_at: "2024-02-05T11:00:00",
    created_by: 103,
    departments: [1, 3],
  },
  {
    id: 6,
    title: "ربط النظام بقاعدة البيانات",
    description: "ربط نظام إدارة المخزون بقاعدة البيانات الرئيسية",
    status: "incomplete",
    priority: "high",
    due_date: "2024-01-20", // Overdue
    project: 4,
    assigned_to: [1],
    created_at: "2023-09-15T10:00:00",
    created_by: 104,
    departments: [2, 6],
  },
  {
    id: 7,
    title: "كتابة وثائق المشروع",
    description: "إعداد كامل الوثائق الفنية والإدارية للمشروع",
    status: "completed",
    priority: "low",
    due_date: "2024-01-10",
    project: 6,
    assigned_to: [1, 9],
    created_at: "2023-12-15T15:00:00",
    created_by: 105,
    departments: [7],
  },
  {
    id: 8,
    title: "تحليل متطلبات العميل",
    description: "مقابلة العميل وتحديد المتطلبات التفصيلية",
    status: "incomplete",
    priority: "medium",
    due_date: "2024-03-20",
    project: 5,
    assigned_to: [1, 10],
    created_at: "2024-03-01T09:30:00",
    created_by: 106,
    departments: [8],
  },
  {
    id: 9,
    title: "تدريب فريق الدعم الفني",
    description: "تدريب فريق الدعم على النظام الجديد",
    status: "incomplete",
    priority: "medium",
    due_date: "2024-05-01",
    project: 1,
    assigned_to: [1, 11],
    created_at: "2024-02-20T13:00:00",
    created_by: 101,
    departments: [9],
  },
  {
    id: 10,
    title: "مراجعة كود المصدر",
    description: "مراجعة شاملة لكود المصدر للتأكد من الجودة",
    status: "incomplete",
    priority: "high",
    due_date: "2024-03-25",
    project: 1,
    assigned_to: [1],
    created_at: "2024-02-25T16:00:00",
    created_by: 101,
    departments: [2, 10],
  },
];

// Sample Employee Data
export const employee3: Employee = {
  id: 1,
  url: "http://127.0.0.1:8000/api/employees/employees/1/",
  department: "Social Media",
  gender: "ذكر",
  marital_status: "أعزب",
  mode: "عن بُعد",
  created_by: "Dev Ahmed Hatem",
  name: "Employee 1",
  email: "e@a.com",
  is_active: true,
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

  user: {
    id: 3,
    username: "aaa",
    name: "sss",
    phone: "ss",
    national_id: "as",
    is_active: true,
    is_moderator: false,
    is_superuser: false,
    is_root: false,
    last_login: "",
    is_staff: true,
  },

  attendance: [
    { date: "2025-03-10", check_in: "08:30 AM", check_out: "05:00 PM" },
    { date: "2025-03-11", check_in: "09:00 AM", check_out: "04:45 PM" },
    { date: "2025-03-12" }, // No record for this day
    { date: "2025-03-13", check_in: "07:45 AM", check_out: "05:30 PM" },
    { date: "2025-03-14" }, // No record
  ],

  salaryHistory: [
    { date: "2025-01", baseSalary: 15000, bonuses: 2000 },
    { date: "2025-02", baseSalary: 15000, bonuses: 1500 },
    { date: "2025-03", baseSalary: 15000, bonuses: 1800 },
  ],
};

const items = (employee: Employee) => [
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
    label: `حساب الموظف`,
    key: "3",
    children: <EmployeeAccount employee={employee} />,
  },
  {
    label: `الأداء الوظيفي`,
    key: "4",
    children: <Performance employeeId={employee.id} />,
  },
  {
    label: `الحضور والانصراف`,
    key: "5",
    children: <Attendance attendance={employee3.attendance} />,
  },
  {
    label: `تاريخ الراتب`,
    key: "6",
    children: <SalaryHistory salaryHistory={employee3.salaryHistory} />,
  },
];

const titledAvatar = (name: string) => (
  <Avatar size={80} className="bg-orange-700 font-semibold">
    {getInitials(name)}
  </Avatar>
);

const EmployeeProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const notification = useNotification();
  const { emp_id } = useParams();
  const {
    data: employee,
    isFetching,
    isError,
    error: employeeError,
  } = useGetEmployeeQuery({ id: emp_id as string, format: "detailed" });
  const [
    switchActive,
    { data: switchRes, isLoading: switching, isError: switchError },
  ] = useSwitchEmployeeActiveMutation();
  const [
    deleteEmployee,
    { isError: deleteError, isLoading: deleting, isSuccess: deleted },
  ] = useDeleteEmployeeMutation();

  const dispatch = useAppDispatch();

  const [imageError, setImageError] = useState(false);
  const [isActive, setIsActive] = useState<boolean | null>(null);

  const toggleStatus = () => {
    switchActive(emp_id as string);
  };

  const handleDelete = () => {
    deleteEmployee(emp_id as string);
  };

  useEffect(() => {
    if (employee) setIsActive(employee.is_active);
  }, [employee]);

  useEffect(() => {
    if (switchError) {
      notification.error({
        message: "حدث خطأ في تغيير الحالة ! برجاء إعادة المحاولة",
      });
    }
  }, [switchError]);

  useEffect(() => {
    if (switchRes) {
      if (employee) setIsActive(switchRes.is_active);
      dispatch(
        employeesEndpoints.util.updateQueryData(
          "getEmployee",
          { id: emp_id as string, format: "detailed" },
          (draft: Employee) => {
            draft.is_active = switchRes.is_active;
          }
        )
      );
      notification.success({
        message: "تم تغيير الحالة بنجاح",
      });
    }
  }, [switchRes]);

  useEffect(() => {
    if (deleteError) {
      notification.error({
        message: "حدث خطأ أثناء حذف الموظف ! برجاء إعادة المحاولة",
      });
    }
  }, [deleteError]);

  useEffect(() => {
    if (deleted) {
      notification.success({
        message: "تم حذف الموظف بنجاح",
      });

      navigate("/employees");
    }
  }, [deleted]);

  if (isFetching) return <Loading />;
  if (isError) {
    const error_title =
      (employeeError as axiosBaseQueryError).status === 404
        ? "موظف غير موجود! تأكد من كود الموظف المدخل."
        : undefined;

    return <Error subtitle={error_title} reload={error_title === undefined} />;
  }
  return (
    <>
      {/* Employee Header */}
      <Card className="shadow-lg rounded-xl">
        <div className="flex items-center justify-between flex-wrap gap-y-6">
          {/* Avatar with Fallback */}
          <div className="flex items-center flex-wrap gap-4">
            {employee!.image && !imageError ? (
              <Space size={12} className="rounded">
                <Image
                  width={100}
                  src={employee!.image}
                  className="rounded-full"
                  onError={() => {
                    setImageError(true);
                  }}
                  preview={{
                    movable: false,
                    toolbarRender: () => <></>,
                  }}
                />
              </Space>
            ) : (
              titledAvatar(employee!.name)
            )}

            <div>
              <h2 className="text-xl font-bold">{employee!.name}</h2>
              <p className="text-gray-500">{employee!.position}</p>
            </div>
          </div>

          {/* Status */}
          {isActive !== null && (
            <div className="flex items-center gap-2">
              <Switch
                checked={isActive!}
                onChange={toggleStatus}
                checkedChildren="نشط"
                unCheckedChildren="غير نشط"
                loading={switching}
              />
            </div>
          )}
        </div>
      </Card>

      {/* Tabs Section */}
      <Tabs
        renderTabBar={(props, DefaultTabBar) => (
          <DefaultTabBar {...props} className="md:ps-2" />
        )}
        className="mt-4"
        direction="rtl"
        items={items(employee!)}
      />

      <div className="flex justify-between mt-2 flex-wrap gap-2">
        {/* Meta Data */}
        <div className="flex gap-1 flex-col text-sm">
          <div>
            <span className="font-medium text-gray-700" dir="rtl">
              تاريخ الإضافة:{" "}
            </span>
            {employee!.created_at}
          </div>
          <div>
            <span className="font-medium text-gray-700">بواسطة: </span>
            {employee!.created_by || "غير مسجل"}
          </div>
        </div>

        {/* Action Button */}
        <div className="btn-wrapper flex md:justify-end mt-4 flex-wrap gap-4">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              navigate(`/employees/edit/${emp_id}`);
            }}
          >
            تعديل البيانات
          </Button>
          <Popconfirm
            title="هل أنت متأكد من حذف هذا الموظف؟"
            onConfirm={handleDelete}
            okText="نعم"
            cancelText="لا"
          >
            <Button
              className="enabled:bg-red-500 enabled:border-red-500 enabled:shadow-[0_2px_0_rgba(0,58,58,0.31)]
            enabled:hover:border-red-400 enabled:hover:bg-red-400 enabled:text-white"
              icon={<DeleteOutlined />}
              loading={deleting}
            >
              حذف الموظف
            </Button>
          </Popconfirm>
        </div>
      </div>
    </>
  );
};

export default EmployeeProfilePage;
