import { NextFunction, Request, Response } from 'express';
import type { IUser } from '../models/User';

type Role = IUser['role'];

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      return res.status(401).json({
        status: 'error',
        code: 'UNAUTHENTICATED',
        message: 'Authentication is required',
      });
    }

    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        status: 'error',
        code: 'FORBIDDEN',
        message: 'You do not have permission to perform this action',
      });
    }

    return next();
  };
};
