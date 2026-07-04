import axiosInstance from "./axios.ts";
import { AttendanceLog } from "../types/index.ts";

export const attendanceApi = {
  getLogs: async (params?: { userId?: string; date?: string }): Promise<AttendanceLog[]> => {
    const { data } = await axiosInstance.get<AttendanceLog[]>("/api/attendance", { params });
    return data;
  },

  checkIn: async (userId: string, notes?: string): Promise<AttendanceLog> => {
    const { data } = await axiosInstance.post<AttendanceLog>("/api/attendance/check-in", { userId, notes });
    return data;
  },

  checkOut: async (userId: string): Promise<AttendanceLog> => {
    const { data } = await axiosInstance.post<AttendanceLog>("/api/attendance/check-out", { userId });
    return data;
  },

  submitManual: async (log: Omit<AttendanceLog, "id" | "workHours">): Promise<AttendanceLog> => {
    const { data } = await axiosInstance.post<AttendanceLog>("/api/attendance/manual", log);
    return data;
  }
};
