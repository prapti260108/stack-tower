/**
 * Math utilities for Stack Tower
 */

export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

export const lerp = (start, end, t) => start + (end - start) * t;

export const roundToPrecision = (num, decimals = 2) => {
  const factor = Math.pow(10, decimals);
  return Math.round(num * factor) / factor;
};

export const randomRange = (min, max) => Math.random() * (max - min) + min;
