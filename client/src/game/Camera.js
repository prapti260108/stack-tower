/**
 * Camera System for Stack Tower
 * Smooth vertical tracking and screen shake support
 */

import { GAME_CONFIG } from '../config/gameConfig.js';
import { lerp } from '../utils/math.js';

export class Camera {
  constructor() {
    this.y = 0;
    this.targetY = 0;
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.shakeTimer = 0;
  }

  reset() {
    this.y = 0;
    this.targetY = 0;
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.shakeTimer = 0;
  }

  updateTarget(towerCount, blockHeight) {
    // Keep top of tower roughly at 50% from the bottom
    const thresholdCount = 5;
    if (towerCount > thresholdCount) {
      this.targetY = (towerCount - thresholdCount) * blockHeight;
    } else {
      this.targetY = 0;
    }
  }

  triggerShake(intensity = GAME_CONFIG.effects.screenShakeIntensity, duration = GAME_CONFIG.effects.screenShakeDuration) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
    this.shakeTimer = duration;
  }

  update(dt, reducedMotion = false) {
    // Smooth camera lerp
    const lerpSpeed = reducedMotion ? 0.15 : GAME_CONFIG.camera.lerpSpeed;
    this.y = lerp(this.y, this.targetY, lerpSpeed);

    // Update screen shake
    if (this.shakeTimer > 0 && !reducedMotion) {
      this.shakeTimer -= dt;
      if (this.shakeTimer < 0) this.shakeTimer = 0;
    }
  }

  getShakeOffset() {
    if (this.shakeTimer <= 0) return { x: 0, y: 0 };
    const progress = this.shakeTimer / this.shakeDuration;
    const currentIntensity = this.shakeIntensity * progress;
    return {
      x: (Math.random() - 0.5) * currentIntensity * 2,
      y: (Math.random() - 0.5) * currentIntensity * 2
    };
  }
}
