import { Task, TasksStats } from "@/types/task";
import api from "../apiSlice";
import qs from "query-string";
import { PaginatedResponse } from "@/types/paginatedResponse";

const tasksEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getTasksStats: builder.query<TasksStats, void>({
      query: () => ({
        url: "/projects/tasks-stats/",
        method: "GET",
      }),
    }),
    getTasks: builder.query<
      PaginatedResponse<Task>,
      Record<string, any> | void
    >({
      query: (params) => ({
        url: `/projects/tasks/?${qs.stringify(params || {})}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetTasksStatsQuery, useGetTasksQuery } = tasksEndpoints;
