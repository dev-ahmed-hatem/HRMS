import Base from "../pages/Base";
import EmployeesPage from "../pages/employees/EmployeesPage";
import Error from "../pages/Error";
import { FaUser, FaCalendarCheck, FaMoneyBill, FaFile } from "react-icons/fa";
import { FaDiagramProject, FaCalendarDays } from "react-icons/fa6";
import { GiReceiveMoney, GiPayMoney, GiMoneyStack } from "react-icons/gi";
import { LuNotebookPen } from "react-icons/lu";
import { MdAssignment } from "react-icons/md";
import { RouteObject } from "react-router";

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
        element: <EmployeesPage />,
        icon: <FaDiagramProject />,
        label: "المشاريع",
      },
      {
        path: "tasks",
        element: <EmployeesPage />,
        icon: <MdAssignment />,
        label: "التكليفات",
      },
      {
        path: "attendance",
        element: <EmployeesPage />,
        icon: <FaCalendarCheck />,
        label: "الحضور والانصراف",
      },

      {
        path: "financials",
        icon: <FaMoneyBill />,
        label: "الماليات",
        element: <EmployeesPage />,
        children: [
          {
            path: "incomes",
            element: <EmployeesPage />,
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
            label: "المرتبات",
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
