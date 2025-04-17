import Base from "../pages/Base";
import EmployeesPage from "../pages/employees/EmployeesPage";
import Error from "../pages/Error";
import { FaUser, FaCalendarCheck, FaMoneyBill, FaFile } from "react-icons/fa";
import { FaDiagramProject, FaCalendarDays } from "react-icons/fa6";
import { GiReceiveMoney, GiPayMoney, GiMoneyStack } from "react-icons/gi";
import { LuNotebookPen } from "react-icons/lu";
import { MdAssignment } from "react-icons/md";
import { RouteObject } from "react-router";
import ProjectsPage from "../pages/projects/ProjectsPage";
import TasksPage from "../pages/tasks/TasksPage";
import AttendancePage from "../pages/AttendancePage";
import FinancialsPage from "../pages/financials/FinancialsPage";

export type AppRoute = RouteObject & {
  key?: string;
  label?: string;
  icon?: React.ReactNode;
  children?: AppRoute[];
};

export const appRoutes: AppRoute[] = [
  {
    path: "",
    element: <Base />,
    errorElement: <Error />,
    children: [
      {
        path: "employees",
        element: <EmployeesPage />,
        icon: <FaUser />,
        label: "الموظفين",
      },
      {
        path: "projects",
        element: <ProjectsPage />,
        icon: <FaDiagramProject />,
        label: "المشاريع",
      },
      {
        path: "tasks",
        element: <TasksPage />,
        icon: <MdAssignment />,
        label: "المهام",
      },
      {
        path: "attendance",
        element: <AttendancePage />,
        icon: <FaCalendarCheck />,
        label: "الحضور والانصراف",
      },
      {
        path: "financials",
        icon: <FaMoneyBill />,
        label: "الماليات",
        element: <FinancialsPage />,
        children: [
          {
            path: "incomes",
            element: <FinancialsPage />,
            icon: <GiReceiveMoney />,
            label: "الإيرادات",
          },
          {
            path: "expenses",
            element: <EmployeesPage />,
            icon: <GiPayMoney />,
            label: "المصروفات",
          },
          {
            path: "salaries",
            element: <EmployeesPage />,
            icon: <GiMoneyStack />,
            label: "الرواتب",
          },
        ],
      },
      {
        path: "schedules",
        element: <EmployeesPage />,
        icon: <FaCalendarDays />,
        label: "جدول المواعيد",
      },
      {
        path: "notes",
        element: <EmployeesPage />,
        icon: <LuNotebookPen />,
        label: "المذكرات",
      },
      {
        path: "files",
        element: <EmployeesPage />,
        icon: <FaFile />,
        label: "الملفات",
      },
    ],
  },
];

export default appRoutes;
