/**
 * Game Session Routes
 */

import { Router } from 'express';
import {
  recordSession,
  getPlayerSessions
} from '../controllers/sessionController.js';
import { validateGameSession } from '../middleware/validator.js';

const router = Router();

router.post('/session', validateGameSession, recordSession);
router.get('/sessions/:playerId', getPlayerSessions);

export default router;
