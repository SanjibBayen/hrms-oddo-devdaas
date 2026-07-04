import mongoose from 'mongoose';
import dns from 'dns';
import { logger } from './logger';

// Force IPv4
dns.setDefaultResultOrder('ipv4first');

class DatabaseManager {
  private static instance: DatabaseManager;
  private connection: mongoose.Connection | null = null;
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

    // Try SRV first, fallback to direct connection
    let uri = process.env.MONGODB_WRITE_URI || 'mongodb://localhost:27017/hrms';

    try {
      this.connection = mongoose.createConnection(uri, {
        maxPoolSize: 5,
        minPoolSize: 1,
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 30000,
        retryWrites: true,
        w: 'majority',
        family: 4,
      });

      await this.connection.asPromise();
      logger.info('MongoDB connected');

      this.connection.on('error', (err) => logger.error('MongoDB Error:', err));
      this.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
        this.connected = false;
      });

      this.connected = true;
    } catch (error: any) {
      // If SRV fails, try direct connection
      if (error.message?.includes('ECONNREFUSED') || error.message?.includes('ENOTFOUND')) {
        logger.warn('SRV connection failed, trying direct connection...');
        
        // Convert SRV to direct connection
        // mongodb+srv://user:pass@cluster0.xtyl4et.mongodb.net/db
        // becomes mongodb://user:pass@cluster0.xtyl4et.mongodb.net:27017/db?ssl=true
        uri = uri
          .replace('mongodb+srv://', 'mongodb://')
          .replace('/hrms?', ':27017/hrms?');

        if (!uri.includes('ssl=true')) {
          uri += '&ssl=true';
        }

        logger.info('Trying direct:', uri.replace(/\/\/.*@/, '//<creds>@'));

        try {
          this.connection = mongoose.createConnection(uri, {
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

          await this.connection.asPromise();
          logger.info('MongoDB connected (direct)');

          this.connection.on('error', (err) => logger.error('MongoDB Error:', err));
          this.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected');
            this.connected = false;
          });

          this.connected = true;
        } catch (directError) {
          logger.error('Direct connection also failed:', directError);
          throw directError;
        }
      } else {
        throw error;
      }
    }
  }

  getWriteDB(): mongoose.Connection {
    if (!this.connection) throw new Error('Database not connected');
    return this.connection;
  }

  getReadDB(): mongoose.Connection {
    return this.getWriteDB();
  }

  async disconnect(): Promise<void> {
    if (this.connection) await this.connection.close();
    this.connected = false;
  }

  async healthCheck(): Promise<{ write: boolean; read: boolean }> {
    try {
      const result = await this.connection?.db?.admin().ping();
      const ok = result?.ok === 1;
      return { write: ok, read: ok };
    } catch {
      return { write: false, read: false };
    }
  }
}

export const databaseManager = DatabaseManager.getInstance();
export default databaseManager;