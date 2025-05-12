import { Outlet, useMatch } from "react-router";
import EmployeesList from "./EmployeesList";

const EmployeesPage = () => {
  const isEmployees = useMatch("/employees");

  if (!isEmployees) return <Outlet />;
  return <EmployeesList />;
};

export default EmployeesPage;
