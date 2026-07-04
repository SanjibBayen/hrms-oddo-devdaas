export const ROLE_HIERARCHY: Record<string, number> = {
    employee: 1,
    admin: 2,
    super_admin: 3,
};

export const ROLE_PERMISSIONS: Record<string, string[]> = {
    employee: [
        'read:own_profile',
        'update:own_profile',
        'read:own_attendance',
        'create:own_attendance',
        'read:own_leaves',
        'create:own_leaves',
        'read:own_payroll',
    ],
    admin: [
        'read:all_users',
        'update:users',
        'create:users',
        'read:all_attendance',
        'read:all_leaves',
        'approve:leaves',
        'reject:leaves',
        'read:all_payroll',
        'create:payroll',
        'update:payroll',
        'read:audit_logs',
    ],
    super_admin: [
        'delete:users',
        'manage:roles',
        'manage:system',
        'view:sensitive_data',
        'delete:audit_logs',
    ],
};

export function hasPermission(userRole: string, permission: string): boolean {
    const permissions = ROLE_PERMISSIONS[userRole] || [];
    if (permissions.includes(permission)) return true;
    if (userRole === 'super_admin') return true;
    if (userRole === 'admin' && ROLE_PERMISSIONS.employee.includes(permission)) return true;
    return false;
}

export function isRoleHigher(userRole: string, targetRole: string): boolean {
    const userLevel = ROLE_HIERARCHY[userRole] || 0;
    const targetLevel = ROLE_HIERARCHY[targetRole] || 0;
    return userLevel > targetLevel;
}