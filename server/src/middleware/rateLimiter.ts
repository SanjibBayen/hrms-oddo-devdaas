import rateLimit from 'express-rate-limit';

export const globalLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: { status: 'error', code: 'RATE_LIMITED', message: 'Too many requests' },
    standardHeaders: true,
    legacyHeaders: false,
});

export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '5'),
    message: { status: 'error', code: 'AUTH_RATE_LIMITED', message: 'Too many login attempts, try later' },
    standardHeaders: true,
    legacyHeaders: false,
});
