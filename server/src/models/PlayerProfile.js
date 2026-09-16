/**
 * PlayerProfile Mongoose Schema & In-Memory Fallback
 */

let mongoose;
try {
  mongoose = await import('mongoose').then(m => m.default || m);
} catch (e) {
  mongoose = null;
}

const inMemoryProfiles = new Map();

// Seed a few demo players if empty for in-memory leaderboard display
const seedDefaultProfiles = () => {
  if (inMemoryProfiles.size === 0) {
    const demoData = [
      { playerId: 'bot-1', username: 'SkyArchitect', bestScore: 42, highestCombo: 8, totalGames: 19, stars: 350 },
      { playerId: 'bot-2', username: 'StackMaster', bestScore: 35, highestCombo: 6, totalGames: 15, stars: 280 },
      { playerId: 'bot-3', username: 'ZenTower', bestScore: 28, highestCombo: 5, totalGames: 12, stars: 190 },
      { playerId: 'bot-4', username: 'ApexBuilder', bestScore: 21, highestCombo: 4, totalGames: 8, stars: 120 },
      { playerId: 'bot-5', username: 'BlockNinja', bestScore: 16, highestCombo: 3, totalGames: 5, stars: 85 }
    ];
    for (const d of demoData) {
      inMemoryProfiles.set(d.playerId, {
        ...d,
        totalPlacements: d.bestScore * 2,
        unlockedMaterials: ['prism_neon'],
        unlockedBackgrounds: ['midnight_sky'],
        selectedMaterial: 'prism_neon',
        selectedBackground: 'midnight_sky',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  }
};
seedDefaultProfiles();

let PlayerProfileModel = null;

if (mongoose && mongoose.Schema) {
  const playerProfileSchema = new mongoose.Schema(
    {
      playerId: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true
      },
      username: {
        type: String,
        default: 'Player',
        trim: true,
        maxLength: 24
      },
      bestScore: {
        type: Number,
        default: 0,
        min: 0,
        index: -1
      },
      totalGames: {
        type: Number,
        default: 0,
        min: 0
      },
      totalPlacements: {
        type: Number,
        default: 0,
        min: 0
      },
      highestCombo: {
        type: Number,
        default: 0,
        min: 0
      },
      stars: {
        type: Number,
        default: 0,
        min: 0
      },
      unlockedMaterials: {
        type: [String],
        default: ['prism_neon']
      },
      unlockedBackgrounds: {
        type: [String],
        default: ['midnight_sky']
      },
      selectedMaterial: {
        type: String,
        default: 'prism_neon'
      },
      selectedBackground: {
        type: String,
        default: 'midnight_sky'
      }
    },
    {
      timestamps: true
    }
  );

  PlayerProfileModel = mongoose.models.PlayerProfile || mongoose.model('PlayerProfile', playerProfileSchema);
}

// Resilient helper methods supporting both MongoDB and In-Memory fallback
export const PlayerProfile = {
  async findOne(filter) {
    if (PlayerProfileModel) {
      try {
        return await PlayerProfileModel.findOne(filter);
      } catch (e) {
        // Fall back to memory on error
      }
    }
    return inMemoryProfiles.get(filter.playerId) || null;
  },

  async create(data) {
    if (PlayerProfileModel) {
      try {
        return await PlayerProfileModel.create(data);
      } catch (e) {
        // Fall back to memory on error
      }
    }
    const profile = {
      username: data.username || 'Player',
      bestScore: 0,
      totalGames: 0,
      totalPlacements: 0,
      highestCombo: 0,
      stars: 0,
      unlockedMaterials: ['prism_neon'],
      unlockedBackgrounds: ['midnight_sky'],
      selectedMaterial: 'prism_neon',
      selectedBackground: 'midnight_sky',
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemoryProfiles.set(data.playerId, profile);
    return profile;
  },

  async findOneAndUpdate(filter, update, options = {}) {
    if (PlayerProfileModel) {
      try {
        const doc = await PlayerProfileModel.findOneAndUpdate(filter, update, { new: true, upsert: true, ...options });
        if (doc) return doc;
      } catch (e) {
        // Fall back to memory on error
      }
    }
    const existing = inMemoryProfiles.get(filter.playerId) || {
      playerId: filter.playerId,
      username: 'Player',
      bestScore: 0,
      totalGames: 0,
      totalPlacements: 0,
      highestCombo: 0,
      stars: 0,
      unlockedMaterials: ['prism_neon'],
      unlockedBackgrounds: ['midnight_sky'],
      selectedMaterial: 'prism_neon',
      selectedBackground: 'midnight_sky',
      createdAt: new Date()
    };
    const updated = { ...existing, ...update, updatedAt: new Date() };
    inMemoryProfiles.set(filter.playerId, updated);
    return updated;
  },

  async getTopScores(limit = 20) {
    if (PlayerProfileModel) {
      try {
        const topDocs = await PlayerProfileModel.find({ bestScore: { $gt: 0 } })
          .sort({ bestScore: -1, highestCombo: -1 })
          .limit(limit)
          .select('playerId username bestScore highestCombo totalGames stars')
          .lean();
        if (topDocs && topDocs.length > 0) {
          return topDocs;
        }
      } catch (e) {
        // Fall back to memory on error
      }
    }

    // In-memory fallback
    const profiles = Array.from(inMemoryProfiles.values())
      .filter(p => p.bestScore > 0)
      .sort((a, b) => b.bestScore - a.bestScore || (b.highestCombo || 0) - (a.highestCombo || 0))
      .slice(0, limit);

    return profiles;
  }
};

export default PlayerProfile;
