import api from './axios';
import { LeaveRequest } from '../types/index.ts';

export const leaveApi = {
  getAll: (userId?: string) =>
    api.get<LeaveRequest[]>('/leaves', { params: { userId } }).then(res => res.data),

  apply: (data: {
    userId: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
  }) => api.post<LeaveRequest>('/leaves', data).then(res => res.data),

  updateStatus: (id: string, status: string, approvedBy: string) =>
    api.put<LeaveRequest>(`/leaves/${id}/status`, { status, approvedBy }).then(res => res.data),
};
