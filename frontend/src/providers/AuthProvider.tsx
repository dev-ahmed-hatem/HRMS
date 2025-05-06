import { axiosBaseQueryError } from "@/app/api/axiosBaseQuery";
import { useGetAuthUserQuery } from "@/app/api/endpoints/auth";
import Loading from "@/components/Loading";
import { User } from "@/types/user";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

interface ContextType {
  user: User | null;
}

const AuthContext = createContext<ContextType | null>(null);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const { data, isLoading, isError, error } = useGetAuthUserQuery();
  if (isError) {
    const err = error as axiosBaseQueryError;
    if (err?.status == 401) navigate("/login");
  }

  useEffect(() => {
    console.log(data);
    console.log(error);
    console.log(isError);
  }, [data, error, isError]);

  if (isLoading) return <Loading />;
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = (): ContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("user must login first");
  }
  return context;
};
