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
