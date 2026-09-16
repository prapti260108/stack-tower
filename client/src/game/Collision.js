/**
 * Collision & Cutting Logic for Stack Tower
 * Deterministic overlap calculation, cutting math, and overhang fragment extraction.
 */

import { GAME_CONFIG } from '../config/gameConfig.js';

export const checkPlacementOverlap = (activeBlock, topPlatform) => {
  const { perfectThreshold, nearPerfectThreshold } = GAME_CONFIG.scoring;

  const activeLeft = activeBlock.x;
  const activeRight = activeBlock.x + activeBlock.width;
  const platformLeft = topPlatform.x;
  const platformRight = topPlatform.x + topPlatform.width;

  const delta = Math.abs(activeBlock.x - topPlatform.x);

  // 1. Check for Perfect Placement (Snap to platform)
  if (delta <= perfectThreshold) {
    return {
      type: 'PERFECT',
      placedBlock: {
        x: topPlatform.x, // Perfect snap
        y: activeBlock.y,
        width: topPlatform.width,
        height: activeBlock.height,
        color: activeBlock.color
      },
      cutFragment: null,
      delta
    };
  }

  // 2. Calculate Overlap Bounds
  const overlapLeft = Math.max(activeLeft, platformLeft);
  const overlapRight = Math.min(activeRight, platformRight);
  const overlapWidth = overlapRight - overlapLeft;

  // 3. Complete Miss (Overlap <= 0)
  if (overlapWidth <= 0) {
    return {
      type: 'MISS',
      placedBlock: null,
      cutFragment: {
        x: activeBlock.x,
        y: activeBlock.y,
        width: activeBlock.width,
        height: activeBlock.height,
        color: activeBlock.color,
        vx: activeBlock.direction ? activeBlock.direction * 50 : 0,
        vy: 0,
        rotation: 0,
        vRot: (Math.random() - 0.5) * 4,
        opacity: 1
      },
      delta
    };
  }

  // 4. Successful Placement with Overhang Cut
  const isNearPerfect = delta <= nearPerfectThreshold;

  let cutX = 0;
  let cutWidth = 0;
  let cutImpulse = 1;

  if (activeLeft < platformLeft) {
    // Sliced piece is on the LEFT
    cutX = activeLeft;
    cutWidth = platformLeft - activeLeft;
    cutImpulse = -1;
  } else {
    // Sliced piece is on the RIGHT
    cutX = platformRight;
    cutWidth = activeRight - platformRight;
    cutImpulse = 1;
  }

  const placedBlock = {
    x: overlapLeft,
    y: activeBlock.y,
    width: overlapWidth,
    height: activeBlock.height,
    color: activeBlock.color
  };

  const cutFragment = cutWidth > 0 ? {
    x: cutX,
    y: activeBlock.y,
    width: cutWidth,
    height: activeBlock.height,
    color: activeBlock.color,
    vx: cutImpulse * GAME_CONFIG.blocks.overhangImpulseX,
    vy: -40, // Slight initial upward bounce for realistic feel
    rotation: 0,
    vRot: cutImpulse * 3.5,
    opacity: 1
  } : null;

  return {
    type: isNearPerfect ? 'NEAR_PERFECT' : 'NORMAL',
    placedBlock,
    cutFragment,
    delta
  };
};
