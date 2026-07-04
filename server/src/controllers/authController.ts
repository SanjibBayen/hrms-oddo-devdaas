import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  static async signup(req: Request, res: Response) {
    try {
      const result = await AuthService.signup(req.body);
      res.status(201).json({ status: 'success', code: 'USER_CREATED', message: 'Account created', data: result });
    } catch (error: any) {
      res.status(400).json({ status: 'error', code: 'SIGNUP_FAILED', message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json({ status: 'success', code: 'LOGIN_SUCCESS', message: 'Login successful', data: result });
    } catch (error: any) {
      res.status(401).json({ status: 'error', code: 'LOGIN_FAILED', message: error.message });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const userId = (req as any).userId;
      const tokens = await AuthService.refreshToken(userId, refreshToken);
      res.json({ status: 'success', code: 'TOKEN_REFRESHED', message: 'Token refreshed', data: tokens });
    } catch (error: any) {
      res.status(401).json({ status: 'error', code: 'REFRESH_FAILED', message: error.message });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const result = await AuthService.logout(userId);
      res.json({ status: 'success', code: 'LOGOUT_SUCCESS', message: 'Logged out', data: result });
    } catch (error: any) {
      res.status(500).json({ status: 'error', code: 'LOGOUT_FAILED', message: error.message });
    }
  }

  static async me(req: Request, res: Response) {
    try {
      const user = (req as any).user;
      res.json({
        status: 'success',
        code: 'PROFILE',
        message: 'Profile retrieved',
        data: {
          id: user?._id,
          employeeId: user?.employeeId,
          email: user?.email,
          role: user?.role,
          fullName: user?.personalDetails?.fullName,
          department: user?.jobDetails?.department,
          position: user?.jobDetails?.position,
        },
      });
    } catch (error: any) {
      res.status(500).json({ status: 'error', code: 'ERROR', message: error.message });
    }
  }
}
