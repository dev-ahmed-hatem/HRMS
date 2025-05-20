import { PaginatedResponse } from "@/types/paginatedResponse";
import api from "../apiSlice";
import { Project, ProjectStatus } from "@/types/project";
import qs from "query-string";
import { ProjectsStats } from "@/types/project";

export const projectsEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjectsStats: builder.query<ProjectsStats, void>({
      query: () => ({
        url: "/projects/projects-stats/",
        method: "GET",
      }),
    }),
    getProjects: builder.query<
      PaginatedResponse<Project>,
      Record<string, any> | void
    >({
      query: (params) => ({
        url: `/projects/projects/?${qs.stringify(params || {})}`,
        method: "GET",
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((project) => ({
                type: "Project" as const,
                id: project.id,
              })),
              { type: "Project", id: "LIST" },
            ]
          : [{ type: "Project", id: "LIST" }],
    }),
    getProject: builder.query<
      Project,
      { id: string; format: "detailed" | "form_data" }
    >({
      query: ({ id, format }) => ({
        url: `/projects/projects/${id}/${format}/`,
        method: "GET",
      }),
      providesTags: (res, error, arg) => [{ type: "Project", id: arg.id }],
    }),
    switchProjectStatus: builder.mutation<
      { status: ProjectStatus },
      { id: string; status: string }
    >({
      query: ({ id, status }) => ({
        url: `/projects/projects/${id}/change_status/`,
        method: "POST",
        data: { status },
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
  }),
});

export const {
  useGetProjectsStatsQuery,
  useGetProjectsQuery,
  useGetProjectQuery,
  useSwitchProjectStatusMutation,
} = projectsEndpoints;
