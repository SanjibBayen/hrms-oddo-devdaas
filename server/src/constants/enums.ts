export enum UserRole {
    EMPLOYEE = 'employee',
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin',
}

export enum LeaveType {
    PAID = 'paid',
    SICK = 'sick',
    UNPAID = 'unpaid',
    CASUAL = 'casual',
}

export enum LeaveStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    CANCELLED = 'cancelled',
}

export enum AttendanceStatus {
    PRESENT = 'present',
    ABSENT = 'absent',
    HALF_DAY = 'half-day',
    LEAVE = 'leave',
}

export enum PayrollStatus {
    DRAFT = 'draft',
    PROCESSED = 'processed',
    PAID = 'paid',
}

export enum EmploymentType {
    FULL_TIME = 'full-time',
    PART_TIME = 'part-time',
    CONTRACT = 'contract',
}

export enum PaymentMethod {
    BANK_TRANSFER = 'bank_transfer',
    CHECK = 'check',
    CASH = 'cash',
}

export enum AuditSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical',
}

export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    UNPROCESSABLE = 422,
    TOO_MANY_REQUESTS = 429,
    LOCKED = 423,
    INTERNAL_ERROR = 500,
}