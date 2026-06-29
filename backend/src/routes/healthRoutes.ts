import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import os from 'os';

const router = Router();

// GET /api/health  — public, no auth required
router.get('/', async (_req: Request, res: Response) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus =
    dbState === 1 ? 'connected' :
    dbState === 2 ? 'connecting' :
    dbState === 3 ? 'disconnecting' : 'disconnected';

  let dbPingTime = -1;
  const startPing = Date.now();
  if (dbState === 1 && mongoose.connection.db) {
    try {
      await mongoose.connection.db.admin().ping();
      dbPingTime = Date.now() - startPing;
    } catch (err) {
      console.error('Database ping failed:', err);
    }
  }

  const healthy = dbState === 1 && dbPingTime !== -1;

  res.status(healthy ? 200 : 503).json({
    status: healthy ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    version: '3.0.0',
    services: {
      database: {
        status: dbStatus,
        name: mongoose.connection.name || 'unknown',
        pingMs: dbPingTime,
        host: mongoose.connection.host || 'unknown',
      },
      api: {
        status: 'ok',
        port: process.env.PORT || 5000,
      },
    },
    system: {
      platform: os.platform(),
      arch: os.arch(),
      nodeVersion: process.version,
      memory: {
        rssMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
        heapTotalMB: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        heapUsedMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        externalMB: Math.round(process.memoryUsage().external / 1024 / 1024),
      },
      memoryTotalMB: Math.round(os.totalmem() / 1024 / 1024),
      cpuCount: os.cpus().length,
    },
  });
});

export default router;
