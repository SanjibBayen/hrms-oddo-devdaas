import Redis from 'ioredis';
import { logger } from './logger';

class RedisManager {
  private static instance: RedisManager;
  private client: Redis | null = null;
  private isConnected: boolean = false;

  private constructor() {}

  static getInstance(): RedisManager {
    if (!RedisManager.instance) {
      RedisManager.instance = new RedisManager();
    }
    return RedisManager.instance;
  }

  connect(): Redis {
    if (this.client && this.isConnected) {
      return this.client;
    }

    const redisUrl = process.env.REDIS_URL || 'redis://:redispassword@localhost:6379';

    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        if (times > 5) {
          logger.error('Redis max retries reached');
          return null;
        }
        const delay = Math.min(times * 200, 2000);
        logger.warn(`Redis retry attempt ${times} in ${delay}ms`);
        return delay;
      },
      reconnectOnError(err) {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          return true;
        }
        return false;
      },
      lazyConnect: true,
      enableReadyCheck: true,
      connectionName: 'hrms-enterprise',
    });

    this.client.on('connect', () => {
      logger.info('Redis connected');
      this.isConnected = true;
    });

    this.client.on('ready', () => {
      logger.info('Redis ready');
    });

    this.client.on('error', (error) => {
      logger.error('Redis error:', error);
      this.isConnected = false;
    });

    this.client.on('close', () => {
      logger.warn('Redis connection closed');
      this.isConnected = false;
    });

    this.client.on('reconnecting', () => {
      logger.info('Redis reconnecting...');
    });

    return this.client;
  }

  getClient(): Redis {
    if (!this.client) {
      return this.connect();
    }
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

  async delPattern(pattern: string): Promise<void> {
    const client = this.getClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
      logger.info(`Deleted ${keys.length} keys matching pattern: ${pattern}`);
    }
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.getClient().exists(key);
    return result === 1;
  }

  async ttl(key: string): Promise<number> {
    return this.getClient().ttl(key);
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.isConnected = false;
      logger.info('Redis connection closed');
    }
  }

  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.getClient().ping();
      return result === 'PONG';
    } catch {
      return false;
    }
  }
}

export const redisManager = RedisManager.getInstance();
export default redisManager;