import api from './axios';
import { AttendanceLog } from '../types/index.ts';

export const attendanceApi = {
  getLogs: (params?: { userId?: string; date?: string }) =>
    api.get<AttendanceLog[]>('/attendance', { params }).then(res => res.data),

  checkIn: (userId: string, notes?: string) =>
    api.post<AttendanceLog>('/attendance/check-in', { userId, notes }).then(res => res.data),

  checkOut: (userId: string) =>
    api.post<AttendanceLog>('/attendance/check-out', { userId }).then(res => res.data),

  submitManual: (data: Omit<AttendanceLog, 'id' | 'workHours'>) =>
    api.post<AttendanceLog>('/attendance/manual', data).then(res => res.data),
};
