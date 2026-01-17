import { axiosBaseQueryError } from "@/app/api/axiosBaseQuery";
import { useGetEmployeeQuery } from "@/app/api/endpoints/employees";
import { useAppSelector } from "@/app/redux/hooks";
import Loading from "@/components/Loading";
import Error from "@/pages/ErrorPage";
import EmployeeDataForm from "./EmployeeDataForm";
import { Employee } from "@/types/employee";

const EmployeeDataTab = () => {
  const employee = useAppSelector((state) => state.employee.employee)!;

  const {
    data: employeeData,
    isFetching,
    isError,
    error: employeeError,
  } = useGetEmployeeQuery({ id: employee.id.toString(), format: "form_data" });

  if (isFetching) return <Loading />;
  if (isError) {
    const error_title =
      (employeeError as axiosBaseQueryError).status === 404
        ? "موظف غير موجود! تأكد من كود الموظف المدخل."
        : undefined;

    return <Error subtitle={error_title} reload={error_title === undefined} />;
  }
  return <EmployeeDataForm initialValues={employeeData as Omit<Employee, "mode">} />;
};

export default EmployeeDataTab;
