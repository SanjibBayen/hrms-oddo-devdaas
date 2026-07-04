import { Request, Response } from 'express';
import { UserService } from '../services/UserService';

export class UserController {
    static async getAllUsers(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const filters = {
                department: req.query.department,
                role: req.query.role,
                search: req.query.search,
            };

            const result = await UserService.getAllUsers(page, limit, filters);
            res.json({ status: 'success', code: 'USERS_LIST', message: 'Users retrieved', data: result });
        } catch (error: any) {
            res.status(500).json({ status: 'error', code: 'ERROR', message: error.message });
        }
    }

    static async getUserById(req: Request, res: Response) {
        try {
            const paramId = req.params.id;
            const userId = (Array.isArray(paramId) ? paramId[0] : paramId) || (req as any).userId;
            if (!userId) throw new Error('User ID is required');
            const user = await UserService.getUserById(userId);
            res.json({ status: 'success', code: 'USER_DETAIL', message: 'User retrieved', data: user });
        } catch (error: any) {
            res.status(404).json({ status: 'error', code: 'NOT_FOUND', message: error.message });
        }
    }

    static async updateProfile(req: Request, res: Response) {
        try {
            const user = await UserService.updateProfile((req as any).userId!, req.body);
            res.json({ status: 'success', code: 'PROFILE_UPDATED', message: 'Profile updated', data: user });
        } catch (error: any) {
            res.status(400).json({ status: 'error', code: 'UPDATE_FAILED', message: error.message });
        }
    }

    static async adminUpdateUser(req: Request, res: Response) {
        try {
            const paramId = req.params.id;
            const targetUserId = Array.isArray(paramId) ? paramId[0] : paramId;
            if (!targetUserId) throw new Error('User ID is required');
            const user = await UserService.adminUpdateUser((req as any).userId!, targetUserId, req.body);
            res.json({ status: 'success', code: 'USER_UPDATED', message: 'User updated', data: user });
        } catch (error: any) {
            res.status(400).json({ status: 'error', code: 'UPDATE_FAILED', message: error.message });
        }
    }

    static async deactivateUser(req: Request, res: Response) {
        try {
            const paramId = req.params.id;
            const targetUserId = Array.isArray(paramId) ? paramId[0] : paramId;
            if (!targetUserId) throw new Error('User ID is required');
            const result = await UserService.deactivateUser((req as any).userId!, targetUserId);
            res.json({ status: 'success', code: 'USER_DEACTIVATED', message: 'User deactivated', data: result });
        } catch (error: any) {
            res.status(400).json({ status: 'error', code: 'DEACTIVATE_FAILED', message: error.message });
        }
    }

    static async getDepartmentStats(_req: Request, res: Response) {
        try {
            const stats = await UserService.getDepartmentStats();
            res.json({ status: 'success', code: 'DEPT_STATS', message: 'Department stats', data: stats });
        } catch (error: any) {
            res.status(500).json({ status: 'error', code: 'ERROR', message: error.message });
        }
    }
}
