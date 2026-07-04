import * as jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { redisManager } from '../config/redis';

interface TokenPayload {
  sub: string;
  employeeId: string;
  role: string;
  type: 'access' | 'refresh';
  tokenId?: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

class JWTService {
  private static instance: JWTService;
  private accessSecret: jwt.Secret;
  private refreshSecret: jwt.Secret;
  private accessExpiry: string;
  private refreshExpiry: string;

  private constructor() {
    this.accessSecret = process.env.JWT_ACCESS_SECRET || 'dev-secret-change-me';
    this.refreshSecret = process.env.JWT_REFRESH_SECRET || 'dev-refresh-change-me';
    this.accessExpiry = process.env.JWT_ACCESS_EXPIRY || '15m';
    this.refreshExpiry = process.env.JWT_REFRESH_EXPIRY || '7d';
  }

  static getInstance(): JWTService {
    if (!JWTService.instance) {
      JWTService.instance = new JWTService();
    }
    return JWTService.instance;
  }

  generateTokenPair(user: { _id: string; employeeId: string; role: string }): TokenPair {
    const tokenId = crypto.randomBytes(32).toString('hex');

    const accessToken = jwt.sign(
      {
        sub: user._id,
        employeeId: user.employeeId,
        role: user.role,
        type: 'access',
      } as unknown as string | Buffer | object,
      this.accessSecret as jwt.Secret,
      {
        expiresIn: this.accessExpiry,
        issuer: 'hrms-enterprise',
        audience: 'hrms-users',
      } as jwt.SignOptions
    );

    const refreshToken = jwt.sign(
      {
        sub: user._id,
        tokenId,
        type: 'refresh',
      } as unknown as string | Buffer | object,
      this.refreshSecret as jwt.Secret,
      {
        expiresIn: this.refreshExpiry,
        issuer: 'hrms-enterprise',
        audience: 'hrms-users',
      } as jwt.SignOptions
    );

    // Store refresh token in Redis for rotation
    this.storeRefreshToken(user._id.toString(), tokenId);

    return { accessToken, refreshToken };
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.accessSecret, {
        issuer: 'hrms-enterprise',
        audience: 'hrms-users',
      }) as TokenPayload;

      if (decoded.type !== 'access') {
        throw new Error('TOKEN_INVALID');
      }

      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('TOKEN_EXPIRED');
      }
      throw new Error('TOKEN_INVALID');
    }
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.refreshSecret, {
        issuer: 'hrms-enterprise',
        audience: 'hrms-users',
      }) as TokenPayload;

      if (decoded.type !== 'refresh') {
        throw new Error('REFRESH_TOKEN_INVALID');
      }

      return decoded;
    } catch (error) {
      throw new Error('REFRESH_TOKEN_INVALID');
    }
  }

  private async storeRefreshToken(userId: string, tokenId: string): Promise<void> {
    const key = `refresh_token:${userId}`;
    await redisManager.set(key, tokenId, 7 * 24 * 60 * 60); // 7 days
  }

  async validateRefreshToken(userId: string, tokenId: string): Promise<boolean> {
    const key = `refresh_token:${userId}`;
    const storedTokenId = await redisManager.get(key);
    return storedTokenId === tokenId;
  }

  async revokeRefreshToken(userId: string): Promise<void> {
    const key = `refresh_token:${userId}`;
    await redisManager.del(key);
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await redisManager.delPattern(`refresh_token:${userId}*`);
  }

  generateFingerprint(req: {
    headers: Record<string, string | undefined>;
    ip?: string;
    socket?: { remoteAddress?: string };
  }): string {
    const userAgent = req.headers['user-agent'] || '';
    const acceptLanguage = req.headers['accept-language'] || '';
    const ip = req.ip || req.socket?.remoteAddress || '';

    return crypto.createHash('sha256').update(`${userAgent}:${acceptLanguage}:${ip}`).digest('hex');
  }
}

export const jwtService = JWTService.getInstance();
export default jwtService;
