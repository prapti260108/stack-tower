/**
 * GameSession Mongoose Schema
 */

let mongoose;
try {
  mongoose = await import('mongoose').then(m => m.default || m);
} catch (e) {
  mongoose = null;
}

const inMemorySessions = [];

let GameSessionModel = null;

if (mongoose && mongoose.Schema) {
  const gameSessionSchema = new mongoose.Schema(
    {
      playerId: {
        type: String,
        required: true,
        index: true,
        trim: true
      },
      score: {
        type: Number,
        required: true,
        min: 0
      },
      duration: {
        type: Number,
        default: 0,
        min: 0
      },
      endReason: {
        type: String,
        default: 'MISS',
        enum: ['MISS', 'QUIT', 'TIMEOUT']
      },
      progressionPoint: {
        type: String,
        default: 'END_GAME'
      },
      isBestScore: {
        type: Boolean,
        default: false
      }
    },
    {
      timestamps: { createdAt: true, updatedAt: false }
    }
  );

  GameSessionModel = mongoose.models.GameSession || mongoose.model('GameSession', gameSessionSchema);
}

export const GameSession = {
  async create(data) {
    if (GameSessionModel) {
      try {
        return await GameSessionModel.create(data);
      } catch (e) {
        // Fall back to memory on error
      }
    }
    const session = { ...data, _id: 'sess_' + Math.random().toString(36).substr(2, 9), createdAt: new Date() };
    inMemorySessions.push(session);
    return session;
  },

  async find(filter = {}, limit = 50) {
    if (GameSessionModel) {
      try {
        return await GameSessionModel.find(filter).sort({ createdAt: -1 }).limit(limit);
      } catch (e) {
        // Fall back to memory on error
      }
    }
    return inMemorySessions
      .filter(s => (!filter.playerId || s.playerId === filter.playerId))
      .slice(-limit);
  }
};

export default GameSession;
