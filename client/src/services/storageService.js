/**
 * Safe Storage Service for Stack Tower
 * LocalStorage persistence with memory fallback and corruption safeguards.
 */

import { GAME_CONFIG } from '../config/gameConfig';

class StorageService {
  constructor() {
    this.memoryStorage = new Map();
    this.isLocalStorageAvailable = this.testLocalStorage();
  }

  testLocalStorage() {
    try {
      const testKey = '__st_test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (e) {
      console.warn('localStorage unavailable, using memory fallback');
      return false;
    }
  }

  getItem(key, defaultValue = null) {
    try {
      if (this.isLocalStorageAvailable) {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item);
      }
    } catch (e) {
      console.warn(`Failed reading storage key "${key}":`, e);
    }
    return this.memoryStorage.has(key) ? this.memoryStorage.get(key) : defaultValue;
  }

  setItem(key, value) {
    try {
      if (this.isLocalStorageAvailable) {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.warn(`Failed writing storage key "${key}":`, e);
    }
    this.memoryStorage.set(key, value);
  }

  // Player ID Management
  getPlayerId() {
    let playerId = this.getItem(GAME_CONFIG.storage.profileKey);
    if (!playerId) {
      playerId = 'player_' + Math.random().toString(36).substring(2, 8) + Date.now().toString(36).slice(-4);
      this.setItem(GAME_CONFIG.storage.profileKey, playerId);
    }
    return playerId;
  }

  // Player Name Management
  getUsername() {
    return this.getItem('st_username', 'TowerBuilder');
  }

  saveUsername(name) {
    const clean = (name || 'TowerBuilder').trim().slice(0, 24);
    this.setItem('st_username', clean);
    return clean;
  }

  // Player Stats Management
  getStats() {
    return this.getItem(GAME_CONFIG.storage.statsKey, {
      bestScore: 0,
      totalGames: 0,
      totalPlacements: 0,
      highestCombo: 0
    });
  }

  updateStats(gameScore, combo, placements) {
    const current = this.getStats();
    const isNewBest = gameScore > current.bestScore;
    const updated = {
      bestScore: Math.max(current.bestScore, gameScore),
      totalGames: current.totalGames + 1,
      totalPlacements: current.totalPlacements + placements,
      highestCombo: Math.max(current.highestCombo, combo)
    };
    this.setItem(GAME_CONFIG.storage.statsKey, updated);
    return { updated, isNewBest };
  }

  // Currency / Stars Economy
  getStars() {
    return this.getItem('st_stars', 50); // Start with 50 stars welcome bonus
  }

  addStars(amount) {
    const current = this.getStars();
    const updated = Math.max(0, current + amount);
    this.setItem('st_stars', updated);
    return updated;
  }

  spendStars(amount) {
    const current = this.getStars();
    if (current >= amount) {
      const updated = current - amount;
      this.setItem('st_stars', updated);
      return { success: true, balance: updated };
    }
    return { success: false, balance: current };
  }

  // Cosmetics Management (6 Materials, 5 Backgrounds)
  getCosmetics() {
    return this.getItem('st_cosmetics', {
      unlockedMaterials: ['prism_neon'],
      unlockedBackgrounds: ['midnight_sky'],
      selectedMaterial: 'prism_neon',
      selectedBackground: 'midnight_sky'
    });
  }

  saveCosmetics(cosmetics) {
    this.setItem('st_cosmetics', cosmetics);
  }

  // Settings Management
  getSettings() {
    return this.getItem(GAME_CONFIG.storage.settingsKey, GAME_CONFIG.defaultSettings);
  }

  saveSettings(settings) {
    this.setItem(GAME_CONFIG.storage.settingsKey, settings);
  }

  // Tutorial Completion
  isTutorialCompleted() {
    return !!this.getItem(GAME_CONFIG.storage.tutorialKey, false);
  }

  setTutorialCompleted(completed = true) {
    this.setItem(GAME_CONFIG.storage.tutorialKey, completed);
  }

  // Local Device Leaderboard & Run History (100% Offline)
  getLocalLeaderboard() {
    const raw = this.getItem('st_local_leaderboard', []);
    if (!Array.isArray(raw)) return [];
    return raw;
  }

  recordLocalRun({ score, highestCombo, totalPlacements, starsEarned, durationSec }) {
    const current = this.getLocalLeaderboard();
    const runEntry = {
      id: 'run_' + Date.now().toString(36) + Math.random().toString(36).slice(-3),
      score: score || 0,
      highestCombo: highestCombo || 0,
      totalPlacements: totalPlacements || 0,
      starsEarned: starsEarned || 0,
      durationSec: durationSec || 0,
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      username: this.getUsername()
    };

    const updated = [...current, runEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 15); // keep top 15 personal bests on device

    this.setItem('st_local_leaderboard', updated);
    return updated;
  }

  // Offline Sync Queue (syncs to MongoDB Atlas when internet/server is restored)
  getOfflineQueue() {
    return this.getItem('st_offline_queue', []);
  }

  queueOfflineRun(sessionData) {
    const current = this.getOfflineQueue();
    const updated = [...current, { ...sessionData, queuedAt: Date.now() }];
    this.setItem('st_offline_queue', updated);
    return updated;
  }

  clearOfflineQueue() {
    this.setItem('st_offline_queue', []);
  }

  // Clear all data
  clearAll() {
    try {
      if (this.isLocalStorageAvailable) {
        localStorage.clear();
      }
    } catch (e) {}
    this.memoryStorage.clear();
  }
}

export const storageService = new StorageService();
export default storageService;
