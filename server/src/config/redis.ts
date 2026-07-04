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

    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 5) return null;
        return Math.min(times * 200, 2000);
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    this.client.on('connect', () => logger.info('Redis connected'));
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