export type PayrollStatus = 'DRAFT' | 'PAID' | 'ON_HOLD';

export interface Payroll {
  id: string;
  userId: string;
  userName: string;
  department: string;
  designation: string;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: PayrollStatus;
  processedDate?: string;
}
