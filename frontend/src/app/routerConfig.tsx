import { RouteObject } from "react-router";
import appRoutes, { AppRoute } from "./appRoutes";
import EmployeeProfilePage from "../pages/employees/EmployeeProfilePage";

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

const addChildrenRoutes = function (
  appRoutes: AppRoute[],
  routePath: string,
  children: RouteObject[],
  parentPath?: string
): AppRoute[] {
  return appRoutes.map((route) => {
    const currentRoutePath = parentPath
      ? `${parentPath}/${route.path}`
      : route.path;

    if (currentRoutePath === routePath) {
      return {
        ...route,
        children: route.children ? route.children.concat(children) : children,
      } as RouteObject;
    }

    if (route.children?.length) {
      return {
        ...route,
        children: addChildrenRoutes(
          route.children,
          routePath,
          children,
          currentRoutePath
        ),
      };
    }

    return route;
  });
};

const routes: RouteObject[] = addChildrenRoutes(appRoutes, "employees", [
  { path: "employee-profile/:emp_id", element: <EmployeeProfilePage /> },
]);

export default routes;
