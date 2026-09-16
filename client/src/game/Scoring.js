/**
 * Scoring and Combo Management for Stack Tower
 */

import { GAME_CONFIG } from '../config/gameConfig.js';

export class ScoringSystem {
  constructor() {
    this.score = 0;
    this.comboStreak = 0;
    this.highestCombo = 0;
    this.totalPlacements = 0;
  }

  reset() {
    this.score = 0;
    this.comboStreak = 0;
    this.highestCombo = 0;
    this.totalPlacements = 0;
  }

  processPlacement(placementType) {
    const {
      scorePerPlacement,
      perfectBonusScore,
      nearPerfectBonusScore,
      comboMultiplierStep,
      maxComboMultiplier,
      comboMilestoneStep,
      comboMilestoneWidthBonus
    } = GAME_CONFIG.scoring;

    this.totalPlacements += 1;

    let pointsAwarded = scorePerPlacement;
    let widthBonus = 0;
    let comboGained = false;

    if (placementType === 'PERFECT') {
      this.comboStreak += 1;
      comboGained = true;
      if (this.comboStreak > this.highestCombo) {
        this.highestCombo = this.comboStreak;
      }

      const multiplier = Math.min(
        maxComboMultiplier,
        1.0 + (this.comboStreak - 1) * comboMultiplierStep
      );

      pointsAwarded = Math.round((scorePerPlacement + perfectBonusScore) * multiplier);

      // Check for combo milestone width restoration bonus
      if (this.comboStreak > 0 && this.comboStreak % comboMilestoneStep === 0) {
        widthBonus = comboMilestoneWidthBonus;
      }
    } else if (placementType === 'NEAR_PERFECT') {
      // Near perfect doesn't break combo streak, but doesn't increment it either
      pointsAwarded += nearPerfectBonusScore;
    } else {
      // Normal placement resets combo streak
      this.comboStreak = 0;
    }

    this.score += pointsAwarded;

    return {
      pointsAwarded,
      newScore: this.score,
      comboStreak: this.comboStreak,
      comboGained,
      widthBonus,
      highestCombo: this.highestCombo
    };
  }

  getStats() {
    return {
      score: this.score,
      comboStreak: this.comboStreak,
      highestCombo: this.highestCombo,
      totalPlacements: this.totalPlacements
    };
  }
}
