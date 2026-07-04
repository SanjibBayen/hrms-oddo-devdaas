import { Attendance } from '../models/Attendance';
import { redisManager } from '../config/redis';

export class AttendanceService {
    static async checkIn(userId: string, notes?: string) {
        const today = new Date().toISOString().split('T')[0];

        const existing = await Attendance.findOne({ userId, date: today });
        if (existing) {
            throw new Error('Already checked in today');
        }

        const attendance = await Attendance.create({
            userId,
            date: today,
            checkInTime: new Date(),
            status: 'present',
            notes: notes || '',
        });

        await redisManager.del(`attendance:${userId}:${today}`);
        await redisManager.delPattern(`attendance:list:${userId}:*`);
        return attendance;
    }

    static async checkOut(userId: string) {
        const today = new Date().toISOString().split('T')[0];

        const attendance = await Attendance.findOne({ userId, date: today });
        if (!attendance) throw new Error('No check-in found for today');
        if (attendance.checkOutTime) throw new Error('Already checked out today');

        attendance.checkOutTime = new Date();
        await attendance.save();

        await redisManager.del(`attendance:${userId}:${today}`);
        return attendance;
    }

    static async getMyAttendance(userId: string, month?: number, year?: number) {
        const now = new Date();
        const m = month || now.getMonth() + 1;
        const y = year || now.getFullYear();

        const cacheKey = `attendance:list:${userId}:${y}:${m}`;
        const cached = await redisManager.get(cacheKey);
        if (cached) return JSON.parse(cached);

        const startDate = `${y}-${String(m).padStart(2, '0')}-01`;
        const endDate = new Date(y, m, 0).getDate();
        const endDateStr = `${y}-${String(m).padStart(2, '0')}-${endDate}`;

        const records = await Attendance.find({
            userId,
            date: { $gte: startDate, $lte: endDateStr },
        }).sort({ date: 1 });

        const stats = {
            present: records.filter(r => r.status === 'present').length,
            absent: records.filter(r => r.status === 'absent').length,
            late: records.filter(r => r.isLate).length,
            halfDay: records.filter(r => r.status === 'half-day').length,
            totalHours: records.reduce((sum, r) => sum + r.totalHours, 0),
        };

        const result = { records, stats };

        await redisManager.set(cacheKey, JSON.stringify(result), 300);
        return result;
    }

    static async getTodayAttendance() {
        const today = new Date().toISOString().split('T')[0];
        const cacheKey = `attendance:today:${today}`;
        const cached = await redisManager.get(cacheKey);
        if (cached) return JSON.parse(cached);

        const records = await Attendance.find({ date: today })
            .populate('userId', 'personalDetails.fullName employeeId jobDetails.department');

        await redisManager.set(cacheKey, JSON.stringify(records), 120);
        return records;
    }

    static async getAllAttendance(page: number = 1, limit: number = 20, filters?: any) {
        const skip = (page - 1) * limit;
        const query: any = {};

        if (filters?.date) query.date = filters.date;
        if (filters?.status) query.status = filters.status;
        if (filters?.userId) query.userId = filters.userId;

        const [records, total] = await Promise.all([
            Attendance.find(query)
                .populate('userId', 'personalDetails.fullName employeeId jobDetails.department')
                .skip(skip)
                .limit(limit)
                .sort({ date: -1 }),
            Attendance.countDocuments(query),
        ]);

        return { records, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
    }
}