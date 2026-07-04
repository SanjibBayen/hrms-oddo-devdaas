import axiosInstance from "./axios.ts";
import { Payroll, PayrollStatus, HRMSDashboardStats } from "../types/index.ts";

export const payrollApi = {
  getAll: async (params?: { userId?: string; month?: string }): Promise<Payroll[]> => {
    const { data } = await axiosInstance.get<Payroll[]>("/api/payrolls", { params });
    return data;
  },

  calculate: async (month: string): Promise<{ message: string; payrolls: Payroll[] }> => {
    const { data } = await axiosInstance.post<{ message: string; payrolls: Payroll[] }>("/api/payrolls/calculate", { month });
    return data;
  },

  updateStatus: async (id: string, status: PayrollStatus): Promise<Payroll> => {
    const { data } = await axiosInstance.put<Payroll>(`/api/payrolls/${id}/status`, { status });
    return data;
  },

  getStats: async (): Promise<HRMSDashboardStats> => {
    const { data } = await axiosInstance.get<HRMSDashboardStats>("/api/stats");
    return data;
  }
};
