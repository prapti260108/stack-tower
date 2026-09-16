/**
 * Leaderboard Routes
 */

import { Router } from 'express';
import { getLeaderboard, updatePlayerName } from '../controllers/leaderboardController.js';

const router = Router();

router.get('/', getLeaderboard);
router.patch('/player/:playerId/name', updatePlayerName);

export default router;
