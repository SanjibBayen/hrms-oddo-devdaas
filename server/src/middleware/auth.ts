import { Request, Response, NextFunction } from 'express';
import { jwtService } from '../utils/jwt';
import { User } from '../models/User';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ status: 'error', code: 'AUTH_REQUIRED', message: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ status: 'error', code: 'AUTH_REQUIRED', message: 'Authentication required' });
        }

        const decoded = jwtService.verifyAccessToken(token);

        const user = await User.findById(decoded.sub).select('+password');
        if (!user || !user.isActive) {
            return res.status(401).json({ status: 'error', code: 'USER_NOT_FOUND', message: 'User not found or inactive' });
        }

        if (user.isLocked()) {
            return res.status(423).json({ status: 'error', code: 'ACCOUNT_LOCKED', message: 'Account locked. Try again later.' });
        }

        (req as any).user = user;
        (req as any).userId = user._id.toString();
        (req as any).userRole = user.role;
        next();
    } catch (error: any) {
        if (error.message === 'jwt expired') {
            return res.status(401).json({ status: 'error', code: 'TOKEN_EXPIRED', message: 'Token expired' });
        }
        return res.status(401).json({ status: 'error', code: 'INVALID_TOKEN', message: 'Invalid token' });
    }
};