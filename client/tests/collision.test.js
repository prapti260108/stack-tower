import { test, describe } from 'node:test';
import assert from 'node:assert';
import { checkPlacementOverlap } from '../src/game/Collision.js';
import { GAME_CONFIG } from '../src/config/gameConfig.js';

describe('Collision & Overlap Logic', () => {
  const topPlatform = {
    x: 100,
    y: 500,
    width: 200,
    height: 38,
    color: { fill: '#fff', stroke: '#eee', glow: '#fff', hue: 200 }
  };

  test('detects PERFECT placement within perfectThreshold', () => {
    const activeBlock = {
      x: 101.5, // delta is 1.5, <= perfectThreshold (3.5)
      y: 462,
      width: 200,
      height: 38,
      direction: 1,
      color: { fill: '#fff', stroke: '#eee', glow: '#fff', hue: 200 }
    };

    const result = checkPlacementOverlap(activeBlock, topPlatform);
    assert.strictEqual(result.type, 'PERFECT');
    assert.strictEqual(result.placedBlock.x, topPlatform.x); // snapped to target platform
    assert.strictEqual(result.placedBlock.width, topPlatform.width);
    assert.strictEqual(result.cutFragment, null);
  });

  test('detects NEAR_PERFECT placement within nearPerfectThreshold', () => {
    const activeBlock = {
      x: 106, // delta is 6, > 3.5 but <= 8.0
      y: 462,
      width: 200,
      height: 38,
      direction: 1,
      color: { fill: '#fff', stroke: '#eee', glow: '#fff', hue: 200 }
    };

    const result = checkPlacementOverlap(activeBlock, topPlatform);
    assert.strictEqual(result.type, 'NEAR_PERFECT');
    assert.strictEqual(result.placedBlock.x, 106);
    assert.strictEqual(result.placedBlock.width, 194); // 200 - 6 cut away
    assert.notStrictEqual(result.cutFragment, null);
    assert.strictEqual(result.cutFragment.width, 6);
  });

  test('calculates correct cut fragment when block hangs to the RIGHT', () => {
    const activeBlock = {
      x: 150, // overhang on right
      y: 462,
      width: 200,
      height: 38,
      direction: 1,
      color: { fill: '#fff', stroke: '#eee', glow: '#fff', hue: 200 }
    };

    const result = checkPlacementOverlap(activeBlock, topPlatform);
    assert.strictEqual(result.type, 'NORMAL');
    assert.strictEqual(result.placedBlock.x, 150);
    assert.strictEqual(result.placedBlock.width, 150); // overlap is [150, 300] = 150px
    assert.notStrictEqual(result.cutFragment, null);
    assert.strictEqual(result.cutFragment.x, 300); // cut starts at right edge of platform
    assert.strictEqual(result.cutFragment.width, 50); // 350 - 300 = 50px
    assert.strictEqual(result.cutFragment.vx > 0, true); // pushed right
  });

  test('calculates correct cut fragment when block hangs to the LEFT', () => {
    const activeBlock = {
      x: 60, // overhang on left
      y: 462,
      width: 200,
      height: 38,
      direction: -1,
      color: { fill: '#fff', stroke: '#eee', glow: '#fff', hue: 200 }
    };

    const result = checkPlacementOverlap(activeBlock, topPlatform);
    assert.strictEqual(result.type, 'NORMAL');
    assert.strictEqual(result.placedBlock.x, 100);
    assert.strictEqual(result.placedBlock.width, 160); // overlap is [100, 260] = 160px
    assert.notStrictEqual(result.cutFragment, null);
    assert.strictEqual(result.cutFragment.x, 60); // cut starts at left edge of active block
    assert.strictEqual(result.cutFragment.width, 40); // 100 - 60 = 40px
    assert.strictEqual(result.cutFragment.vx < 0, true); // pushed left
  });

  test('detects complete MISS when block completely overshoots right', () => {
    const activeBlock = {
      x: 350, // completely to the right of [100, 300]
      y: 462,
      width: 200,
      height: 38,
      direction: 1,
      color: { fill: '#fff', stroke: '#eee', glow: '#fff', hue: 200 }
    };

    const result = checkPlacementOverlap(activeBlock, topPlatform);
    assert.strictEqual(result.type, 'MISS');
    assert.strictEqual(result.placedBlock, null);
    assert.notStrictEqual(result.cutFragment, null);
    assert.strictEqual(result.cutFragment.width, 200); // entire block falls
  });

  test('detects complete MISS when block completely undershoots left', () => {
    const activeBlock = {
      x: -150, // completely to the left of [100, 300]
      y: 462,
      width: 200,
      height: 38,
      direction: -1,
      color: { fill: '#fff', stroke: '#eee', glow: '#fff', hue: 200 }
    };

    const result = checkPlacementOverlap(activeBlock, topPlatform);
    assert.strictEqual(result.type, 'MISS');
    assert.strictEqual(result.placedBlock, null);
  });
});
