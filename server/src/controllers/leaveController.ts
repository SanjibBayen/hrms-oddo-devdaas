import { Request, Response } from 'express';
import { LeaveService } from '../services/LeaveService';

export class LeaveController {
    static async applyLeave(req: Request, res: Response) {
        try {
            const leave = await LeaveService.applyLeave((req as any).userId!, req.body);
            res.status(201).json({ status: 'success', code: 'LEAVE_APPLIED', message: 'Leave applied', data: leave });
        } catch (error: any) {
            res.status(400).json({ status: 'error', code: 'APPLY_FAILED', message: error.message });
        }
    }

    static async getMyLeaves(req: Request, res: Response) {
        try {
            const leaves = await LeaveService.getMyLeaves((req as any).userId!);
            res.json({ status: 'success', code: 'MY_LEAVES', message: 'Leaves retrieved', data: leaves });
        } catch (error: any) {
            res.status(500).json({ status: 'error', code: 'ERROR', message: error.message });
        }
    }

    static async getPendingLeaves(_req: Request, res: Response) {
        try {
            const leaves = await LeaveService.getPendingLeaves();
            res.json({ status: 'success', code: 'PENDING_LEAVES', message: 'Pending leaves', data: leaves });
        } catch (error: any) {
            res.status(500).json({ status: 'error', code: 'ERROR', message: error.message });
        }
    }

    static async updateLeaveStatus(req: Request, res: Response) {
        try {
            const { status, comments } = req.body;
            const paramId = req.params.id;
            const leaveId = Array.isArray(paramId) ? paramId[0] : paramId;
            if (!leaveId) throw new Error('Leave ID is required');
            const leave = await LeaveService.updateLeaveStatus((req as any).userId!, leaveId, status, comments);
            res.json({ status: 'success', code: 'LEAVE_UPDATED', message: `Leave ${status}`, data: leave });
        } catch (error: any) {
            res.status(400).json({ status: 'error', code: 'UPDATE_FAILED', message: error.message });
        }
    }

    static async getLeaveBalance(req: Request, res: Response) {
        try {
            const balance = await LeaveService.getLeaveBalance((req as any).userId!);
            res.json({ status: 'success', code: 'LEAVE_BALANCE', message: 'Leave balance', data: balance });
        } catch (error: any) {
            res.status(500).json({ status: 'error', code: 'ERROR', message: error.message });
        }
    }
}
