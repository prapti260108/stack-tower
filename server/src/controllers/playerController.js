/**
 * Player Profile Controller
 */

import { PlayerProfile } from '../models/PlayerProfile.js';

export const getPlayerProfile = async (req, res, next) => {
  try {
    const { playerId } = req.params;

    let profile = await PlayerProfile.findOne({ playerId });

    if (!profile) {
      profile = await PlayerProfile.create({
        playerId,
        bestScore: 0,
        totalGames: 0,
        totalPlacements: 0,
        highestCombo: 0,
        unlockedContent: []
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

export const registerPlayer = async (req, res, next) => {
  try {
    const { playerId } = req.body;

    let profile = await PlayerProfile.findOne({ playerId });

    if (!profile) {
      profile = await PlayerProfile.create({
        playerId,
        bestScore: 0,
        totalGames: 0,
        totalPlacements: 0,
        highestCombo: 0,
        unlockedContent: []
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

export const updatePlayerProfile = async (req, res, next) => {
  try {
    const { playerId } = req.params;
    const { bestScore, totalGames, totalPlacements, highestCombo, unlockedContent } = req.body;

    const updates = {};
    if (bestScore !== undefined) updates.bestScore = bestScore;
    if (totalGames !== undefined) updates.totalGames = totalGames;
    if (totalPlacements !== undefined) updates.totalPlacements = totalPlacements;
    if (highestCombo !== undefined) updates.highestCombo = highestCombo;
    if (unlockedContent !== undefined) updates.unlockedContent = unlockedContent;

    const profile = await PlayerProfile.findOneAndUpdate(
      { playerId },
      updates,
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
