export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  category: 'AUTH' | 'ATTENDANCE' | 'LEAVE' | 'PAYROLL' | 'PROFILE';
  timestamp: string;
}
