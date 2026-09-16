/**
 * Database & Environment Configuration Routes
 */

import { Router } from 'express';
import { getDbStatus } from '../config/db.js';

const router = Router();

// GET /api/config/mongo - Get database status
router.get('/mongo', (req, res) => {
  const status = getDbStatus();
  res.status(200).json({
    success: true,
    data: status
  });
});

export default router;
