import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export const deviceFingerprint = (req: Request, _res: Response, next: NextFunction) => {
    const userAgent = req.headers['user-agent'] || '';
    const acceptLanguage = req.headers['accept-language'] || '';
    const ip = req.ip || req.socket.remoteAddress || '';

    const fingerprint = crypto
        .createHash('sha256')
        .update(`${userAgent}:${acceptLanguage}:${ip}`)
        .digest('hex');

    (req as any).fingerprint = fingerprint;
    next();
};