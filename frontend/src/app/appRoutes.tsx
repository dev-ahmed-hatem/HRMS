import Base from "@/pages/Base";
import EmployeesPage from "@/pages/employees/EmployeesPage";
import Error from "@/pages/Error";
import { FaUser, FaCalendarCheck, FaMoneyBill, FaFile } from "react-icons/fa";
import { FaDiagramProject, FaCalendarDays } from "react-icons/fa6";
import { GiReceiveMoney, GiPayMoney, GiMoneyStack } from "react-icons/gi";
import { LuNotebookPen } from "react-icons/lu";
import { MdAssignment } from "react-icons/md";
import { RouteObject } from "react-router";
import ProjectsPage from "@/pages/projects/ProjectsPage";
import TasksPage from "@/pages/tasks/TasksPage";
import AttendancePage from "@/pages/AttendancePage";
import FinancialsPage from "@/pages/financials/FinancialsPage";
import FilesPage from "@/pages/files/FilesPage";
import SalariesPage from "@/pages/financials/Salaries";
import FinancialRecords from "@/pages/financials/FinancialRecords";
import NotesPage from "@/pages/notes/NotesPage";
import SchedulesPage from "@/pages/schedules/SchedulesPage";

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
            element: <FinancialRecords financialItem="income" />,
            icon: <GiReceiveMoney />,
            label: "الإيرادات",
          },
          {
            path: "expenses",
            element: <FinancialRecords financialItem="expense" />,
            icon: <GiPayMoney />,
            label: "المصروفات",
          },
          {
            path: "salaries",
            element: <SalariesPage />,
            icon: <GiMoneyStack />,
            label: "الرواتب",
          },
        ],
      },
      {
        path: "schedules",
        element: <SchedulesPage />,
        icon: <FaCalendarDays />,
        label: "جدول المواعيد",
      },
      {
        path: "notes",
        element: <NotesPage />,
        icon: <LuNotebookPen />,
        label: "المذكرات",
      },
      {
        path: "files",
        element: <FilesPage />,
        icon: <FaFile />,
        label: "الملفات",
      },
    ],
  },
];

export default appRoutes;
