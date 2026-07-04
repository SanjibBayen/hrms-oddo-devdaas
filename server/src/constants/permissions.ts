export const PERMISSIONS = {
    READ_ALL_USERS: 'read:all_users',
    READ_OWN_PROFILE: 'read:own_profile',
    UPDATE_OWN_PROFILE: 'update:own_profile',
    UPDATE_USERS: 'update:users',
    CREATE_USERS: 'create:users',
    DELETE_USERS: 'delete:users',
    MANAGE_ROLES: 'manage:roles',

    READ_ALL_ATTENDANCE: 'read:all_attendance',
    READ_OWN_ATTENDANCE: 'read:own_attendance',
    CREATE_OWN_ATTENDANCE: 'create:own_attendance',

    READ_ALL_LEAVES: 'read:all_leaves',
    READ_OWN_LEAVES: 'read:own_leaves',
    CREATE_OWN_LEAVES: 'create:own_leaves',
    APPROVE_LEAVES: 'approve:leaves',
    REJECT_LEAVES: 'reject:leaves',

    READ_ALL_PAYROLL: 'read:all_payroll',
    READ_OWN_PAYROLL: 'read:own_payroll',
    CREATE_PAYROLL: 'create:payroll',
    UPDATE_PAYROLL: 'update:payroll',

    READ_AUDIT_LOGS: 'read:audit_logs',
    DELETE_AUDIT_LOGS: 'delete:audit_logs',
    MANAGE_SYSTEM: 'manage:system',
    VIEW_SENSITIVE_DATA: 'view:sensitive_data',
} as const;