import { User } from '../models/User';
import { AuditLog } from '../models/AuditLog';
import { redisManager } from '../config/redis';

export class UserService {
    // Get all users with pagination
    static async getAllUsers(page: number = 1, limit: number = 10, filters?: any) {
        const skip = (page - 1) * limit;
        const query: any = { isActive: true };

        if (filters?.department) query['jobDetails.department'] = filters.department;
        if (filters?.role) query.role = filters.role;
        if (filters?.search) {
            query.$or = [
                { 'personalDetails.fullName': { $regex: filters.search, $options: 'i' } },
                { email: { $regex: filters.search, $options: 'i' } },
                { employeeId: { $regex: filters.search, $options: 'i' } },
            ];
        }

        const cacheKey = `users:list:${page}:${limit}:${JSON.stringify(filters)}`;
        const cached = await redisManager.get(cacheKey);
        if (cached) return JSON.parse(cached);

        const [users, total] = await Promise.all([
            User.find(query)
                .select('-password -refreshTokenHash -loginAttempts')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            User.countDocuments(query),
        ]);

        const result = {
            users,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };

        await redisManager.set(cacheKey, JSON.stringify(result), 60);
        return result;
    }

    // Get user by ID
    static async getUserById(userId: string) {
        const cacheKey = `user:${userId}`;
        const cached = await redisManager.get(cacheKey);
        if (cached) return JSON.parse(cached);

        const user = await User.findById(userId).select('-password -refreshTokenHash -loginAttempts');
        if (!user) throw new Error('User not found');

        await redisManager.set(cacheKey, JSON.stringify(user), 300);
        return user;
    }

    // Update own profile
    static async updateProfile(userId: string, data: any) {
        const allowedFields = [
            'personalDetails.phone',
            'personalDetails.address',
            'personalDetails.profilePicture',
        ];

        const updateData: any = {};
        for (const field of allowedFields) {
            const value = field.split('.').reduce((obj, key) => obj?.[key], data);
            if (value !== undefined) {
                const parts = field.split('.');
                let current = updateData;
                for (let i = 0; i < parts.length - 1; i++) {
                    const part = parts[i];
                    if (!part) continue;
                    if (!current[part]) current[part] = {};
                    current = current[part];
                }
                const leaf = parts[parts.length - 1];
                if (leaf) current[leaf] = value;
            }
        }

        const user = await User.findByIdAndUpdate(userId, { $set: updateData }, { new: true })
            .select('-password -refreshTokenHash -loginAttempts');

        await redisManager.del(`user:${userId}`);
        return user;
    }

    // Admin: Update any user
    static async adminUpdateUser(adminId: string, targetUserId: string, data: any) {
        const user = await User.findByIdAndUpdate(
            targetUserId,
            { $set: data },
            { new: true, runValidators: true }
        ).select('-password -refreshTokenHash -loginAttempts');

        if (!user) throw new Error('User not found');

        // Audit log
        await AuditLog.create({
            userId: adminId,
            action: 'USER_UPDATED',
            resource: 'User',
            resourceId: targetUserId,
            details: `Admin updated user ${user.employeeId}`,
            ipAddress: 'system',
            severity: 'medium',
        });

        await redisManager.del(`user:${targetUserId}`);
        await redisManager.delPattern('users:list:*');
        return user;
    }

    // Admin: Deactivate user
    static async deactivateUser(adminId: string, targetUserId: string) {
        const user = await User.findByIdAndUpdate(
            targetUserId,
            { isActive: false },
            { new: true }
        );

        if (!user) throw new Error('User not found');

        await AuditLog.create({
            userId: adminId,
            action: 'USER_DEACTIVATED',
            resource: 'User',
            resourceId: targetUserId,
            details: `Admin deactivated user ${user.employeeId}`,
            ipAddress: 'system',
            severity: 'high',
        });

        await redisManager.del(`user:${targetUserId}`);
        await redisManager.delPattern('users:list:*');
        return { message: 'User deactivated' };
    }

    // Get department stats
    static async getDepartmentStats() {
        const cacheKey = 'stats:departments';
        const cached = await redisManager.get(cacheKey);
        if (cached) return JSON.parse(cached);

        const stats = await User.aggregate([
            { $match: { isActive: true } },
            {
                $group: {
                    _id: '$jobDetails.department',
                    count: { $sum: 1 },
                    avgSalary: { $avg: '$salaryStructure.base' },
                },
            },
        ]);

        await redisManager.set(cacheKey, JSON.stringify(stats), 300);
        return stats;
    }
}
