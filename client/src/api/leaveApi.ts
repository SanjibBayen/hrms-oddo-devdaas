import axiosInstance from "./axios.ts";
import { LeaveRequest, LeaveStatus } from "../types/index.ts";

export const leaveApi = {
  getAll: async (userId?: string): Promise<LeaveRequest[]> => {
    const { data } = await axiosInstance.get<LeaveRequest[]>("/api/leaves", { params: { userId } });
    return data;
  },

  apply: async (request: { userId: string; leaveType: string; startDate: string; endDate: string; reason: string }): Promise<LeaveRequest> => {
    const { data } = await axiosInstance.post<LeaveRequest>("/api/leaves", request);
    return data;
  },

  updateStatus: async (id: string, status: LeaveStatus, approvedBy: string): Promise<LeaveRequest> => {
    const { data } = await axiosInstance.put<LeaveRequest>(`/api/leaves/${id}/status`, { status, approvedBy });
    return data;
  }
};
