import { Router, Request, Response } from 'express';
import { databaseManager } from '../config/database';
import { redisManager } from '../config/redis';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const dbHealth = await databaseManager.healthCheck();
  let redisHealth = false;
  try {
    redisHealth = (await redisManager.getClient().ping()) === 'PONG';
  } catch {
    redisHealth = false;
  }

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbHealth,
    redis: redisHealth,
    memory: process.memoryUsage(),
  });
});

export default router;