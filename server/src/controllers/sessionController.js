/**
 * Game Session Controller
 */

import { GameSession } from '../models/GameSession.js';
import { PlayerProfile } from '../models/PlayerProfile.js';

export const recordSession = async (req, res, next) => {
  try {
    const { playerId, score, duration, endReason, progressionPoint, isBestScore } = req.body;

    const session = await GameSession.create({
      playerId,
      score,
      duration: duration || 0,
      endReason: endReason || 'MISS',
      progressionPoint: progressionPoint || 'END_GAME',
      isBestScore: !!isBestScore
    });

    // Automatically update player profile if score is higher
    const existing = await PlayerProfile.findOne({ playerId });
    if (existing) {
      const updates = {
        totalGames: (existing.totalGames || 0) + 1
      };
      if (score > (existing.bestScore || 0)) {
        updates.bestScore = score;
      }
      await PlayerProfile.findOneAndUpdate({ playerId }, updates);
    }

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    next(error);
  }
};

export const getPlayerSessions = async (req, res, next) => {
  try {
    const { playerId } = req.params;
    const sessions = await GameSession.find({ playerId });

    res.status(200).json({
      success: true,
      data: sessions
    });
  } catch (error) {
    next(error);
  }
};
