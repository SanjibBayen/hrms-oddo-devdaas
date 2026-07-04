import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formatted: Record<string, string[]> = {};
        errors.array().forEach((err: any) => {
            const path = String(err.path || 'field');
            if (!formatted[path]) formatted[path] = [];
            formatted[path].push(err.msg);
        });
        res.status(422).json({ status: 'error', code: 'VALIDATION_ERROR', message: 'Validation failed', errors: formatted });
        return;
    }
    next();
};
