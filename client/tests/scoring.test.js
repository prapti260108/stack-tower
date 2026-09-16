import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { ScoringSystem } from '../src/game/Scoring.js';

describe('Scoring & Combo System', () => {
  let scoring;

  beforeEach(() => {
    scoring = new ScoringSystem();
  });

  test('awards 1 point for normal placement and resets combo streak', () => {
    const res = scoring.processPlacement('NORMAL');
    assert.strictEqual(res.pointsAwarded, 1);
    assert.strictEqual(res.newScore, 1);
    assert.strictEqual(res.comboStreak, 0);
    assert.strictEqual(res.comboGained, false);
  });

  test('awards bonus points and increments combo for PERFECT placement', () => {
    // 1st perfect
    const res1 = scoring.processPlacement('PERFECT');
    assert.strictEqual(res1.comboStreak, 1);
    assert.strictEqual(res1.comboGained, true);
    assert.strictEqual(res1.pointsAwarded, 3); // (1 base + 2 bonus) * 1.0 = 3

    // 2nd consecutive perfect: multiplier increases to 1.5
    const res2 = scoring.processPlacement('PERFECT');
    assert.strictEqual(res2.comboStreak, 2);
    assert.strictEqual(res2.pointsAwarded, 5); // round((1 + 2) * 1.5) = 5
    assert.strictEqual(res2.newScore, 8);
  });

  test('normal placement breaks consecutive perfect combo streak', () => {
    scoring.processPlacement('PERFECT');
    scoring.processPlacement('PERFECT');
    assert.strictEqual(scoring.comboStreak, 2);

    const breakRes = scoring.processPlacement('NORMAL');
    assert.strictEqual(breakRes.comboStreak, 0);
    assert.strictEqual(scoring.highestCombo, 2);
  });

  test('awards width restoration bonus at 5 consecutive perfect milestone', () => {
    let lastRes;
    for (let i = 0; i < 5; i++) {
      lastRes = scoring.processPlacement('PERFECT');
    }
    assert.strictEqual(lastRes.comboStreak, 5);
    assert.strictEqual(lastRes.widthBonus > 0, true);
  });
});
