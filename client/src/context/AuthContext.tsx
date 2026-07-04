import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { Employee } from "../types/index.ts";
import { authApi } from "../api/authApi.ts";

interface AuthContextType {
  user: Employee | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<Employee>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const token = localStorage.getItem("hrms_token");
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const res = await authApi.getMe();
      setUser(res.data);
    } catch (error) {
      console.error("Failed to authenticate with stored token", error);
      localStorage.removeItem("hrms_token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password?: string): Promise<Employee> => {
    setIsLoading(true);
    try {
      const res = await authApi.login(email, password || "");
      const { token, user } = res.data;
      localStorage.setItem("hrms_token", token);
      setUser(user);
      return user;
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("hrms_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
