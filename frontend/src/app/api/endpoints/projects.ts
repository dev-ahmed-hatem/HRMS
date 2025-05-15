import { PaginatedResponse } from "@/types/paginatedResponse";
import api from "../apiSlice";
import { Project } from "@/types/project";
import qs from "query-string";
import { ProjectStats } from "@/types/project";

const projectsEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjectsStats: builder.query<ProjectStats, void>({
      query: () => ({
        url: "/projects/stats/",
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
  }),
});

export const {
  useGetProjectsStatsQuery,
  useGetProjectsQuery,
  useGetProjectQuery,
} = projectsEndpoints;
