import { Payroll } from '../models/Payroll';
import { redisManager } from '../config/redis';

export class PayrollService {
    static async getMyPayroll(userId: string, year?: number) {
        const y = year || new Date().getFullYear();
        const cacheKey = `payroll:${userId}:${y}`;
        const cached = await redisManager.get(cacheKey);
        if (cached) return JSON.parse(cached);

        const records = await Payroll.find({ userId, year: y }).sort({ month: -1 });
        await redisManager.set(cacheKey, JSON.stringify(records), 300);
        return records;
    }

    static async getCurrentMonthPayroll(userId: string) {
        const now = new Date();
        const record = await Payroll.findOne({
            userId,
            month: now.getMonth() + 1,
            year: now.getFullYear(),
        });
        return record;
    }

    static async generatePayroll(_adminId: string, userId: string, data: any) {
        const existing = await Payroll.findOne({
            userId,
            month: data.month,
            year: data.year,
        });

        if (existing) throw new Error('Payroll already exists for this month');

        const payroll = await Payroll.create({
            userId,
            month: data.month,
            year: data.year,
            basicPay: data.basicPay || 0,
            allowances: data.allowances || 0,
            deductions: data.deductions || 0,
            bonus: data.bonus || 0,
            status: 'draft',
        });

        await redisManager.delPattern(`payroll:${userId}:*`);
        return payroll;
    }

    static async updatePayroll(_adminId: string, payrollId: string, data: any) {
        const payroll = await Payroll.findByIdAndUpdate(payrollId, { $set: data }, { new: true });
        if (!payroll) throw new Error('Payroll not found');

        await redisManager.delPattern(`payroll:${payroll.userId}:*`);
        return payroll;
    }

    static async getAllPayrolls(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        const [records, total] = await Promise.all([
            Payroll.find().populate('userId', 'personalDetails.fullName employeeId').skip(skip).limit(limit).sort({ year: -1, month: -1 }),
            Payroll.countDocuments(),
        ]);
        return { records, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
}
