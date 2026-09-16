/**
 * Stack Tower - Centralized Game Configuration
 * All gameplay tuning parameters are maintained here to avoid magic numbers.
 */

export const GAME_CONFIG = {
  // Virtual Canvas Coordinate Space (Resolution Independent)
  canvas: {
    virtualWidth: 400,
    virtualHeight: 700,
    targetFps: 60,
    maxDeltaTime: 0.1 // clamp delta time to 100ms to prevent huge jumps on tab resume
  },

  // Block Dimensions & Physics
  blocks: {
    initialWidth: 200,
    minWidth: 16,
    height: 38,
    basePlatformHeight: 65,
    fallSpeed: 1200, // pixels per second when dropping
    initialSpeed: 230, // pixels per second horizontally
    maxSpeed: 550,
    fragmentFadeSpeed: 2.0, // opacity decay per second
    fragmentGravity: 1800, // gravity on cut-off pieces
    overhangImpulseX: 70 // horizontal impulse given to sliced fragment
  },

  // Scoring and Combo Multipliers
  scoring: {
    scorePerPlacement: 1,
    perfectThreshold: 3.5, // pixel delta considered a perfect placement
    nearPerfectThreshold: 8.0, // pixel delta considered near-perfect
    perfectBonusScore: 2,
    nearPerfectBonusScore: 1,
    comboMultiplierStep: 0.5, // multiplier increment per consecutive perfect
    maxComboMultiplier: 4.0,
    comboMilestoneWidthBonus: 6, // extra width restored on 5 consecutive perfects
    comboMilestoneStep: 5
  },

  // Camera Settings
  camera: {
    lerpSpeed: 0.08, // smooth vertical tracking interpolation
    verticalOffset: 320 // distance from top of screen to active tower top
  },

  // Visual Effects & Particles
  effects: {
    particleCountNormal: 8,
    particleCountPerfect: 28,
    particleDuration: 0.7,
    screenShakeIntensity: 7,
    screenShakeDuration: 0.22
  },

  // Difficulty Progression Tiers
  // Difficulty increases gradually as score milestones are reached
  difficultyLevels: [
    { minScore: 0, speed: 230, windStrength: 0, description: 'Warmup' },
    { minScore: 5, speed: 270, windStrength: 0, description: 'Casual' },
    { minScore: 12, speed: 320, windStrength: 0.05, description: 'Brisk' },
    { minScore: 22, speed: 380, windStrength: 0.12, description: 'Challenging' },
    { minScore: 35, speed: 440, windStrength: 0.20, description: 'Expert' },
    { minScore: 50, speed: 500, windStrength: 0.30, description: 'Master' },
    { minScore: 75, speed: 550, windStrength: 0.40, description: 'Grandmaster' }
  ],

  // Storage Keys
  storage: {
    profileKey: 'stack_tower_profile_v1',
    settingsKey: 'stack_tower_settings_v1',
    statsKey: 'stack_tower_stats_v1',
    tutorialKey: 'stack_tower_tutorial_completed'
  },

  // Default Player Settings
  defaultSettings: {
    music: true,
    sfx: true,
    haptics: true,
    reducedMotion: false
  },

  // Game State Enum
  states: {
    READY: 'READY',
    PLAYING: 'PLAYING',
    FALLING: 'FALLING',
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE',
    PAUSED: 'PAUSED',
    RESULTS: 'RESULTS'
  }
};
