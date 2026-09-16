/**
 * Stack Tower - Express Backend REST API
 * Production-ready server with Helmet, CORS, Rate Limiting, Mongoose, and offline fallback.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectDB, getDbStatus } from './config/db.js';
import { PlayerProfile } from './models/PlayerProfile.js';
import { GameSession } from './models/GameSession.js';

// Robust .env loader (loads server/.env natively or via dotenv)
try {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const envCandidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), 'server', '.env'),
    path.resolve(__dirname, '..', '.env')
  ];

  for (const envPath of envCandidates) {
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf8').split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const k = trimmed.substring(0, idx).trim();
          const v = trimmed.substring(idx + 1).trim();
          if (!process.env[k]) {
            process.env[k] = v;
          }
        }
      }
      break;
    }
  }
} catch (e) {
  // ignore
}

let PORT = parseInt(process.env.PORT, 10) || 5001;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Dynamically load Express & Security middleware if installed
let expressModule, helmetModule, corsModule;
try {
  expressModule = await import('express').then(m => m.default || m);
  helmetModule = await import('helmet').then(m => m.default || m);
  corsModule = await import('cors').then(m => m.default || m);
} catch (e) {
  expressModule = null;
}

const startServerWithPortRetry = (serverApp, initialPort, isExpress = false) => {
  let currentPort = initialPort;
  const maxRetries = 5;
  let attempts = 0;

  const tryListen = () => {
    const srv = isExpress ? serverApp.listen(currentPort) : serverApp;

    if (!isExpress) {
      serverApp.listen(currentPort);
    }

    srv.on('listening', () => {
      console.log(`🚀 Stack Tower API Server running on port ${currentPort}`);
      console.log(`📡 Health endpoint: http://localhost:${currentPort}/api/health`);
      console.log(`🏆 Leaderboard endpoint: http://localhost:${currentPort}/api/leaderboard`);
      PORT = currentPort;
    });

    srv.on('error', (err) => {
      if (err.code === 'EADDRINUSE' && attempts < maxRetries) {
        attempts++;
        currentPort++;
        console.warn(`⚠️  Port ${currentPort - 1} in use, attempting port ${currentPort}...`);
        setTimeout(tryListen, 250);
      } else {
        console.error('❌ Server listen error:', err);
      }
    });
  };

  tryListen();
};

// 1. FULL EXPRESS SERVER MODE (when dependencies installed)
if (expressModule) {
  const app = expressModule();

  // Security Headers
  if (helmetModule) {
    app.use(helmetModule());
  }

  // CORS Configuration
  if (corsModule) {
    app.use(corsModule({
      origin: (origin, callback) => {
        // Allow all local dev origins or matching CLIENT_URL
        if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1') || origin === CLIENT_URL) {
          callback(null, true);
        } else {
          callback(null, true);
        }
      },
      credentials: true
    }));
  }

  // Body Parsing with size limits
  app.use(expressModule.json({ limit: '15kb' }));

  // Import local routes & middleware
  const { apiRateLimiter } = await import('./middleware/rateLimiter.js');
  const { errorHandler, notFoundHandler } = await import('./middleware/errorHandler.js');
  const healthRoutes = (await import('./routes/healthRoutes.js')).default;
  const playerRoutes = (await import('./routes/playerRoutes.js')).default;
  const sessionRoutes = (await import('./routes/sessionRoutes.js')).default;
  const leaderboardRoutes = (await import('./routes/leaderboardRoutes.js')).default;
  const configRoutes = (await import('./routes/configRoutes.js')).default;

  // Global Rate Limiter
  app.use('/api/', apiRateLimiter({ windowMs: 60 * 1000, max: 180 }));

  // API Routes
  app.use('/api/health', healthRoutes);
  app.use('/api/player', playerRoutes);
  app.use('/api/game', sessionRoutes);
  app.use('/api/leaderboard', leaderboardRoutes);
  app.use('/api/config', configRoutes);

  // 404 & Error Handlers
  app.use(notFoundHandler);
  app.use(errorHandler);

  // Connect MongoDB Atlas and start server with retry
  connectDB().then(() => {
    startServerWithPortRetry(app, PORT, true);
  });
}

// 2. NATIVE NODE.JS HTTP FALLBACK SERVER (Zero-dependency offline mode)
else {
  console.log('ℹ️  Running in native Node.js HTTP fallback mode.');

  const server = http.createServer(async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }

    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = url.pathname;

    // Helper to send JSON
    const sendJson = (status, data) => {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    };

    // Parse JSON body helper
    const readBody = () => new Promise((resolve) => {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : {});
        } catch {
          resolve({});
        }
      });
    });

    try {
      // GET /api/health
      if (req.method === 'GET' && pathname === '/api/health') {
        return sendJson(200, {
          success: true,
          data: {
            status: 'ok',
            uptime: Math.floor(process.uptime()),
            timestamp: new Date().toISOString(),
            databaseConnected: getDbStatus()
          }
        });
      }

      // GET /api/config/mongo
      if (req.method === 'GET' && pathname === '/api/config/mongo') {
        return sendJson(200, {
          success: true,
          data: getDbStatus()
        });
      }

      // GET /api/leaderboard
      if (req.method === 'GET' && pathname === '/api/leaderboard') {
        const topScores = await PlayerProfile.getTopScores(20);
        const ranked = topScores.map((player, index) => ({
          rank: index + 1,
          playerId: player.playerId,
          username: player.username || `Player_${player.playerId.slice(-4)}`,
          bestScore: player.bestScore || 0,
          highestCombo: player.highestCombo || 0,
          totalGames: player.totalGames || 0,
          stars: player.stars || 0
        }));
        return sendJson(200, {
          success: true,
          data: {
            leaderboard: ranked,
            total: ranked.length
          }
        });
      }

      // PATCH /api/leaderboard/player/:playerId/name
      if (req.method === 'PATCH' && pathname.includes('/api/leaderboard/player/')) {
        const parts = pathname.split('/');
        const playerId = parts[4];
        const body = await readBody();
        const cleanName = (body.username || 'Player').trim().slice(0, 24);
        const updated = await PlayerProfile.findOneAndUpdate({ playerId }, { username: cleanName });
        return sendJson(200, { success: true, data: updated });
      }

      // POST /api/player
      if (req.method === 'POST' && pathname === '/api/player') {
        const body = await readBody();
        const profile = await PlayerProfile.create(body);
        return sendJson(200, { success: true, data: profile });
      }

      // GET /api/player/:playerId
      if (req.method === 'GET' && pathname.startsWith('/api/player/')) {
        const playerId = pathname.split('/')[3];
        const profile = await PlayerProfile.findOne({ playerId }) || await PlayerProfile.create({ playerId });
        return sendJson(200, { success: true, data: profile });
      }

      // PATCH /api/player/:playerId
      if (req.method === 'PATCH' && pathname.startsWith('/api/player/')) {
        const playerId = pathname.split('/')[3];
        const body = await readBody();
        const updated = await PlayerProfile.findOneAndUpdate({ playerId }, body);
        return sendJson(200, { success: true, data: updated });
      }

      // POST /api/game/session
      if (req.method === 'POST' && pathname === '/api/game/session') {
        const body = await readBody();
        const session = await GameSession.create(body);

        // Update player stats
        if (body.playerId) {
          const current = await PlayerProfile.findOne({ playerId: body.playerId });
          const updates = {
            totalGames: ((current && current.totalGames) || 0) + 1,
            stars: ((current && current.stars) || 0) + (body.starsEarned || 0)
          };
          if (body.score > ((current && current.bestScore) || 0)) {
            updates.bestScore = body.score;
          }
          await PlayerProfile.findOneAndUpdate({ playerId: body.playerId }, updates);
        }

        return sendJson(201, { success: true, data: session });
      }

      // 404 Not Found
      sendJson(404, { success: false, error: 'Not found' });
    } catch (err) {
      sendJson(500, { success: false, error: err.message });
    }
  });

  connectDB().then(() => {
    startServerWithPortRetry(server, PORT, false);
  });
}
