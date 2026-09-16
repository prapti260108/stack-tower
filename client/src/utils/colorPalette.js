/**
 * Procedural Dynamic Color Palettes for Blocks and Backgrounds
 * Connects to modular theme engine in themes.js
 */

import { getThemeBlockColor, getThemeBackground, BLOCK_MATERIALS, BACKGROUND_THEMES } from './themes.js';

let currentMaterialTheme = 'prism_neon';
let currentBgTheme = 'midnight_sky';

export const setActiveMaterialTheme = (themeId) => {
  if (BLOCK_MATERIALS[themeId]) {
    currentMaterialTheme = themeId;
  }
};

export const setActiveBackgroundTheme = (themeId) => {
  if (BACKGROUND_THEMES[themeId]) {
    currentBgTheme = themeId;
  }
};

export const getActiveMaterialTheme = () => currentMaterialTheme;
export const getActiveBackgroundTheme = () => currentBgTheme;

export const getBlockColor = (index) => {
  return getThemeBlockColor(currentMaterialTheme, index);
};

export const getBackgroundGradient = (cameraY, ctx, width, height) => {
  return getThemeBackground(currentBgTheme, cameraY, ctx, width, height);
};

export { BLOCK_MATERIALS, BACKGROUND_THEMES };
