import { useGetDetailedEmployeeQuery } from "@/app/api/endpoints/employees";
import { useParams } from "react-router";
import Error from "../Error";
import Loading from "@/components/Loading";
import EmployeeForm from "./EmployeeForm";

const EmployeeEdit = () => {
  const { emp_id } = useParams();
  if (!emp_id) return <Error />;

  const {
    data: employeeData,
    isFetching,
    isError,
  } = useGetDetailedEmployeeQuery(emp_id);

  if (isFetching) return <Loading />;
  if (isError) return <Error />;
  return <EmployeeForm initialValues={employeeData} />;
};

export default EmployeeEdit;
