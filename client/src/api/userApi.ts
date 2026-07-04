import api from './axios';
import { Employee, ActivityLog } from '../types/index.ts';

export const userApi = {
  getAll: (params?: { department?: string; search?: string }) =>
    api.get<Employee[]>('/employees', { params }).then(res => res.data),

  getById: (id: string) => 
    api.get<Employee>(`/employees/${id}`).then(res => res.data),

  create: (data: Omit<Employee, 'id' | 'joiningDate' | 'status' | 'avatarUrl'>) =>
    api.post<Employee>('/employees', data).then(res => res.data),

  update: (id: string, data: Partial<Employee>) =>
    api.put<Employee>(`/employees/${id}`, data).then(res => res.data),

  delete: (id: string) =>
    api.delete<{ message: string; employee: Employee }>(`/employees/${id}`).then(res => res.data),

  getAuditLogs: () =>
    api.get<ActivityLog[]>('/audit-logs').then(res => res.data),
};
