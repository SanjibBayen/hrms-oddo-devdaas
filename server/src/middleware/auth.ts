import jwt, { JwtPayload, SignOptions, VerifyOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { redisManager } from '../config/redis';
import { logger } from '../config/logger';

interface TokenPayload extends JwtPayload {
    sub: string;
    employeeId?: string;
    role?: string;
    type: 'access' | 'refresh';
    tokenId?: string;
}

class JWTService {
    private static instance: JWTService;
    private accessSecret: string;
    private refreshSecret: string;
    private accessExpiry: SignOptions['expiresIn'];
    private refreshExpiry: SignOptions['expiresIn'];

    private constructor() {
        // ensure secrets exist at runtime (avoid passing undefined to jwt)
        if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
            throw new Error('Missing JWT secrets in environment');
        }
        this.accessSecret = process.env.JWT_ACCESS_SECRET!;
        this.refreshSecret = process.env.JWT_REFRESH_SECRET!;
        this.accessExpiry = (process.env.JWT_ACCESS_EXPIRY || '15m') as SignOptions['expiresIn'];
        this.refreshExpiry = (process.env.JWT_REFRESH_EXPIRY || '7d') as SignOptions['expiresIn'];
    }

    static getInstance(): JWTService {
        if (!JWTService.instance) {
            JWTService.instance = new JWTService();
        }
        return JWTService.instance;
    }

    async generateTokenPair(user: { _id: string; employeeId: string; role: string }) {
        try {
            const tokenId = crypto.randomBytes(32).toString('hex');

            // Sign access token
            const accessPayload = {
                sub: user._id,
                employeeId: user.employeeId,
                role: user.role,
                type: 'access' as const
            };

            const accessOptions: SignOptions = {
                expiresIn: this.accessExpiry,
                issuer: 'hrms',
                audience: 'hrms-users'
            };

            let accessToken: string;
            try {
                accessToken = jwt.sign(accessPayload, this.accessSecret, accessOptions);
            } catch (error) {
                logger.error('Failed to sign access token:', error);
                throw new Error('Failed to generate access token');
            }

            // Sign refresh token
            const refreshPayload = {
                sub: user._id,
                tokenId,
                type: 'refresh' as const
            };

            const refreshOptions: SignOptions = {
                expiresIn: this.refreshExpiry,
                issuer: 'hrms',
                audience: 'hrms-users'
            };

            let refreshToken: string;
            try {
                refreshToken = jwt.sign(refreshPayload, this.refreshSecret, refreshOptions);
            } catch (error) {
                logger.error('Failed to sign refresh token:', error);
                throw new Error('Failed to generate refresh token');
            }

            // Store refresh token id in Redis with expiry
            const ttl = 7 * 24 * 60 * 60; // seconds
            const redisKey = `refresh:${user._id}`;

            try {
                await redisManager.set(redisKey, tokenId, ttl);
            } catch (error) {
                logger.error('Failed to store refresh token in Redis:', error);
                // Don't throw here - token generation succeeded, but Redis storage failed
                // You might want to handle this differently based on your requirements
            }

            return { accessToken, refreshToken };
        } catch (error) {
            logger.error('Token pair generation failed:', error);
            throw new Error('Failed to generate token pair');
        }
    }

    verifyAccessToken(token: string): TokenPayload {
        try {
            const verifyOptions: VerifyOptions = {
                issuer: 'hrms',
                audience: 'hrms-users'
            };

            return jwt.verify(token, this.accessSecret, verifyOptions) as TokenPayload;
        } catch (error) {
            // Preserve the original error type for better error handling
            if (error instanceof jwt.TokenExpiredError) {
                throw error;
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw error;
            }
            logger.error('Access token verification failed:', error);
            throw new Error('Invalid access token');
        }
    }

    verifyRefreshToken(token: string): TokenPayload {
        try {
            const verifyOptions: VerifyOptions = {
                issuer: 'hrms',
                audience: 'hrms-users'
            };

            return jwt.verify(token, this.refreshSecret, verifyOptions) as TokenPayload;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw error;
            }
            if (error instanceof jwt.JsonWebTokenError) {
                throw error;
            }
            logger.error('Refresh token verification failed:', error);
            throw new Error('Invalid refresh token');
        }
    }

    async validateRefreshToken(userId: string, tokenId: string): Promise<boolean> {
        try {
            const redisKey = `refresh:${userId}`;
            const stored = await redisManager.get(redisKey);
            return stored === tokenId;
        } catch (error) {
            logger.error('Failed to validate refresh token:', error);
            return false;
        }
    }

    async revokeRefreshToken(userId: string): Promise<void> {
        try {
            const redisKey = `refresh:${userId}`;
            await redisManager.del(redisKey);
        } catch (error) {
            logger.error('Failed to revoke refresh token:', error);
            throw new Error('Failed to revoke refresh token');
        }
    }

    // Additional helper method to decode token without verification
    decodeToken(token: string): TokenPayload | null {
        try {
            return jwt.decode(token) as TokenPayload | null;
        } catch (error) {
            logger.error('Token decode failed:', error);
            return null;
        }
    }

    // Helper method to check if token is expired
    isTokenExpired(token: string): boolean {
        try {
            const decoded = jwt.decode(token) as JwtPayload;
            if (!decoded || !decoded.exp) return true;
            return Date.now() >= decoded.exp * 1000;
        } catch (error) {
            return true;
        }
    }

    // Helper method to get remaining time on token
    getTokenRemainingTime(token: string): number {
        try {
            const decoded = jwt.decode(token) as JwtPayload;
            if (!decoded || !decoded.exp) return 0;
            const remaining = decoded.exp * 1000 - Date.now();
            return Math.max(0, remaining);
        } catch (error) {
            return 0;
        }
    }
}

export const jwtService = JWTService.getInstance();
export default jwtService;
