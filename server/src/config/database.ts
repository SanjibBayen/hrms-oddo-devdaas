import mongoose from 'mongoose';
import { logger } from './logger';

class DatabaseManager {
  private static instance: DatabaseManager;
  private writeConnection: mongoose.Connection | null = null;
  private readConnection: mongoose.Connection | null = null;
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

    const writeUri = process.env.MONGODB_WRITE_URI || 'mongodb://localhost:27017/hrms';
    const readUri = process.env.MONGODB_READ_URI || writeUri;

    try {
      // Write connection
      this.writeConnection = mongoose.createConnection(writeUri, {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        w: 'majority',
      });

      await this.writeConnection.asPromise();
      logger.info('MongoDB connected');

      // For Atlas free tier, use same connection for reads
      if (readUri === writeUri) {
        this.readConnection = this.writeConnection;
        logger.info('ℹUsing same connection for reads (Atlas free tier)');
      } else {
        this.readConnection = mongoose.createConnection(readUri, {
          maxPoolSize: 10,
          minPoolSize: 2,
          serverSelectionTimeoutMS: 10000,
          socketTimeoutMS: 45000,
        });
        await this.readConnection.asPromise();
        logger.info('MongoDB read replica connected');
      }

      this.connected = true;
    } catch (error) {
      logger.error('MongoDB connection failed:', error);
      throw error;
    }
  }

  getWriteDB(): mongoose.Connection {
    if (!this.writeConnection) throw new Error('Database not connected');
    return this.writeConnection;
  }

  getReadDB(): mongoose.Connection {
    if (!this.readConnection) {
      return this.getWriteDB();
    }
    return this.readConnection;
  }

  async disconnect(): Promise<void> {
    if (this.writeConnection) await this.writeConnection.close();
    this.connected = false;
  }

  async healthCheck(): Promise<{ write: boolean; read: boolean }> {
    try {
      const result = await this.writeConnection?.db?.admin().ping();
      return {
        write: result?.ok === 1,
        read: result?.ok === 1,
      };
    } catch {
      return { write: false, read: false };
    }
  }
}

export const databaseManager = DatabaseManager.getInstance();
export default databaseManager;