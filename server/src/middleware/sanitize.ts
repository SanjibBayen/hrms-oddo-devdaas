import { Request, Response, NextFunction } from 'express';

export const sanitizeInput = (req: Request, _res: Response, next: NextFunction) => {
    if (req.body) {
        Object.keys(req.body).forEach((key) => {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim().replace(/<[^>]*>/g, '');
            }
        });
    }
    next();
};

export const sanitizeQuery = (req: Request, _res: Response, next: NextFunction) => {
    if (req.query) {
        Object.keys(req.query).forEach((key) => {
            if (typeof req.query[key] === 'string') {
                (req.query as any)[key] = (req.query[key] as string).trim();
            }
        });
    }
    next();
};