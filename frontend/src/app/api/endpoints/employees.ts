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
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((employee) => ({
                type: "Employee" as const,
                id: employee.id,
              })),
              { type: "Employee", id: "LIST" },
            ]
          : [{ type: "Employee", id: "LIST" }],
    }),
    getDetailedEmployee: builder.query<Employee, string>({
      query: (id) => ({
        url: `/employees/employees/${id}/detailed/`,
        method: "GET",
      }),
    }),
    switchEmployeeActive: builder.mutation<{ is_active: boolean }, string>({
      query: (id) => ({
        url: `/employees/employees/${id}/switch_active/`,
        method: "GET",
      }),
    }),
    deleteEmployee: builder.mutation<void, string>({
      query: (id) => ({
        url: `/employees/employees/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Employee", id: "LIST" }],
    }),
    getPaginatedDepartments: builder.query<
      PaginatedResponse<Department>,
      Record<string, any> | void
    >({
      query: (params) => ({
        url: `/employees/departments?${qs.stringify(params || {})}`,
      }),
    }),
    getAllDepartments: builder.query<Department[], Record<string, any> | void>({
      query: (params) => ({
        url: `/employees/departments?no_pagination=true&${qs.stringify(
          params || {}
        )}`,
      }),
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetDetailedEmployeeQuery,
  useSwitchEmployeeActiveMutation,
  useDeleteEmployeeMutation,
  useGetAllDepartmentsQuery,
  useGetPaginatedDepartmentsQuery,
} = employees;
