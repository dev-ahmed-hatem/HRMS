import { User } from "@/types/user";
import api from "../apiSlice";
import { ChangePasswordFields } from "@/components/settings/account/ChangePassword";

export const usersEndpoints = api.injectEndpoints({
  endpoints: (builder) => ({
    user: builder.mutation<
      Partial<User>,
      { data?: Partial<User>; method?: string; url?: string }
    >({
      query: ({ data, method, url }) => ({
        url: url || `users/users/`,
        method: method || "POST",
        data,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const response = (await queryFulfilled).data;
          // Invalidate the Entities LIST tag on successful POST
          dispatch(
            api.util.invalidateTags([
              { type: "User", id: "LIST" },
              { type: "User", id: response.id },
            ])
          );
        } catch {
          // Do nothing if the request fails
        }
      },
    }),
    changePassword: builder.mutation<void, ChangePasswordFields>({
      query: (data) => ({
        url: "/users/change-password/",
        method: "PATCH",
        data,
      }),
    }),
  }),
});

export const { useUserMutation, useChangePasswordMutation } = usersEndpoints;
