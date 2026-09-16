/**
 * Rate Limiting Middleware with Zero-Dependency Fallback
 */

let rateLimit;
try {
  rateLimit = await import('express-rate-limit').then(m => m.default || m);
} catch (e) {
  rateLimit = null;
}

// In-memory sliding window fallback
const requestCounts = new Map();

export const apiRateLimiter = (options = { windowMs: 60 * 1000, max: 120 }) => {
  if (rateLimit) {
    return rateLimit({
      windowMs: options.windowMs,
      max: options.max,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        error: 'Too many requests, please try again later.'
      }
    });
  }

  return (req, res, next) => {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';
    const now = Date.now();
    const windowStart = now - options.windowMs;

    const timestamps = (requestCounts.get(ip) || []).filter(t => t > windowStart);

    if (timestamps.length >= options.max) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests, please try again later.'
      });
    }

    timestamps.push(now);
    requestCounts.set(ip, timestamps);
    next();
  };
};
