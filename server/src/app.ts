import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { databaseManager } from './config/database';
import { redisManager } from './config/redis';
import { logger, morganStream } from './config/logger';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { v2 as cloudinary } from 'cloudinary';

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('short', { stream: morganStream }));
app.use('/uploads', express.static('uploads'));
app.use(routes);
app.use(notFoundHandler);
app.use(errorHandler);

async function start() {
  try {
    await databaseManager.connect();
    logger.info('MongoDB connected');

    redisManager.connect();
    logger.info('Redis connected');

    app.listen(Number(PORT), HOST, () => {
      logger.info(`Server running on http://${HOST}:${PORT}`);
      logger.info(`Health check: http://${HOST}:${PORT}/api/health`);
      logger.info(`API v1: http://${HOST}:${PORT}/api/v1`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', async () => {
  logger.info('Shutting down gracefully...');
  await databaseManager.disconnect();
  await redisManager.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Shutting down gracefully...');
  await databaseManager.disconnect();
  await redisManager.disconnect();
  process.exit(0);
});
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

start();

export default app;