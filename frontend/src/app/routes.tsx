import { RouteObject } from "react-router";
import Base from "../pages/Base";
import Error from "../pages/Error";
import EmployeesPage from "../pages/EmployeesPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Base />,
    errorElement: <Error />,
    children: [
      {
        path: "/employees",
        element: <EmployeesPage />,
      },
      {
        path: "/projects",
        element: <EmployeesPage />,
      },
      {
        path: "/tasks",
        element: <EmployeesPage />,
      },
      {
        path: "/attendance",
        element: <EmployeesPage />,
      },
      {
        path: "/incomes",
        element: <EmployeesPage />,
      },
      {
        path: "/expenses",
        element: <EmployeesPage />,
      },
      {
        path: "/salaries",
        element: <EmployeesPage />,
      },
      {
        path: "/schedules",
        element: <EmployeesPage />,
      },
      {
        path: "/files",
        element: <EmployeesPage />,
      },
    ],
  },
];

export default routes;
