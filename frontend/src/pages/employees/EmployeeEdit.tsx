import { useGetDetailedEmployeeQuery } from "@/app/api/endpoints/employees";
import { useParams } from "react-router";
import Error from "../Error";
import Loading from "@/components/Loading";
import EmployeeForm from "./EmployeeForm";
import { axiosBaseQueryError } from "@/app/api/axiosBaseQuery";

const EmployeeEdit = () => {
  const { emp_id } = useParams();
  if (!emp_id) return <Error />;

  const {
    data: employeeData,
    isFetching,
    isError,
    error: employeeError,
  } = useGetDetailedEmployeeQuery(emp_id);

  if (isFetching) return <Loading />;
  if (isError) {
    const error_title =
      (employeeError as axiosBaseQueryError).status === 404
        ? "موظف غير موجود! تأكد من كود الموظف المدخل."
        : undefined;

    return <Error subtitle={error_title} reload={error_title === undefined} />;
  }
  return <EmployeeForm initialValues={employeeData} />;
};

export default EmployeeEdit;
