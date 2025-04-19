import { RouteObject } from "react-router";
import appRoutes, { AppRoute } from "./appRoutes";
import EmployeeProfilePage from "@/pages/employees/EmployeeProfilePage";
import AddEmployee from "@/pages/employees/AddEmployee";
import AddProject from "@/pages/projects/AddProject";
import ProjectProfilePage from "@/pages/projects/ProjectProfilePage";
import TaskProfilePage from "@/pages/tasks/TaskProfilePage";
import AddTask from "@/pages/tasks/AddTask";
import FinancialForm from "@/pages/financials/FinancialForm";
import FinancialProfilePage from "@/pages/financials/FinancialProfilePage";
import SalaryForm from "@/pages/financials/SalaryForm";
import AddSchedule from "@/pages/schedules/AddSchedule";

const alterRoute = function (
  appRoutes: AppRoute[],
  routePath: string,
  newRoute: RouteObject,
  parentPath?: string
): AppRoute[] {
  return appRoutes.map((route) => {
    const currentRoutePath = parentPath
      ? `${parentPath}/${route.path}`
      : route.path;

    if (currentRoutePath === routePath) {
      return { ...route, ...newRoute } as RouteObject;
    }

    if (route.children?.length) {
      return {
        ...route,
        children: alterRoute(
          route.children,
          routePath,
          newRoute,
          currentRoutePath
        ),
      };
    }

    return route;
  });
};

const addSubRoutes = (
  appRoutes: AppRoute[],
  subRoutes: { [key: string]: RouteObject[] },
  parentPath?: string
): AppRoute[] => {
  return appRoutes.map((route) => {
    const currentRoutePath = parentPath
      ? `${parentPath}/${route.path}`
      : route.path;

    const matchedChildren = subRoutes[currentRoutePath!];

    return {
      ...route,
      children: [
        ...(matchedChildren || []),
        ...(route.children
          ? addSubRoutes(route.children, subRoutes, currentRoutePath)
          : []),
      ],
    } as AppRoute;
  });
};

let routes: RouteObject[] = addSubRoutes(appRoutes, {
  employees: [
    { path: "employee-profile/:emp_id", element: <EmployeeProfilePage /> },
    { path: "add", element: <AddEmployee /> },
  ],
  projects: [
    { path: "project/:project_id", element: <ProjectProfilePage /> },
    { path: "add", element: <AddProject /> },
  ],
  tasks: [
    { path: "task/:task_id", element: <TaskProfilePage /> },
    { path: "add", element: <AddTask /> },
  ],
  "financials/incomes": [
    // { path: "", element: <FinancialRecords financialItem="income" /> },
    { path: "add", element: <FinancialForm financialItem="income" /> },
    { path: ":income_id", element: <FinancialProfilePage /> },
  ],
  "financials/expenses": [
    // { path: "", element: <FinancialRecords financialItem="expense" /> },
    { path: "add", element: <FinancialForm financialItem="expense" /> },
    { path: ":expense_id", element: <FinancialProfilePage /> },
  ],
  "financials/salaries": [{ path: "edit", element: <SalaryForm /> }],
  schedules: [{ path: "add", element: <AddSchedule /> }],
});

export default routes;
