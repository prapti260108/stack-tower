/**
 * Master Game Engine for Stack Tower
 * Coordinates canvas rendering, block animation, physics cutting, camera, audio, and state machine.
 */

import { GAME_CONFIG } from '../config/gameConfig.js';
import { GameLoop } from './GameLoop.js';
import { checkPlacementOverlap } from './Collision.js';
import { ScoringSystem } from './Scoring.js';
import { DifficultySystem } from './Difficulty.js';
import { Camera } from './Camera.js';
import { ParticleSystem } from './Particles.js';
import { getBlockColor, getBackgroundGradient, setActiveMaterialTheme, setActiveBackgroundTheme } from '../utils/colorPalette.js';
import { audioService } from '../services/audioService.js';

export class GameEngine {
  constructor(canvas, callbacks = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.callbacks = callbacks; // { onScoreUpdate, onStateChange, onGameOver }

    // Subsystems
    this.scoring = new ScoringSystem();
    this.difficulty = new DifficultySystem();
    this.camera = new Camera();
    this.particles = new ParticleSystem();

    // Game Loop
    this.loop = new GameLoop(this.update.bind(this), this.render.bind(this));

    // State
    this.state = GAME_CONFIG.states.READY;
    this.tower = [];
    this.activeBlock = null;
    this.fallVelocity = 0;
    this.pausedState = null;
    this.resultTimeoutId = null;
    this.elapsedTime = 0;
    this.sessionStartTime = 0;
    this.isInputLocked = false;
    this.settings = GAME_CONFIG.defaultSettings;
    this.totalStarsEarnedThisRun = 0;

    // Viewport scaling
    this.scale = 1;
    this.offsetX = 0;
    this.offsetY = 0;

    // Bind event handlers
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.resize = this.resize.bind(this);

    this.init();
  }

  init() {
    this.resize();
    this.initEventListeners();
    this.resetGame();
  }

  initEventListeners() {
    window.addEventListener('resize', this.resize);
    window.addEventListener('keydown', this.handleKeyDown);
    this.canvas.addEventListener('pointerdown', this.handlePointerDown);
  }

  destroy() {
    this.loop.stop();
    if (this.resultTimeoutId) {
      clearTimeout(this.resultTimeoutId);
      this.resultTimeoutId = null;
    }
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('keydown', this.handleKeyDown);
    if (this.canvas) {
      this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
    }
  }

  updateSettings(settings) {
    this.settings = { ...this.settings, ...settings };
    audioService.updateSettings(settings);
    if (settings.selectedMaterial) {
      setActiveMaterialTheme(settings.selectedMaterial);
    }
    if (settings.selectedBackground) {
      setActiveBackgroundTheme(settings.selectedBackground);
    }
  }

  setTheme(materialId, bgId) {
    if (materialId) setActiveMaterialTheme(materialId);
    if (bgId) setActiveBackgroundTheme(bgId);
  }

  resize() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement || window;
    const rect = parent.getBoundingClientRect ? parent.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;

    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    // Scale virtual coordinates (400 virtual width) to fit canvas maintaining aspect ratio
    const virtualW = GAME_CONFIG.canvas.virtualWidth;
    const virtualH = GAME_CONFIG.canvas.virtualHeight;

    const scaleX = (rect.width * dpr) / virtualW;
    const scaleY = (rect.height * dpr) / virtualH;

    // Uniform fit
    this.scale = Math.min(scaleX, scaleY);
    this.offsetX = (this.canvas.width - virtualW * this.scale) / 2;
    this.offsetY = (this.canvas.height - virtualH * this.scale) / 2;
  }

  setState(newState) {
    this.state = newState;
    if (this.callbacks.onStateChange) {
      this.callbacks.onStateChange(newState);
    }
  }

  resetGame() {
    if (this.resultTimeoutId) {
      clearTimeout(this.resultTimeoutId);
      this.resultTimeoutId = null;
    }

    this.scoring.reset();
    this.camera.reset();
    this.particles.reset();
    this.tower = [];
    this.isInputLocked = false;
    this.pausedState = null;
    this.elapsedTime = 0;
    this.sessionStartTime = Date.now();
    this.totalStarsEarnedThisRun = 0;

    const virtualW = GAME_CONFIG.canvas.virtualWidth;
    const virtualH = GAME_CONFIG.canvas.virtualHeight;
    const baseH = GAME_CONFIG.blocks.basePlatformHeight;
    const initW = GAME_CONFIG.blocks.initialWidth;

    // Create Base Foundation Platform
    const basePlatform = {
      x: (virtualW - initW) / 2,
      y: virtualH - baseH - 30,
      width: initW,
      height: baseH,
      color: getBlockColor(0)
    };
    this.tower.push(basePlatform);

    this.spawnNextBlock();
    this.setState(GAME_CONFIG.states.READY);

    if (this.callbacks.onScoreUpdate) {
      this.callbacks.onScoreUpdate({
        ...this.scoring.getStats(),
        starsEarnedTotal: 0
      });
    }
  }

  startGame() {
    if (this.state === GAME_CONFIG.states.READY) {
      this.setState(GAME_CONFIG.states.PLAYING);
      // `start` also resumes an already-running loop. This is needed after
      // restarting from the results screen, where the loop was paused.
      this.loop.start();
      audioService.startBGM();
    }
  }

  spawnNextBlock() {
    const topPlatform = this.tower[this.tower.length - 1];
    const towerIndex = this.tower.length;
    const virtualW = GAME_CONFIG.canvas.virtualWidth;
    const blockH = GAME_CONFIG.blocks.height;

    // Start alternating from Left to Right or Right to Left
    const startFromLeft = towerIndex % 2 === 0;
    const blockWidth = Math.max(topPlatform.width, GAME_CONFIG.blocks.minWidth);

    const startX = startFromLeft ? -blockWidth : virtualW;
    const targetY = topPlatform.y - blockH;
    // Spawn active block hovering 45px above target platform
    const hoverY = targetY - 45;

    this.activeBlock = {
      x: startX,
      y: hoverY,
      targetY: targetY,
      width: blockWidth,
      height: blockH,
      direction: startFromLeft ? 1 : -1,
      color: getBlockColor(towerIndex)
    };

    this.fallVelocity = 0;
    this.isInputLocked = false;
  }

  handlePointerDown(e) {
    e.preventDefault();
    this.triggerDropAction();
  }

  handleKeyDown(e) {
    if (e.code === 'Space' || e.code === 'ArrowDown' || e.code === 'KeyW') {
      e.preventDefault();
      this.triggerDropAction();
    }
  }

  triggerDropAction() {
    // 1. If at READY, first tap starts the game
    if (this.state === GAME_CONFIG.states.READY) {
      this.startGame();
      return;
    }

    // 2. Strict Input Lock: Ignore taps if paused, falling, results, or locked
    if (
      this.state !== GAME_CONFIG.states.PLAYING ||
      this.isInputLocked ||
      !this.activeBlock
    ) {
      return;
    }

    // Lock input to prevent multi-drop glitches
    this.isInputLocked = true;
    this.setState(GAME_CONFIG.states.FALLING);
    audioService.playDrop();
  }

  pauseGame() {
    if (this.state === GAME_CONFIG.states.PLAYING || this.state === GAME_CONFIG.states.FALLING) {
      this.pausedState = this.state;
      this.setState(GAME_CONFIG.states.PAUSED);
      this.loop.pause();
    }
  }

  resumeGame() {
    if (this.state === GAME_CONFIG.states.PAUSED) {
      this.setState(this.pausedState || GAME_CONFIG.states.PLAYING);
      this.pausedState = null;
      this.loop.resume();
    }
  }

  update(dt) {
    this.elapsedTime += dt;
    this.camera.update(dt, this.settings.reducedMotion);
    this.particles.update(dt, this.settings.reducedMotion);

    if (!this.activeBlock) return;

    const virtualW = GAME_CONFIG.canvas.virtualWidth;

    // 1. ACTIVE BLOCK HORIZONTAL MOVEMENT (State: PLAYING)
    if (this.state === GAME_CONFIG.states.PLAYING) {
      const speed = this.difficulty.getSpeed(this.scoring.score);
      const windOffset = this.difficulty.getWindOffset(this.elapsedTime, this.scoring.score);

      this.activeBlock.x += (speed * this.activeBlock.direction + windOffset) * dt;

      // Bounce at boundaries
      const maxRight = virtualW - this.activeBlock.width;
      if (this.activeBlock.direction > 0 && this.activeBlock.x >= maxRight + 20) {
        this.activeBlock.direction = -1;
      } else if (this.activeBlock.direction < 0 && this.activeBlock.x <= -20) {
        this.activeBlock.direction = 1;
      }
    }

    // 2. ACTIVE BLOCK VERTICAL DROP (State: FALLING)
    else if (this.state === GAME_CONFIG.states.FALLING) {
      const fallSpeed = GAME_CONFIG.blocks.fallSpeed;
      this.activeBlock.y += fallSpeed * dt;

      // Check if active block has reached the landing platform height
      if (this.activeBlock.y >= this.activeBlock.targetY) {
        this.activeBlock.y = this.activeBlock.targetY;
        this.resolveLanding();
      }
    }

    // 3. FAILURE STATE (Active block missed and falls off screen)
    else if (this.state === GAME_CONFIG.states.FAILURE) {
      if (this.activeBlock) {
        this.activeBlock.y += 1400 * dt;
      }
    }
  }

  resolveLanding() {
    const topPlatform = this.tower[this.tower.length - 1];
    const collision = checkPlacementOverlap(this.activeBlock, topPlatform);

    // Case A: Complete Miss
    if (collision.type === 'MISS') {
      this.setState(GAME_CONFIG.states.FAILURE);
      this.particles.addFragment(collision.cutFragment);
      this.activeBlock = null;
      this.camera.triggerShake(10, 0.35);
      audioService.playMiss();

      // Trigger Game Over after brief miss animation
      this.resultTimeoutId = setTimeout(() => {
        this.resultTimeoutId = null;
        this.setState(GAME_CONFIG.states.RESULTS);
        this.loop.pause();

        const finalStats = {
          score: this.scoring.score,
          highestCombo: this.scoring.highestCombo,
          totalPlacements: this.scoring.totalPlacements,
          starsEarned: this.totalStarsEarnedThisRun,
          durationSec: Math.round((Date.now() - this.sessionStartTime) / 1000)
        };

        if (this.callbacks.onGameOver) {
          this.callbacks.onGameOver(finalStats);
        }
      }, 550);
      return;
    }

    // Case B: Successful Placement (Perfect, Near Perfect, or Normal)
    const result = this.scoring.processPlacement(collision.type);
    const placed = collision.placedBlock;

    // Award gameplay currency / stars
    let starsEarned = 1;
    if (collision.type === 'NEAR_PERFECT') starsEarned = 2;
    if (collision.type === 'PERFECT') starsEarned = 3 + Math.floor(result.comboStreak / 2);
    this.totalStarsEarnedThisRun += starsEarned;

    // Apply combo milestone width expansion bonus if earned
    if (result.widthBonus > 0) {
      placed.width = Math.min(
        placed.width + result.widthBonus,
        GAME_CONFIG.blocks.initialWidth
      );
      placed.x = Math.max(0, placed.x - result.widthBonus / 2);
    }

    // Add successfully landed block to the tower
    this.tower.push(placed);

    // Handle Cut Slice
    if (collision.cutFragment) {
      this.particles.addFragment(collision.cutFragment);
    }

    // Trigger Visual Effects and Audio
    if (collision.type === 'PERFECT') {
      this.particles.spawnSparkles(placed.x, placed.y, placed.width, placed.color.hue);
      this.camera.triggerShake(4, 0.15);
      audioService.playPerfect(result.comboStreak);
    } else {
      this.particles.spawnLandingDust(placed.x, placed.y + placed.height, placed.width);
      this.camera.triggerShake(2, 0.1);
      audioService.playLand();
    }

    // Update Camera Target as tower height increases
    this.camera.updateTarget(this.tower.length, GAME_CONFIG.blocks.height);

    // Notify React UI of score and stats update
    if (this.callbacks.onScoreUpdate) {
      this.callbacks.onScoreUpdate({
        ...this.scoring.getStats(),
        placementType: collision.type,
        pointsAwarded: result.pointsAwarded,
        starsEarned,
        starsEarnedTotal: this.totalStarsEarnedThisRun
      });
    }

    // Spawn Next Block
    this.spawnNextBlock();
    this.setState(GAME_CONFIG.states.PLAYING);
  }

  render() {
    const { ctx, canvas } = this;
    if (!ctx || !canvas) return;

    const virtualW = GAME_CONFIG.canvas.virtualWidth;
    const virtualH = GAME_CONFIG.canvas.virtualHeight;

    // 1. Clear Canvas with Dynamic Gradient Background
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = getBackgroundGradient(this.camera.y, ctx, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Setup Virtual Coordinate System with Centered Aspect Scaling
    ctx.save();
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.scale, this.scale);

    // 3. Apply Camera Translation & Screen Shake
    const shake = this.camera.getShakeOffset();
    ctx.save();
    ctx.translate(shake.x, this.camera.y + shake.y);

    // 4. Draw Ambient Background Grid Lines
    this.renderAtmosphericGrid(ctx, virtualW, virtualH);

    // 5. Draw Stacked Tower Blocks
    for (let i = 0; i < this.tower.length; i++) {
      this.renderBlock(ctx, this.tower[i], i === this.tower.length - 1);
    }

    // 6. Draw subtle drop alignment guide on top platform
    if (this.activeBlock && this.state === GAME_CONFIG.states.PLAYING && this.tower.length > 0) {
      const topPlatform = this.tower[this.tower.length - 1];
      const overlapLeft = Math.max(this.activeBlock.x, topPlatform.x);
      const overlapRight = Math.min(this.activeBlock.x + this.activeBlock.width, topPlatform.x + topPlatform.width);
      if (overlapRight > overlapLeft) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.fillRect(overlapLeft, topPlatform.y, overlapRight - overlapLeft, 3);
      }
    }

    // 7. Draw Active / Falling Block
    if (this.activeBlock && this.state !== GAME_CONFIG.states.RESULTS) {
      this.renderBlock(ctx, this.activeBlock, false, true);
    }

    // 8. Draw Cut Fragments and Sparkle Particles
    this.particles.render(ctx);

    ctx.restore(); // Restore Camera
    ctx.restore(); // Restore Coordinate System
  }

  renderAtmosphericGrid(ctx, width, height) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    const startY = Math.floor(-this.camera.y / 80) * 80;
    const endY = startY + height + 300;

    for (let y = startY; y < endY; y += 80) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  renderBlock(ctx, block, isTopPlatform = false, isActive = false) {
    const { x, y, width, height, color } = block;
    if (width <= 0) return;
    const radius = 6;

    ctx.save();

    // Subtle soft drop shadow for clean depth
    ctx.shadowColor = isActive ? (color.glow || 'rgba(6, 182, 212, 0.5)') : 'rgba(0, 0, 0, 0.35)';
    ctx.shadowBlur = isActive ? 16 : 8;
    ctx.shadowOffsetY = 4;

    // Clean rounded rectangle path
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, [radius, radius, radius, radius]);
    ctx.fillStyle = color.fill;
    ctx.fill();

    // Subtle soft top surface shine highlight
    const shineGrad = ctx.createLinearGradient(x, y, x, y + height * 0.45);
    shineGrad.addColorStop(0, color.highlight || 'rgba(255, 255, 255, 0.4)');
    shineGrad.addColorStop(1, 'rgba(255, 255, 255, 0.0)');
    ctx.fillStyle = shineGrad;
    ctx.fill();

    // Crisp smooth border outline
    ctx.strokeStyle = color.stroke;
    ctx.lineWidth = isTopPlatform || isActive ? 2.2 : 1.2;
    ctx.stroke();

    ctx.restore();
  }
}

export default GameEngine;
