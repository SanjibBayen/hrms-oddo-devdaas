export type UserRole = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface Employee {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  designation: string;
  joiningDate: string;
  salary: number;
  avatarUrl: string;
  phone: string;
  status: EmployeeStatus;
  bankAccount?: string;
  taxId?: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'ON_LEAVE';

export interface AttendanceLog {
  id: string;
  userId: string;
  employeeName?: string; // client-side helper
  department?: string;   // client-side helper
  date: string;          // YYYY-MM-DD
  checkIn: string | null;  // HH:MM:SS
  checkOut: string | null; // HH:MM:SS
  status: AttendanceStatus;
  workHours: number;
  notes?: string;
}

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type LeaveType = 'SICK' | 'CASUAL' | 'ANNUAL' | 'MATERNITY' | 'UNPAID';

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;      // YYYY-MM-DD
  endDate: string;        // YYYY-MM-DD
  reason: string;
  status: LeaveStatus;
  appliedDate: string;    // YYYY-MM-DD
  approvedBy?: string;
  approvedDate?: string;
}

export type PayrollStatus = 'DRAFT' | 'PAID' | 'ON_HOLD';

export interface Payroll {
  id: string;
  userId: string;
  userName: string;
  department: string;
  designation: string;
  month: string;          // e.g., "October 2024" or "2024-10"
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: PayrollStatus;
  processedDate?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  category: 'AUTH' | 'ATTENDANCE' | 'LEAVE' | 'PAYROLL' | 'PROFILE';
  timestamp: string;
}

export interface HRMSDashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  presentToday: number;
  lateToday: number;
  pendingLeaves: number;
  totalPayrollThisMonth: number;
}
