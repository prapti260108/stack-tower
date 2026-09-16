/**
 * Particle and Fragment Physics System for Stack Tower
 * Lightweight 2D particles for perfect placement sparkles, landing dust, and falling cut slices.
 */

import { GAME_CONFIG } from '../config/gameConfig.js';

export class ParticleSystem {
  constructor() {
    this.particles = [];
    this.fragments = [];
  }

  reset() {
    this.particles = [];
    this.fragments = [];
  }

  // Spawn sparkle burst on perfect placement
  spawnSparkles(x, y, width, hue = 45, count = GAME_CONFIG.effects.particleCountPerfect) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
      const speed = Math.random() * 220 + 80;
      this.particles.push({
        x: x + Math.random() * width,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 60, // slight upward bias
        size: Math.random() * 4 + 2,
        color: `hsl(${hue + Math.random() * 30 - 15}, 95%, 70%)`,
        alpha: 1,
        life: 0,
        maxLife: Math.random() * 0.4 + 0.4,
        isStar: Math.random() > 0.4
      });
    }
  }

  // Spawn landing dust puff
  spawnLandingDust(x, y, width, count = GAME_CONFIG.effects.particleCountNormal) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: x + Math.random() * width,
        y: y,
        vx: (Math.random() - 0.5) * 120,
        vy: -Math.random() * 40 - 20,
        size: Math.random() * 3 + 2,
        color: 'rgba(255, 255, 255, 0.7)',
        alpha: 0.8,
        life: 0,
        maxLife: 0.35,
        isStar: false
      });
    }
  }

  // Add falling cut slice fragment
  addFragment(fragment) {
    if (fragment) {
      this.fragments.push(fragment);
    }
  }

  update(dt, reducedMotion = false) {
    const gravity = GAME_CONFIG.blocks.fragmentGravity;
    const fadeSpeed = GAME_CONFIG.blocks.fragmentFadeSpeed;

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life += dt;
      if (p.life >= p.maxLife || reducedMotion) {
        this.particles.splice(i, 1);
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 450 * dt; // soft particle gravity
      p.alpha = 1 - p.life / p.maxLife;
    }

    // Update cut fragments
    for (let i = this.fragments.length - 1; i >= 0; i--) {
      const f = this.fragments[i];
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      f.vy += gravity * dt;
      f.rotation += f.vRot * dt;
      f.opacity -= fadeSpeed * dt;

      if (f.opacity <= 0 || f.y > 1500) {
        this.fragments.splice(i, 1);
      }
    }
  }

  render(ctx) {
    // Render particles
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      if (p.isStar) {
        // Draw 4-point diamond sparkle
        ctx.translate(p.x, p.y);
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 1.5);
        ctx.lineTo(p.size * 0.8, 0);
        ctx.lineTo(0, p.size * 1.5);
        ctx.lineTo(-p.size * 0.8, 0);
        ctx.closePath();
      } else {
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.restore();
    }

    // Render falling cut fragments
    for (const f of this.fragments) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, f.opacity);
      ctx.translate(f.x + f.width / 2, f.y + f.height / 2);
      ctx.rotate(f.rotation);

      const halfW = f.width / 2;
      const halfH = f.height / 2;
      const radius = Math.min(4, Math.min(f.width, f.height) / 2);

      ctx.fillStyle = f.color.fill;
      ctx.shadowColor = f.color.glow;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.roundRect(-halfW, -halfH, f.width, f.height, radius);
      ctx.fill();

      ctx.strokeStyle = f.color.stroke;
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.restore();
    }
  }
}
