import mongoose from 'mongoose';
import { logger } from './logger';

class DatabaseManager {
  private static instance: DatabaseManager;
  private writeConnection: mongoose.Connection | null = null;
  private readConnection: mongoose.Connection | null = null;
  private isConnected: boolean = false;
  private connectionRetries: number = 0;
  private readonly MAX_RETRIES = 5;
  private readonly RETRY_DELAY_MS = 5000;

  private constructor() {}

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) {
      DatabaseManager.instance = new DatabaseManager();
    }
    return DatabaseManager.instance;
  }

  async connect(): Promise<{
    write: mongoose.Connection;
    read: mongoose.Connection;
  }> {
    if (this.isConnected && this.writeConnection && this.readConnection) {
      return { write: this.writeConnection, read: this.readConnection };
    }

    const writeUri =
      process.env.MONGODB_WRITE_URI ||
      'mongodb://admin:password@localhost:27017/hrms?authSource=admin';
    const readUri = process.env.MONGODB_READ_URI || writeUri;

    try {
      // Connect to Write Primary
      this.writeConnection = await this.createConnection(writeUri, 'primary');
      logger.info(' MongoDB Write Primary connected');

      // Connect to Read Replica
      this.readConnection = await this.createConnection(readUri, 'secondaryPreferred');
      logger.info(' MongoDB Read Replica connected');

      this.isConnected = true;
      this.connectionRetries = 0;

      // Monitor connections
      this.monitorConnection(this.writeConnection, 'Write Primary');
      this.monitorConnection(this.readConnection, 'Read Replica');

      return { write: this.writeConnection, read: this.readConnection };
    } catch (error) {
      this.connectionRetries++;
      logger.error(
        ` MongoDB connection failed (attempt ${this.connectionRetries}/${this.MAX_RETRIES})`
      );

      if (this.connectionRetries < this.MAX_RETRIES) {
        logger.info(`Retrying in ${this.RETRY_DELAY_MS / 1000}s...`);
        await new Promise((resolve) => setTimeout(resolve, this.RETRY_DELAY_MS));
        return this.connect();
      }

      throw new Error(`Failed to connect to MongoDB after ${this.MAX_RETRIES} attempts`);
    }
  }

  private async createConnection(
    uri: string,
    readPreference: 'primary' | 'primaryPreferred' | 'secondary' | 'secondaryPreferred' | 'nearest'
  ): Promise<mongoose.Connection> {
    const connection = mongoose.createConnection(uri, {
      maxPoolSize: readPreference === 'primary' ? 50 : 100,
      minPoolSize: readPreference === 'primary' ? 10 : 20,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      retryReads: true,
      w: 'majority',
      readPreference,
      maxIdleTimeMS: 60000,
      connectTimeoutMS: 10000,
    });

    // Wait for connection
    await connection.asPromise();
    return connection;
  }

  private monitorConnection(connection: mongoose.Connection, name: string): void {
    connection.on('connected', () => {
      logger.info(`MongoDB ${name} connected`);
    });

    connection.on('disconnected', () => {
      logger.warn(`MongoDB ${name} disconnected`);
      this.isConnected = false;
    });

    connection.on('reconnected', () => {
      logger.info(`MongoDB ${name} reconnected`);
      this.isConnected = true;
    });

    connection.on('error', (error) => {
      logger.error(`MongoDB ${name} error:`, error);
    });
  }

  getWriteDB(): mongoose.Connection {
    if (!this.writeConnection || !this.isConnected) {
      throw new Error('Write database not connected. Call connect() first.');
    }
    return this.writeConnection;
  }

  getReadDB(): mongoose.Connection {
    if (!this.readConnection || !this.isConnected) {
      // Fallback to write connection if read replica is unavailable
      logger.warn('Read replica unavailable, falling back to write primary');
      return this.getWriteDB();
    }
    return this.readConnection;
  }

  async disconnect(): Promise<void> {
    if (this.writeConnection) {
      await this.writeConnection.close();
    }
    if (this.readConnection) {
      await this.readConnection.close();
    }
    this.isConnected = false;
    logger.info('MongoDB connections closed');
  }

  async healthCheck(): Promise<{
    write: boolean;
    read: boolean;
    latency: { write: number; read: number };
  }> {
    const result = {
      write: false,
      read: false,
      latency: { write: 0, read: 0 },
    };

    if (this.writeConnection) {
      const start = Date.now();
      try {
        await this.writeConnection.db?.admin().ping();
        result.write = true;
        result.latency.write = Date.now() - start;
      } catch {
        result.write = false;
      }
    }

    if (this.readConnection) {
      const start = Date.now();
      try {
        await this.readConnection.db?.admin().ping();
        result.read = true;
        result.latency.read = Date.now() - start;
      } catch {
        result.read = false;
      }
    }

    return result;
  }
}

export const databaseManager = DatabaseManager.getInstance();
export default databaseManager;
