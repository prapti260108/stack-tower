/**
 * Request Validation Middleware for Stack Tower
 */

export const validatePlayerRegistration = (req, res, next) => {
  const { playerId } = req.body || {};

  if (!playerId || typeof playerId !== 'string' || playerId.trim().length < 3 || playerId.length > 64) {
    return res.status(400).json({
      success: false,
      error: 'Invalid or missing playerId. Must be a string between 3 and 64 characters.'
    });
  }

  next();
};

export const validateGameSession = (req, res, next) => {
  const { playerId, score, duration } = req.body || {};

  if (!playerId || typeof playerId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Valid playerId is required.'
    });
  }

  if (typeof score !== 'number' || score < 0 || !Number.isInteger(score)) {
    return res.status(400).json({
      success: false,
      error: 'Score must be a non-negative integer.'
    });
  }

  // Anti-cheat sanity heuristic: placing 1 block takes at least ~0.4s
  if (duration !== undefined && duration < 0) {
    return res.status(400).json({
      success: false,
      error: 'Duration cannot be negative.'
    });
  }

  if (score > 10 && duration !== undefined && duration < score * 0.2) {
    return res.status(400).json({
      success: false,
      error: 'Unrealistic session duration for given score.'
    });
  }

  next();
};

export const validatePlayerUpdate = (req, res, next) => {
  const { bestScore, totalGames, highestCombo, totalPlacements, unlockedContent } = req.body || {};

  if (bestScore !== undefined && (typeof bestScore !== 'number' || bestScore < 0)) {
    return res.status(400).json({ success: false, error: 'bestScore must be a positive number.' });
  }

  if (totalGames !== undefined && (typeof totalGames !== 'number' || totalGames < 0)) {
    return res.status(400).json({ success: false, error: 'totalGames must be a positive number.' });
  }

  if (highestCombo !== undefined && (typeof highestCombo !== 'number' || highestCombo < 0)) {
    return res.status(400).json({ success: false, error: 'highestCombo must be a positive number.' });
  }

  if (totalPlacements !== undefined && (typeof totalPlacements !== 'number' || totalPlacements < 0)) {
    return res.status(400).json({ success: false, error: 'totalPlacements must be a positive number.' });
  }

  if (unlockedContent !== undefined && (!Array.isArray(unlockedContent) || !unlockedContent.every(item => typeof item === 'string'))) {
    return res.status(400).json({ success: false, error: 'unlockedContent must be an array of strings.' });
  }

  next();
};
