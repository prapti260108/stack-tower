/**
 * GameLoop for Stack Tower
 * Provides stable requestAnimationFrame loop with delta-time clamping.
 */

import { GAME_CONFIG } from '../config/gameConfig.js';

export class GameLoop {
  constructor(onUpdate, onRender) {
    this.onUpdate = onUpdate;
    this.onRender = onRender;
    this.isRunning = false;
    this.isPaused = false;
    this.lastTime = 0;
    this.animationFrameId = null;

    this.tick = this.tick.bind(this);
  }

  start() {
    // A game-over run keeps the render loop alive but paused so the final
    // frame remains visible. Starting a new run must wake that same loop.
    if (this.isRunning) {
      if (this.isPaused) this.resume();
      return;
    }
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.animationFrameId = requestAnimationFrame(this.tick);
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    this.lastTime = 0;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    if (!this.isRunning) {
      this.start();
      return;
    }
    this.isPaused = false;
    this.lastTime = performance.now(); // Reset timestamp to prevent delta jump
  }

  tick(currentTime) {
    if (!this.isRunning) return;

    const rawDelta = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Clamp delta-time to avoid physics glitching if tab was inactive
    const dt = Math.min(rawDelta, GAME_CONFIG.canvas.maxDeltaTime);

    if (!this.isPaused && dt > 0) {
      this.onUpdate(dt);
    }

    this.onRender();

    this.animationFrameId = requestAnimationFrame(this.tick);
  }
}
