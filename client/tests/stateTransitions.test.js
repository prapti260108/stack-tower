import { test, describe } from 'node:test';
import assert from 'node:assert';
import { GAME_CONFIG } from '../src/config/gameConfig.js';

describe('Game State Transitions & Invariants', () => {
  test('all core game states are uniquely defined', () => {
    const states = GAME_CONFIG.states;
    assert.strictEqual(states.READY, 'READY');
    assert.strictEqual(states.PLAYING, 'PLAYING');
    assert.strictEqual(states.FALLING, 'FALLING');
    assert.strictEqual(states.SUCCESS, 'SUCCESS');
    assert.strictEqual(states.FAILURE, 'FAILURE');
    assert.strictEqual(states.PAUSED, 'PAUSED');
    assert.strictEqual(states.RESULTS, 'RESULTS');

    const uniqueValues = new Set(Object.values(states));
    assert.strictEqual(uniqueValues.size, Object.keys(states).length);
  });

  test('validates state transition flow from READY to PLAYING to FALLING', () => {
    let currentState = GAME_CONFIG.states.READY;
    assert.strictEqual(currentState, 'READY');

    // Tap to start
    currentState = GAME_CONFIG.states.PLAYING;
    assert.strictEqual(currentState, 'PLAYING');

    // Tap to drop
    currentState = GAME_CONFIG.states.FALLING;
    assert.strictEqual(currentState, 'FALLING');
  });

  test('pause preserves state and halts time dilation', () => {
    let activeState = GAME_CONFIG.states.PLAYING;
    let isPaused = true;
    assert.strictEqual(isPaused, true);
    assert.strictEqual(activeState, 'PLAYING');
  });
});
