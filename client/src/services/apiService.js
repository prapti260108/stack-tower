/**
 * API Service for Stack Tower
 * Connects to the Express backend with non-blocking graceful offline fallback.
 */

const isNativeOrMobileWithoutRemoteUrl = () => {
  if (import.meta.env.VITE_API_URL) return false;
  if (typeof window === 'undefined') return false;
  const isCapacitor = Boolean(window.Capacitor) || window.location.protocol === 'capacitor:' || window.location.protocol === 'ionic:';
  const isMobileLocal = window.location.hostname === 'localhost' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  return isCapacitor || isMobileLocal;
};

const getApiBase = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  const host = typeof window !== 'undefined' && window.location.hostname ? window.location.hostname : 'localhost';
  return `http://${host}:5001/api`;
};

class ApiService {
  constructor() {
    this.isOnline = true;
  }

  async request(endpoint, options = {}) {
    // Immediate browser offline check to prevent connection delay
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      this.isOnline = false;
      return {
        success: false,
        offline: true,
        error: 'Device is offline'
      };
    }

    // On mobile/Capacitor builds without a dedicated remote server, fail immediately
    // to avoid a 2.5s TCP timeout hanging the WebView thread.
    if (isNativeOrMobileWithoutRemoteUrl()) {
      this.isOnline = false;
      return {
        success: false,
        offline: true,
        error: 'Device save mode active'
      };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5s fast timeout

      const apiBase = getApiBase();
      const response = await fetch(`${apiBase}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        signal: controller.signal,
        ...options
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      this.isOnline = true;
      return data;
    } catch (err) {
      // Graceful offline fallback
      this.isOnline = false;
      return {
        success: false,
        offline: true,
        error: err.name === 'AbortError' ? 'Server unreachable' : err.message
      };
    }
  }

  // Health check
  async checkHealth() {
    return this.request('/health');
  }

  // Database status. Atlas credentials are intentionally configured on the
  // server, never sent from a browser.
  async getMongoStatus() {
    return this.request('/config/mongo');
  }

  // Player Profile
  async getPlayer(playerId) {
    return this.request(`/player/${playerId}`);
  }

  async registerPlayer(playerId, username = 'Player') {
    return this.request('/player', {
      method: 'POST',
      body: JSON.stringify({ playerId, username })
    });
  }

  async updatePlayer(playerId, stats) {
    return this.request(`/player/${playerId}`, {
      method: 'PATCH',
      body: JSON.stringify(stats)
    });
  }

  // Leaderboard
  async getLeaderboard(limit = 20) {
    return this.request(`/leaderboard?limit=${limit}`);
  }

  async updatePlayerName(playerId, username) {
    return this.request(`/leaderboard/player/${playerId}/name`, {
      method: 'PATCH',
      body: JSON.stringify({ username })
    });
  }

  // Game Session Recording
  async recordGameSession(sessionData) {
    return this.request('/game/session', {
      method: 'POST',
      body: JSON.stringify(sessionData)
    });
  }

  // Automatic sync of games played offline once connected to MongoDB
  async syncOfflineQueue(storage) {
    if (!storage) return { success: false, synced: 0 };
    const queue = storage.getOfflineQueue();
    if (!queue || queue.length === 0) return { success: true, synced: 0 };

    let synced = 0;
    const remaining = [];

    for (const session of queue) {
      try {
        const res = await this.recordGameSession(session);
        if (res && res.success) {
          synced++;
        } else {
          remaining.push(session);
        }
      } catch (e) {
        remaining.push(session);
      }
    }

    storage.clearOfflineQueue();
    if (remaining.length > 0) {
      remaining.forEach(item => storage.queueOfflineRun(item));
    }

    return { success: true, synced, remaining: remaining.length };
  }
}

export const apiService = new ApiService();
export default apiService;
