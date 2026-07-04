import mongoose from 'mongoose';
import dns from 'dns';
import { logger } from './logger';

dns.setDefaultResultOrder('ipv4first');

class DatabaseManager {
  private static instance: DatabaseManager;
  private connected: boolean = false;

  private constructor() {}

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  async connect(): Promise<void> {
    if (this.connected) {
      logger.info('Database already connected');
      return;
    }

    const uri = process.env.MONGODB_WRITE_URI || 'mongodb://localhost:27017/hrms';

    try {
      await mongoose.connect(uri, {
        maxPoolSize: 5,
        minPoolSize: 1,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        retryWrites: true,
        w: 'majority',
        family: 4,
      });
      logger.info('MongoDB connected via SRV');
      this.connected = true;
    } catch (error: any) {
      if (
        error.message?.includes('ECONNREFUSED') ||
        error.message?.includes('ENOTFOUND')
      ) {
        logger.warn('SRV failed, trying direct connection');

        const directUri = uri
          .replace('mongodb+srv://', 'mongodb://')
          .replace(/\.mongodb\.net\//, '.mongodb.net:27017/');

        const finalUri = directUri.includes('ssl=true')
          ? directUri
          : directUri + (directUri.includes('?') ? '&ssl=true' : '?ssl=true');

        logger.info('Trying direct: ' + finalUri.replace(/\/\/.*@/, '//<credentials>@'));

        await mongoose.connect(finalUri, {
          maxPoolSize: 5,
          minPoolSize: 1,
          serverSelectionTimeoutMS: 30000,
          socketTimeoutMS: 45000,
          connectTimeoutMS: 30000,
          retryWrites: true,
          w: 'majority',
          family: 4,
          ssl: true,
        });
        logger.info('MongoDB connected via direct');
        this.connected = true;
      } else {
        throw error;
      }
    }

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
      this.connected = false;
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('MongoDB reconnected');
      this.connected = true;
    });
  }

  getWriteDB(): mongoose.Connection {
    return mongoose.connection;
  }

  getReadDB(): mongoose.Connection {
    return mongoose.connection;
  }

  async disconnect(): Promise<void> {
    await mongoose.disconnect();
    this.connected = false;
    logger.info('MongoDB connection closed');
  }

  async healthCheck(): Promise<{ write: boolean; read: boolean }> {
    try {
      const result = await mongoose.connection.db?.admin().ping();
      const ok = result?.ok === 1;
      return { write: ok, read: ok };
    } catch {
      return { write: false, read: false };
    }
  }
}

export const databaseManager = DatabaseManager.getInstance();
export default databaseManager;