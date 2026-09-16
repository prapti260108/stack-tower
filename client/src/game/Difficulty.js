/**
 * Difficulty Progression System for Stack Tower
 * Centrally controlled via gameConfig.js
 */

import { GAME_CONFIG } from '../config/gameConfig.js';

export class DifficultySystem {
  constructor() {
    this.currentTier = GAME_CONFIG.difficultyLevels[0];
  }

  getTierForScore(score) {
    const levels = GAME_CONFIG.difficultyLevels;
    let selectedTier = levels[0];

    for (let i = 0; i < levels.length; i++) {
      if (score >= levels[i].minScore) {
        selectedTier = levels[i];
      } else {
        break;
      }
    }

    this.currentTier = selectedTier;
    return selectedTier;
  }

  getSpeed(score) {
    const tier = this.getTierForScore(score);
    // Smooth speed scaling between tiers
    const baseSpeed = tier.speed;
    const cappedSpeed = Math.min(baseSpeed, GAME_CONFIG.blocks.maxSpeed);
    return cappedSpeed;
  }

  getWindOffset(timeSec, score) {
    const tier = this.getTierForScore(score);
    if (!tier.windStrength) return 0;
    // Gentle natural sinusoidal breeze
    return Math.sin(timeSec * 2.5) * tier.windStrength * 20;
  }
}
