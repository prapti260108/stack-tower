import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert';
import { GameLoop } from '../src/game/GameLoop.js';

const originalRaf = globalThis.requestAnimationFrame;
const originalCancelRaf = globalThis.cancelAnimationFrame;

afterEach(() => {
  globalThis.requestAnimationFrame = originalRaf;
  globalThis.cancelAnimationFrame = originalCancelRaf;
});

describe('GameLoop restart behavior', () => {
  test('starting a paused, running loop resumes it for a new game', () => {
    let nextFrameId = 0;
    globalThis.requestAnimationFrame = () => ++nextFrameId;
    globalThis.cancelAnimationFrame = () => {};

    const loop = new GameLoop(() => {}, () => {});
    loop.start();
    loop.pause();

    loop.start();

    assert.strictEqual(loop.isRunning, true);
    assert.strictEqual(loop.isPaused, false);
  });

  test('stopping clears paused state before the next game starts', () => {
    globalThis.requestAnimationFrame = () => 1;
    globalThis.cancelAnimationFrame = () => {};

    const loop = new GameLoop(() => {}, () => {});
    loop.start();
    loop.pause();
    loop.stop();

    assert.strictEqual(loop.isRunning, false);
    assert.strictEqual(loop.isPaused, false);
  });
});
