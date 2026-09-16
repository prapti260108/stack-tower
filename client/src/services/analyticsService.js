/**
 * Lightweight Analytics & Telemetry Service for Stack Tower
 * Decoupled event dispatcher ready for third-party analytics SDK integration.
 */

class AnalyticsService {
  constructor() {
    this.events = [];
    this.subscribers = [];
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  track(eventName, params = {}) {
    const payload = {
      event: eventName,
      timestamp: Date.now(),
      params
    };

    this.events.push(payload);

    // Keep history manageable
    if (this.events.length > 200) {
      this.events.shift();
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[Analytics] ${eventName}:`, params);
    }

    this.subscribers.forEach(sub => {
      try {
        sub(payload);
      } catch (e) {
        console.warn('Analytics subscriber error:', e);
      }
    });
  }

  getRecentEvents() {
    return [...this.events];
  }
}

export const analyticsService = new AnalyticsService();
