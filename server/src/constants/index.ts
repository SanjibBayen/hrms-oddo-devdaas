export const APP_NAME = 'HRMS Enterprise';
export const APP_VERSION = '1.0.0';

export const ROLES = {
    EMPLOYEE: 'employee',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin',
} as const;

export const LEAVE_TYPES = {
    PAID: 'paid',
    SICK: 'sick',
    UNPAID: 'unpaid',
    CASUAL: 'casual',
} as const;

export const LEAVE_STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    CANCELLED: 'cancelled',
} as const;

export const ATTENDANCE_STATUS = {
    PRESENT: 'present',
    ABSENT: 'absent',
    HALF_DAY: 'half-day',
    LEAVE: 'leave',
} as const;

export const PAYROLL_STATUS = {
    DRAFT: 'draft',
    PROCESSED: 'processed',
    PAID: 'paid',
} as const;

export const EMPLOYMENT_TYPES = {
    FULL_TIME: 'full-time',
    PART_TIME: 'part-time',
    CONTRACT: 'contract',
} as const;

export const PAYMENT_METHODS = {
    BANK_TRANSFER: 'bank_transfer',
    CHECK: 'check',
    CASH: 'cash',
} as const;

export const AUDIT_SEVERITY = {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical',
} as const;

export const AUDIT_ACTIONS = {
    USER_CREATED: 'USER_CREATED',
    USER_UPDATED: 'USER_UPDATED',
    USER_DEACTIVATED: 'USER_DEACTIVATED',
    USER_LOGIN: 'USER_LOGIN',
    USER_LOGOUT: 'USER_LOGOUT',
    ATTENDANCE_CHECK_IN: 'ATTENDANCE_CHECK_IN',
    ATTENDANCE_CHECK_OUT: 'ATTENDANCE_CHECK_OUT',
    LEAVE_APPLIED: 'LEAVE_APPLIED',
    LEAVE_APPROVED: 'LEAVE_APPROVED',
    LEAVE_REJECTED: 'LEAVE_REJECTED',
    PAYROLL_GENERATED: 'PAYROLL_GENERATED',
    PAYROLL_UPDATED: 'PAYROLL_UPDATED',
    PROFILE_UPDATED: 'PROFILE_UPDATED',
    PASSWORD_CHANGED: 'PASSWORD_CHANGED',
} as const;

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCK_DURATION_MINUTES = 30;
export const PASSWORD_MIN_LENGTH = 8;
export const OFFICE_START_HOUR = 9;
export const OFFICE_START_MINUTE = 15;
export const MAX_FILE_SIZE = 2 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const LEAVE_BALANCES = {
    paid: 24,
    sick: 12,
    casual: 6,
    unpaid: 0,
} as const;

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE: 422,
    TOO_MANY_REQUESTS: 429,
    LOCKED: 423,
    INTERNAL_ERROR: 500,
} as const;