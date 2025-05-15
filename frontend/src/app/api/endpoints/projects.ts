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
    }),
  }),
});

export const { useGetProjectsStatsQuery, useGetProjectsQuery } =
  projectsEndpoints;
