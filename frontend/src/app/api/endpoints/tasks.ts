import { Task, TasksStats, TaskStatus } from "@/types/task";
import api from "../apiSlice";
import qs from "query-string";
import { PaginatedResponse } from "@/types/paginatedResponse";

export const tasksEndpoints = api.injectEndpoints({
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
    switchTaskState: builder.mutation<
      { status: TaskStatus },
      { task_id: string; project_id: string }
    >({
      query: ({ task_id, project_id }) => ({
        url: `/projects/tasks/${task_id}/switch_state/`,
        method: "GET",
      }),
      invalidatesTags: (res, error, arg) => [
        { type: "Task", id: "LIST" },
        { type: "Project", id: "LIST" },
        { type: "Project", id: arg.project_id },
      ],
    }),
    task: builder.mutation<
      Task,
      { data?: Partial<Task>; method: string; url: string }
    >({
      query: ({ data, method, url }) => ({
        url: url || "projects/tasks/",
        method: method || "POST",
        data,
      }),
      async onQueryStarted(queryArgument, mutationLifeCycleApi) {
        try {
          await mutationLifeCycleApi.queryFulfilled;

          // Invalidate the Employee LIST tag on successful POST
          mutationLifeCycleApi.dispatch(
            api.util.invalidateTags([
              { type: "Task", id: "LIST" },
              { type: "Task", id: queryArgument.data?.id },
            ])
          );
        } catch {
          // Do nothing if the request fails
        }
      },
    }),
  }),
});

export const {
  useGetTasksStatsQuery,
  useGetTasksQuery,
  useGetTaskQuery,
  useSwitchTaskStateMutation,
  useTaskMutation,
} = tasksEndpoints;
