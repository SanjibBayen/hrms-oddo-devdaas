import { Request, Response } from 'express';
import { AttendanceService } from '../services/AttendanceService';

export class AttendanceController {
    static async checkIn(req: Request, res: Response) {
        try {
            const { notes } = req.body;
            const attendance = await AttendanceService.checkIn((req as any).userId!, notes);
            res.status(201).json({ status: 'success', code: 'CHECKED_IN', message: 'Checked in successfully', data: attendance });
        } catch (error: any) {
            res.status(400).json({ status: 'error', code: 'CHECK_IN_FAILED', message: error.message });
        }
    }

    static async checkOut(req: Request, res: Response) {
        try {
            const attendance = await AttendanceService.checkOut((req as any).userId!);
            res.json({ status: 'success', code: 'CHECKED_OUT', message: 'Checked out successfully', data: attendance });
        } catch (error: any) {
            res.status(400).json({ status: 'error', code: 'CHECK_OUT_FAILED', message: error.message });
        }
    }

    static async getMyAttendance(req: Request, res: Response) {
        try {
            const month = parseInt(req.query.month as string);
            const year = parseInt(req.query.year as string);
            const result = await AttendanceService.getMyAttendance((req as any).userId!, month || undefined, year || undefined);
            res.json({ status: 'success', code: 'ATTENDANCE', message: 'Attendance retrieved', data: result });
        } catch (error: any) {
            res.status(500).json({ status: 'error', code: 'ERROR', message: error.message });
        }
    }

    static async getTodayAttendance(_req: Request, res: Response) {
        try {
            const records = await AttendanceService.getTodayAttendance();
            res.json({ status: 'success', code: 'TODAY_ATTENDANCE', message: 'Today attendance', data: records });
        } catch (error: any) {
            res.status(500).json({ status: 'error', code: 'ERROR', message: error.message });
        }
    }

    static async getAllAttendance(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const result = await AttendanceService.getAllAttendance(page, limit, req.query);
            res.json({ status: 'success', code: 'ALL_ATTENDANCE', message: 'Attendance list', data: result });
        } catch (error: any) {
            res.status(500).json({ status: 'error', code: 'ERROR', message: error.message });
        }
    }
}
