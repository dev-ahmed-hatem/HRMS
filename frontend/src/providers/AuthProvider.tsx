import { axiosBaseQueryError } from "@/app/api/axiosBaseQuery";
import { useGetAuthUserQuery } from "@/app/api/endpoints/auth";
import { useAppDispatch } from "@/app/redux/hooks";
import { setUser } from "@/app/slices/authSlice";
import Loading from "@/components/Loading";
import Base from "@/pages/Base";
import { User } from "@/types/user";
import React, { createContext, useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router";

interface ContextType {
  user: User | null; // in case passing user as a context value
}

const AuthContext = createContext<ContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const dispatch = useAppDispatch();
  const { data, isLoading, isError, error } = useGetAuthUserQuery();

  useEffect(() => {
    if (data) {
      dispatch(setUser(data));
    }
  }, [data]);

  if (isError) {
  }

  if (isLoading) return <Loading />;
  if (isError) {
    const err = error as axiosBaseQueryError;
    const next =
      location.pathname !== "/"
        ? `/login?next=${encodeURIComponent(
            location.pathname + location.search
          )}`
        : `/login`;

    return err?.status == 401 ? <Navigate to={next} /> : <Base error={true} />;
  }
  return <AuthContext.Provider value={null}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = (): ContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("user must login first");
  }
  return context;
};
