import rateLimit from 'express-rate-limit';
import { redisManager } from '../config/redis';

const createRedisStore = () => {
    const client = redisManager.getClient();
    return {
        incr: (key: string) => client.incr(key),
        decr: (key: string) => client.decr(key),
        resetKey: (key: string) => client.del(key),
    };
};

export const globalLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
    message: {
        status: 'error',
        code: 'RATE_LIMITED',
        message: 'Too many requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.ip || req.socket.remoteAddress || 'unknown';
    },
});

export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: parseInt(process.env.AUTH_RATE_LIMIT_MAX || '5', 10),
    message: {
        status: 'error',
        code: 'AUTH_RATE_LIMITED',
        message: 'Too many login attempts. Please try again after 1 hour.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
});

export const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: {
        status: 'error',
        code: 'API_RATE_LIMITED',
        message: 'Too many API requests. Slow down.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});