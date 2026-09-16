/**
 * Health Routes
 */

import { Router } from 'express';
import { getDbStatus } from '../config/db.js';

const router = Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      databaseConnected: getDbStatus()
    }
  });
});

export default router;
