import api from './axios';
import { Payroll, HRMSDashboardStats } from '../types/index.ts';

export const payrollApi = {
  getAll: (params?: { userId?: string; month?: string }) =>
    api.get<Payroll[]>('/payrolls', { params }).then(res => res.data),

  getStats: () =>
    api.get<HRMSDashboardStats>('/stats').then(res => res.data),

  calculate: (month: string) =>
    api.post<{ message: string; payrolls: Payroll[] }>('/payrolls/calculate', { month }).then(res => res.data),

  updateStatus: (id: string, status: string) =>
    api.put<Payroll>(`/payrolls/${id}/status`, { status }).then(res => res.data),
};
