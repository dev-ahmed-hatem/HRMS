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
  }),
});

export const { useGetEmployeesQuery } = employees;
