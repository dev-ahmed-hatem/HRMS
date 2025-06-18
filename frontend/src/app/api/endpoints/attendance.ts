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
      providesTags: (results, error, arg) =>
        results
          ? [
              ...results.map((attendance) => ({
                type: "Attendance" as const,
                id: `${arg?.date ?? "unprovided"}${attendance.id}`,
              })),
              { type: "Attendance", id: arg?.date || "LIST" },
            ]
          : [{ type: "Attendance", id: arg?.date || "LIST" }],
    }),
    updateDayAttendance: builder.mutation<
      void,
      {
        date: string;
        records: any;
      }
    >({
      query: (data) => ({
        url: "employees/update-day-attendance/?",
        method: "POST",
        data,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "Attendance", id: arg.date ?? "LIST" },
      ],
    }),
    deleteAttendanceRecord: builder.mutation<void, string>({
      query: (id) => ({
        url: `/employees/attendance/${id}/`,
        method: "DELETE",
      }),
      // invalidation will be applied manually within the component
    }),
  }),
});

export const {
  useGetDayAttendanceQuery,
  useUpdateDayAttendanceMutation,
  useDeleteAttendanceRecordMutation,
} = attendanceEndpoints;
