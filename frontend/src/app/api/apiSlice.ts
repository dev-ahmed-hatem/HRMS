import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "./axiosBaseQuery";

export const api = createApi({
  reducerPath: "api",
  baseQuery: axiosBaseQuery(),
  endpoints: () => ({}),
  tagTypes: ["Employee", "Project", "ProjectAssignments", "Task", "TaskAssignments", "Attendance", "User"],
  keepUnusedDataFor: 180,
  refetchOnReconnect: true,
});

export default api;
