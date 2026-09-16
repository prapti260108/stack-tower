/**
 * Leaderboard Controller
 */

import { PlayerProfile } from '../models/PlayerProfile.js';

export const getLeaderboard = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit, 10) || 20, 50);
    const topScores = await PlayerProfile.getTopScores(limit);

    // Map into ranked response
    const ranked = topScores.map((player, index) => ({
      rank: index + 1,
      playerId: player.playerId,
      username: player.username || `Player_${player.playerId.slice(-4)}`,
      bestScore: player.bestScore || 0,
      highestCombo: player.highestCombo || 0,
      totalGames: player.totalGames || 0,
      stars: player.stars || 0
    }));

    res.status(200).json({
      success: true,
      data: {
        leaderboard: ranked,
        total: ranked.length
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updatePlayerName = async (req, res, next) => {
  try {
    const { playerId } = req.params;
    const { username } = req.body;

    if (!username || typeof username !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Username is required and must be a string'
      });
    }

    const cleanName = username.trim().slice(0, 24);
    const profile = await PlayerProfile.findOneAndUpdate(
      { playerId },
      { username: cleanName },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};
