export class AuditDTO {
    static format(log: any) {
        return {
            id: log._id,
            action: log.action,
            resource: log.resource,
            resourceId: log.resourceId,
            details: log.details,
            severity: log.severity,
            status: log.status,
            timestamp: log.timestamp,
            user: log.userId ? {
                id: log.userId._id || log.userId,
                fullName: log.userId.personalDetails?.fullName,
                employeeId: log.userId.employeeId,
            } : undefined,
        };
    }
}