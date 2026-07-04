import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { 
  Employee, 
  AttendanceLog, 
  LeaveRequest, 
  Payroll, 
  HRMSDashboardStats,
  ActivityLog
} from "../types/index.ts";
import { userApi } from "../api/userApi.ts";
import { attendanceApi } from "../api/attendanceApi.ts";
import { leaveApi } from "../api/leaveApi.ts";
import { payrollApi } from "../api/payrollApi.ts";
import { useAuth } from "../hooks/useAuth.ts";

interface HRMSContextType {
  employees: Employee[];
  attendanceLogs: AttendanceLog[];
  leaveRequests: LeaveRequest[];
  payrolls: Payroll[];
  stats: HRMSDashboardStats | null;
  auditLogs: ActivityLog[];
  isLoading: boolean;
  error: string | null;
  
  // Refresh functions
  refreshAll: () => Promise<void>;
  refreshEmployees: () => Promise<void>;
  refreshAttendance: (userId?: string) => Promise<void>;
  refreshLeaves: (userId?: string) => Promise<void>;
  refreshPayrolls: (userId?: string, month?: string) => Promise<void>;
  refreshStats: () => Promise<void>;
  refreshAuditLogs: () => Promise<void>;
  
  // Actions
  addEmployee: (employee: Omit<Employee, "id" | "joiningDate" | "status" | "avatarUrl">) => Promise<Employee>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<Employee>;
  deactivateEmployee: (id: string) => Promise<void>;
  
  // Attendance actions
  checkIn: (userId: string, notes?: string) => Promise<AttendanceLog>;
  checkOut: (userId: string) => Promise<AttendanceLog>;
  submitManualAttendance: (log: Omit<AttendanceLog, "id" | "workHours">) => Promise<AttendanceLog>;
  
  // Leave actions
  applyLeave: (request: { userId: string; leaveType: string; startDate: string; endDate: string; reason: string }) => Promise<LeaveRequest>;
  updateLeaveStatus: (id: string, status: LeaveRequest['status'], approvedBy: string) => Promise<LeaveRequest>;
  
  // Payroll actions
  calculatePayroll: (month: string) => Promise<void>;
  processPayrollPayment: (id: string, status: Payroll['status']) => Promise<void>;
}

export const HRMSContext = createContext<HRMSContextType | undefined>(undefined);

export const HRMSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [stats, setStats] = useState<HRMSDashboardStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refreshEmployees = async () => {
    try {
      const data = await userApi.getAll();
      setEmployees(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load employees");
    }
  };

  const refreshAttendance = async (userId?: string) => {
    try {
      const data = await attendanceApi.getLogs({ userId });
      setAttendanceLogs(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load attendance logs");
    }
  };

  const refreshLeaves = async (userId?: string) => {
    try {
      const data = await leaveApi.getAll(userId);
      setLeaveRequests(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load leave requests");
    }
  };

  const refreshPayrolls = async (userId?: string, month?: string) => {
    try {
      const data = await payrollApi.getAll({ userId, month });
      setPayrolls(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load payroll logs");
    }
  };

  const refreshStats = async () => {
    try {
      const data = await payrollApi.getStats();
      setStats(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  const refreshAuditLogs = async () => {
    try {
      const data = await userApi.getAuditLogs();
      setAuditLogs(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  const refreshAll = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      setError(null);
      await Promise.all([
        refreshEmployees(),
        refreshAttendance(user.role === "EMPLOYEE" ? user.id : undefined),
        refreshLeaves(user.role === "EMPLOYEE" ? user.id : undefined),
        refreshPayrolls(user.role === "EMPLOYEE" ? user.id : undefined),
        refreshStats(),
        refreshAuditLogs()
      ]);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh triggers when user log changes
  useEffect(() => {
    if (user) {
      refreshAll();
    } else {
      setEmployees([]);
      setAttendanceLogs([]);
      setLeaveRequests([]);
      setPayrolls([]);
      setStats(null);
      setAuditLogs([]);
    }
  }, [user]);

  // Actions
  const addEmployee = async (empData: Omit<Employee, "id" | "joiningDate" | "status" | "avatarUrl">) => {
    setError(null);
    try {
      const newEmp = await userApi.create(empData);
      await refreshEmployees();
      await refreshStats();
      await refreshAuditLogs();
      return newEmp;
    } catch (err: any) {
      setError(err.message || "Failed to create employee");
      throw err;
    }
  };

  const updateEmployee = async (id: string, empData: Partial<Employee>) => {
    setError(null);
    try {
      const updated = await userApi.update(id, empData);
      await refreshEmployees();
      await refreshAuditLogs();
      return updated;
    } catch (err: any) {
      setError(err.message || "Failed to update employee");
      throw err;
    }
  };

  const deactivateEmployee = async (id: string) => {
    setError(null);
    try {
      await userApi.delete(id);
      await refreshEmployees();
      await refreshStats();
      await refreshAuditLogs();
    } catch (err: any) {
      setError(err.message || "Failed to deactivate employee");
      throw err;
    }
  };

  const checkIn = async (userId: string, notes?: string) => {
    setError(null);
    try {
      const log = await attendanceApi.checkIn(userId, notes);
      await refreshAttendance(user?.role === "EMPLOYEE" ? userId : undefined);
      await refreshStats();
      await refreshAuditLogs();
      return log;
    } catch (err: any) {
      setError(err.message || "Failed to check-in");
      throw err;
    }
  };

  const checkOut = async (userId: string) => {
    setError(null);
    try {
      const log = await attendanceApi.checkOut(userId);
      await refreshAttendance(user?.role === "EMPLOYEE" ? userId : undefined);
      await refreshStats();
      await refreshAuditLogs();
      return log;
    } catch (err: any) {
      setError(err.message || "Failed to check-out");
      throw err;
    }
  };

  const submitManualAttendance = async (logData: Omit<AttendanceLog, "id" | "workHours">) => {
    setError(null);
    try {
      const log = await attendanceApi.submitManual(logData);
      await refreshAttendance();
      await refreshStats();
      await refreshAuditLogs();
      return log;
    } catch (err: any) {
      setError(err.message || "Failed to log attendance manually");
      throw err;
    }
  };

  const applyLeave = async (leaveData: { userId: string; leaveType: string; startDate: string; endDate: string; reason: string }) => {
    setError(null);
    try {
      const req = await leaveApi.apply(leaveData);
      await refreshLeaves(user?.role === "EMPLOYEE" ? leaveData.userId : undefined);
      await refreshStats();
      await refreshAuditLogs();
      return req;
    } catch (err: any) {
      setError(err.message || "Failed to submit leave request");
      throw err;
    }
  };

  const updateLeaveStatus = async (id: string, status: LeaveRequest['status'], approvedBy: string) => {
    setError(null);
    try {
      const req = await leaveApi.updateStatus(id, status, approvedBy);
      await refreshLeaves();
      await refreshAttendance();
      await refreshStats();
      await refreshAuditLogs();
      return req;
    } catch (err: any) {
      setError(err.message || "Failed to update leave request status");
      throw err;
    }
  };

  const calculatePayroll = async (month: string) => {
    setError(null);
    setIsLoading(true);
    try {
      await payrollApi.calculate(month);
      await refreshPayrolls(user?.role === "EMPLOYEE" ? user.id : undefined);
      await refreshStats();
      await refreshAuditLogs();
    } catch (err: any) {
      setError(err.message || "Failed to calculate payroll drafts");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const processPayrollPayment = async (id: string, status: Payroll['status']) => {
    setError(null);
    try {
      await payrollApi.updateStatus(id, status);
      await refreshPayrolls(user?.role === "EMPLOYEE" ? user?.id : undefined);
      await refreshStats();
      await refreshAuditLogs();
    } catch (err: any) {
      setError(err.message || "Failed to process payroll status update");
      throw err;
    }
  };

  return (
    <HRMSContext.Provider
      value={{
        employees,
        attendanceLogs,
        leaveRequests,
        payrolls,
        stats,
        auditLogs,
        isLoading,
        error,
        refreshAll,
        refreshEmployees,
        refreshAttendance,
        refreshLeaves,
        refreshPayrolls,
        refreshStats,
        refreshAuditLogs,
        addEmployee,
        updateEmployee,
        deactivateEmployee,
        checkIn,
        checkOut,
        submitManualAttendance,
        applyLeave,
        updateLeaveStatus,
        calculatePayroll,
        processPayrollPayment
      }}
    >
      {children}
    </HRMSContext.Provider>
  );
};
