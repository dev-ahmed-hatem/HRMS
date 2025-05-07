import { User } from "@/types/user";
import api from "../apiSlice";

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
    verify: builder.query<void, void>({
      query: () => ({
        url: "/auth/verify/",
        method: "Get",
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout/",
        method: "POST",
      }),
    }),
    getAuthUser: builder.query<User, void>({
      query: () => ({ url: "/auth/authenticated-user/", method: "POST" }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRefreshMutation,
  useVerifyQuery,
  useLogoutMutation,
  useGetAuthUserQuery,
} = auth;
