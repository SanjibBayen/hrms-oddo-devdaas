import axiosInstance from "./axios.ts";
import { Employee } from "../types/index.ts";

export interface LoginResponse {
  token: string;
  user: Employee;
}

export const authApi = {
  login: async (email: string, password?: string): Promise<LoginResponse> => {
    const { data } = await axiosInstance.post<LoginResponse>("/api/auth/login", { email, password });
    return data;
  },
  
  getMe: async (): Promise<Employee> => {
    const { data } = await axiosInstance.get<Employee>("/api/auth/me");
    return data;
  }
};
