import axiosInstance from "./axios.ts";
import { Employee } from "../types/index.ts";

export const userApi = {
  getAll: async (): Promise<Employee[]> => {
    const { data } = await axiosInstance.get<Employee[]>("/api/employees");
    return data;
  },

  create: async (employee: Omit<Employee, "id" | "joiningDate" | "status" | "avatarUrl">): Promise<Employee> => {
    const { data } = await axiosInstance.post<Employee>("/api/employees", employee);
    return data;
  },

  update: async (id: string, employee: Partial<Employee>): Promise<Employee> => {
    const { data } = await axiosInstance.put<Employee>(`/api/employees/${id}`, employee);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/api/employees/${id}`);
  },

  getAuditLogs: async (): Promise<any[]> => {
    const { data } = await axiosInstance.get<any[]>("/api/audit-logs");
    return data;
  }
};
