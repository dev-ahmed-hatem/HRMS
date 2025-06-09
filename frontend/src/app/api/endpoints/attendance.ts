import { Attendance } from "@/types/attendance";
import api from "../apiSlice";
import qs from "query-string";

export const attendanceEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getDayAttendance: builder.query<Attendance[], Record<string, any> | void>({
      query: (params) => ({
        url: `employees/attendance/?${qs.stringify(params || {})}`,
        method: "GET",
      }),
      providesTags: (results) =>
        results
          ? [
              ...results.map((attendance) => ({
                type: "Attendance" as const,
                id: attendance.id,
              })),
              { type: "Attendance", id: "LIST" },
            ]
          : [{ type: "Attendance", id: "LIST" }],
    }),
  }),
});

export const { useGetDayAttendanceQuery } = attendanceEndpoints;
