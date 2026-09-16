/**
 * Player Routes
 */

import { Router } from 'express';
import {
  getPlayerProfile,
  registerPlayer,
  updatePlayerProfile
} from '../controllers/playerController.js';
import {
  validatePlayerRegistration,
  validatePlayerUpdate
} from '../middleware/validator.js';

const router = Router();

router.get('/:playerId', getPlayerProfile);
router.post('/', validatePlayerRegistration, registerPlayer);
router.patch('/:playerId', validatePlayerUpdate, updatePlayerProfile);

export default router;
