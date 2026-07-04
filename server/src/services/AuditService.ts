import { AuditLog } from '../models/AuditLog';

export class AuditService {
    static async log(data: {
        userId: string;
        action: string;
        resource: string;
        resourceId?: string;
        details?: string;
        ipAddress: string;
        severity?: 'low' | 'medium' | 'high' | 'critical';
        status?: 'success' | 'failure';
    }) {
        return AuditLog.create({
            ...data,
            timestamp: new Date(),
        });
    }

    static async getLogs(page: number = 1, limit: number = 20, filters?: any) {
        const skip = (page - 1) * limit;
        const query: any = {};

        if (filters?.userId) query.userId = filters.userId;
        if (filters?.action) query.action = filters.action;
        if (filters?.severity) query.severity = filters.severity;
        if (filters?.startDate || filters?.endDate) {
            query.timestamp = {};
            if (filters.startDate) query.timestamp.$gte = new Date(filters.startDate);
            if (filters.endDate) query.timestamp.$lte = new Date(filters.endDate);
        }

        const [logs, total] = await Promise.all([
            AuditLog.find(query)
                .populate('userId', 'personalDetails.fullName employeeId')
                .skip(skip)
                .limit(limit)
                .sort({ timestamp: -1 }),
            AuditLog.countDocuments(query),
        ]);

        return { logs, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }

    static async getSecurityEvents() {
        return AuditLog.find({ severity: { $in: ['high', 'critical'] } })
            .populate('userId', 'personalDetails.fullName employeeId')
            .sort({ timestamp: -1 })
            .limit(50);
    }
}
