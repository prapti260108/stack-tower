import { test, describe } from 'node:test';
import assert from 'node:assert';
import { DifficultySystem } from '../src/game/Difficulty.js';
import { GAME_CONFIG } from '../src/config/gameConfig.js';

describe('Difficulty Progression Logic', () => {
  const difficulty = new DifficultySystem();

  test('begins at warmup tier with base speed at score 0', () => {
    const tier = difficulty.getTierForScore(0);
    assert.strictEqual(tier.description, 'Warmup');
    assert.strictEqual(difficulty.getSpeed(0), 230);
  });

  test('gradually scales speed as score milestones increase', () => {
    const speedScore0 = difficulty.getSpeed(0);
    const speedScore10 = difficulty.getSpeed(10);
    const speedScore30 = difficulty.getSpeed(30);
    const speedScore60 = difficulty.getSpeed(60);

    assert.strictEqual(speedScore10 > speedScore0, true);
    assert.strictEqual(speedScore30 > speedScore10, true);
    assert.strictEqual(speedScore60 > speedScore30, true);
  });

  test('caps speed to max configured speed limit', () => {
    const speedMax = difficulty.getSpeed(500);
    assert.strictEqual(speedMax <= GAME_CONFIG.blocks.maxSpeed, true);
  });

  test('wind offset remains zero during warmup and activates in later tiers', () => {
    const windEarly = difficulty.getWindOffset(1.0, 0);
    assert.strictEqual(windEarly, 0);

    const windLater = difficulty.getWindOffset(1.0, 60);
    assert.notStrictEqual(windLater, 0);
  });
});
