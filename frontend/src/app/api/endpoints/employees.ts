import { Department } from "@/types/department";
import api from "../apiSlice";
import { Employee } from "@/types/employee";
import { PaginatedResponse } from "@/types/paginatedResponse";
import qs from "query-string";

const employees = api.injectEndpoints({
  endpoints: (builder) => ({
    getEmployees: builder.query<
      PaginatedResponse<Employee>,
      Record<string, any> | void
    >({
      query: (params) => ({
        url: `/employees/employees?${qs.stringify(params || {})}`,
        method: "GET",
      }),
    }),
    getDetailedEmployee: builder.query<Employee, string>({
      query: (id) => ({
        url: `/employees/employees/${id}/detailed/`,
        method: "GET",
      }),
    }),
    getDepartments: builder.query<
      PaginatedResponse<Department> | Department[],
      Record<string, any> | void
    >({
      query: (params) => ({
        url: `/employees/departments?${qs.stringify(params || {})}`,
      }),
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetDepartmentsQuery,
  useGetDetailedEmployeeQuery,
} = employees;
