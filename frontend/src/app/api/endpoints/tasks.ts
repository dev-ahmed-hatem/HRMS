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
      providesTags: [{ type: "Task", id: "LIST" }],
    }),
    getTasks: builder.query<
      PaginatedResponse<Task>,
      Record<string, any> | void
    >({
      query: (params) => ({
        url: `/projects/tasks/?${qs.stringify(params || {})}`,
        method: "GET",
      }),
      providesTags: (results) =>
        results?.data
          ? [
              ...results.data.map((task) => ({
                type: "Task" as const,
                id: task.id,
              })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),
    getTask: builder.query<
      Task,
      { id: string; format: "detailed" | "form_data" }
    >({
      query: ({ id, format }) => ({
        url: `projects/tasks/${id}/${format}/`,
        method: "GET",
      }),
      providesTags: (res, error, arg) => [{ type: "Task", id: arg.id }],
    }),
    task: builder.mutation<
      Task,
      { data?: Partial<Task>; method: string; url: string }
    >({
      query: ({ data, method, url }) => ({
        url: url || "projects/tasks/",
        method: method || "DELETE",
        data,
      }),
    }),
  }),
});

export const {
  useGetTasksStatsQuery,
  useGetTasksQuery,
  useGetTaskQuery,
  useTaskMutation,
} = tasksEndpoints;
