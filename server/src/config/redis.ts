import Redis from 'ioredis';
import { logger } from './logger';

class RedisManager {
  private static instance: RedisManager;
  private client: Redis | null = null;

  private constructor() {}

  static getInstance(): RedisManager {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager();
    }
    return RedisManager.instance;
  }

  connect(): Redis {
    if (this.client) return this.client;

    const redisUrl = process.env.REDIS_URL;

    if (redisUrl) {
      // Full URL provided
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          if (times > 5) return null;
          return Math.min(times * 200, 2000);
        },
        // Only use TLS if port is 6380 or URL has rediss://
        tls: redisUrl.includes('rediss://') ? { rejectUnauthorized: false } : undefined,
      });
    } else {
      // Manual config
      this.client = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: 3,
      });
    }

    this.client.on('connect', () => logger.info('✅ Redis connected'));
    this.client.on('error', (err) => logger.error('Redis Error:', err.message));

    return this.client;
  }

  getClient(): Redis {
    if (!this.client) return this.connect();
    return this.client;
  }

  async get(key: string): Promise<string | null> {
    return this.getClient().get(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<'OK'> {
    if (ttlSeconds) {
      return this.getClient().set(key, value, 'EX', ttlSeconds);
    }
    return this.getClient().set(key, value);
  }

  async del(key: string): Promise<number> {
    return this.getClient().del(key);
  }

  async disconnect(): Promise<void> {
    if (this.client) await this.client.quit();
  }
}

export const redisManager = RedisManager.getInstance();
export default redisManager;