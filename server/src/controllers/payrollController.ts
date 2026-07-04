import { Request, Response } from 'express';
import { PayrollService } from '../services/PayrollService';

export class PayrollController {
    static async getMyPayroll(req: Request, res: Response) {
        try {
            const year = parseInt(req.query.year as string);
            const records = await PayrollService.getMyPayroll((req as any).userId!, year || undefined);
            res.json({ status: 'success', code: 'MY_PAYROLL', message: 'Payroll retrieved', data: records });
        } catch (error: any) {
            res.status(500).json({ status: 'error', code: 'ERROR', message: error.message });
        }
    }

    static async getCurrentPayroll(req: Request, res: Response) {
        try {
            const record = await PayrollService.getCurrentMonthPayroll((req as any).userId!);
            res.json({ status: 'success', code: 'CURRENT_PAYROLL', message: 'Current payroll', data: record });
        } catch (error: any) {
            res.status(500).json({ status: 'error', code: 'ERROR', message: error.message });
        }
    }

    static async generatePayroll(req: Request, res: Response) {
        try {
            const payroll = await PayrollService.generatePayroll((req as any).userId!, req.body.userId, req.body);
            res.status(201).json({ status: 'success', code: 'PAYROLL_GENERATED', message: 'Payroll generated', data: payroll });
        } catch (error: any) {
            res.status(400).json({ status: 'error', code: 'GENERATE_FAILED', message: error.message });
        }
    }

    static async updatePayroll(req: Request, res: Response) {
        try {
            const paramId = req.params.id;
            const payrollId = Array.isArray(paramId) ? paramId[0] : paramId;
            if (!payrollId) throw new Error('Payroll ID is required');
            const payroll = await PayrollService.updatePayroll((req as any).userId!, payrollId, req.body);
            res.json({ status: 'success', code: 'PAYROLL_UPDATED', message: 'Payroll updated', data: payroll });
        } catch (error: any) {
            res.status(400).json({ status: 'error', code: 'UPDATE_FAILED', message: error.message });
        }
    }

    static async getAllPayrolls(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await PayrollService.getAllPayrolls(page, limit);
            res.json({ status: 'success', code: 'ALL_PAYROLLS', message: 'Payrolls list', data: result });
        } catch (error: any) {
            res.status(500).json({ status: 'error', code: 'ERROR', message: error.message });
        }
    }
}
