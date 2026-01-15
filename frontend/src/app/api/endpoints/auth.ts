import { User } from "@/types/user";
import api from "../apiSlice";
import { Employee } from "@/types/employee";

const auth = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data: { username: string; password: string }) => ({
        url: "/auth/login/",
        method: "POST",
        data,
      }),
    }),
    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh/",
        method: "POST",
      }),
    }),
    verify: builder.mutation<void, { access: string }>({
      query: (data) => ({
        url: "/auth/verify/",
        method: "POST",
        data: { token: data.access },
      }),
    }),
    getAuthUser: builder.query<{ user: User; employee?: Employee }, void>({
      query: () => ({ url: "/auth/authenticated-user/", method: "POST" }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRefreshMutation,
  useVerifyMutation,
  useGetAuthUserQuery,
} = auth;
