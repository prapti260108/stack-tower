/**
 * Stack Tower - Material Sets & Dynamic Environmental Themes
 * Implements SOW Section 6 (6 block material sets, 5 backgrounds)
 * and Section 8 (Cosmetic unlock progression).
 */

export const BLOCK_MATERIALS = {
  prism_neon: {
    id: 'prism_neon',
    name: 'Prism Neon',
    tagline: 'Cyberpunk chromatic luminescence',
    cost: 0,
    previewColors: ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'],
    getColor: (index) => {
      const baseHue = 195;
      const hue = (baseHue + index * 6) % 360;
      return {
        fill: `hsl(${hue}, 85%, 55%)`,
        stroke: `hsl(${hue}, 90%, 75%)`,
        glow: `hsla(${hue}, 85%, 55%, 0.55)`,
        highlight: 'rgba(255, 255, 255, 0.45)',
        hue,
        isDark: false
      };
    }
  },

  pastel_dreams: {
    id: 'pastel_dreams',
    name: 'Pastel Dreams',
    tagline: 'Soft soothing macaron tones',
    cost: 50,
    previewColors: ['#fbcfe8', '#fed7aa', '#bbf7d0', '#bfdbfe'],
    getColor: (index) => {
      const hues = [330, 350, 25, 45, 140, 175, 210, 260];
      const hue = hues[index % hues.length];
      return {
        fill: `hsl(${hue}, 70%, 78%)`,
        stroke: `hsl(${hue}, 80%, 90%)`,
        glow: `hsla(${hue}, 70%, 78%, 0.35)`,
        highlight: 'rgba(255, 255, 255, 0.6)',
        hue,
        isDark: false
      };
    }
  },

  sunset_horizon: {
    id: 'sunset_horizon',
    name: 'Sunset Horizon',
    tagline: 'Warm amber, tangerine & twilight crimson',
    cost: 100,
    previewColors: ['#fbbf24', '#f97316', '#ef4444', '#a855f7'],
    getColor: (index) => {
      // Sweeps through 30 deg (amber) -> 0 deg (red) -> 290 deg (violet)
      const t = (index % 40) / 40;
      const hue = (35 - t * 105 + 360) % 360;
      return {
        fill: `hsl(${hue}, 92%, 56%)`,
        stroke: `hsl(${hue}, 95%, 72%)`,
        glow: `hsla(${hue}, 92%, 56%, 0.5)`,
        highlight: 'rgba(255, 255, 255, 0.4)',
        hue,
        isDark: false
      };
    }
  },

  emerald_forest: {
    id: 'emerald_forest',
    name: 'Emerald Forest',
    tagline: 'Lush jade, mint & organic chartreuse',
    cost: 150,
    previewColors: ['#34d399', '#10b981', '#059669', '#14b8a6'],
    getColor: (index) => {
      // Swings between 135 (leaf green) and 175 (cyan teal)
      const hue = 135 + Math.sin(index * 0.25) * 30;
      return {
        fill: `hsl(${hue}, 78%, 46%)`,
        stroke: `hsl(${hue}, 88%, 68%)`,
        glow: `hsla(${hue}, 78%, 46%, 0.45)`,
        highlight: 'rgba(255, 255, 255, 0.42)',
        hue,
        isDark: false
      };
    }
  },

  obsidian_gold: {
    id: 'obsidian_gold',
    name: 'Obsidian Gold',
    tagline: 'Matte titanium with brushed 24k gold leaf',
    cost: 250,
    previewColors: ['#1e293b', '#334155', '#eab308', '#f59e0b'],
    getColor: (index) => {
      const isGoldAccent = index % 5 === 0;
      if (isGoldAccent) {
        return {
          fill: '#f59e0b',
          stroke: '#fef08a',
          glow: 'rgba(245, 158, 11, 0.65)',
          highlight: 'rgba(255, 255, 255, 0.65)',
          hue: 45,
          isDark: false
        };
      }
      const shade = 18 + ((index * 2) % 18);
      return {
        fill: `hsl(220, 20%, ${shade}%)`,
        stroke: '#d97706',
        glow: 'rgba(217, 119, 6, 0.35)',
        highlight: 'rgba(255, 255, 255, 0.25)',
        hue: 40,
        isDark: true
      };
    }
  },

  candy_pop: {
    id: 'candy_pop',
    name: 'Candy Pop',
    tagline: 'Bubblegum, blue raspberry & lemon drop',
    cost: 300,
    previewColors: ['#f43f5e', '#ec4899', '#8b5cf6', '#06b6d4'],
    getColor: (index) => {
      const palette = [
        { hue: 340, fill: '#fb7185', stroke: '#fecdd3' }, // bubblegum
        { hue: 310, fill: '#e879f9', stroke: '#f5d0fe' }, // grape candy
        { hue: 200, fill: '#38bdf8', stroke: '#bae6fd' }, // blue raspberry
        { hue: 50,  fill: '#facc15', stroke: '#fef08a' }  // lemon drop
      ];
      const item = palette[index % palette.length];
      return {
        fill: item.fill,
        stroke: item.stroke,
        glow: `${item.fill}88`,
        highlight: 'rgba(255, 255, 255, 0.55)',
        hue: item.hue,
        isDark: false
      };
    }
  }
};

export const BACKGROUND_THEMES = {
  midnight_sky: {
    id: 'midnight_sky',
    name: 'Midnight Sky',
    tagline: 'Starry slate to deep ocean abyss',
    cost: 0,
    previewGradient: 'from-slate-900 via-sky-950 to-slate-950',
    getGradient: (cameraY, ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      const depth = Math.floor(cameraY / 400);

      if (depth <= 1) {
        gradient.addColorStop(0, '#090d16');
        gradient.addColorStop(1, '#0f172a');
      } else if (depth <= 3) {
        gradient.addColorStop(0, '#110d24');
        gradient.addColorStop(1, '#09152b');
      } else if (depth <= 6) {
        gradient.addColorStop(0, '#1c0e2d');
        gradient.addColorStop(1, '#0b1633');
      } else {
        gradient.addColorStop(0, '#2d0e2e');
        gradient.addColorStop(1, '#070b19');
      }
      return gradient;
    }
  },

  cyber_twilight: {
    id: 'cyber_twilight',
    name: 'Cyber Twilight',
    tagline: 'Synthwave purple-violet nebula',
    cost: 50,
    previewGradient: 'from-purple-950 via-indigo-950 to-slate-950',
    getGradient: (cameraY, ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      const depth = Math.floor(cameraY / 400);

      if (depth <= 1) {
        gradient.addColorStop(0, '#2e1065');
        gradient.addColorStop(1, '#0f172a');
      } else if (depth <= 4) {
        gradient.addColorStop(0, '#4c1d95');
        gradient.addColorStop(1, '#1e1b4b');
      } else {
        gradient.addColorStop(0, '#581c87');
        gradient.addColorStop(1, '#09090b');
      }
      return gradient;
    }
  },

  sunset_glow: {
    id: 'sunset_glow',
    name: 'Sunset Glow',
    tagline: 'Warm evening dusk transition',
    cost: 100,
    previewGradient: 'from-amber-950 via-rose-950 to-slate-950',
    getGradient: (cameraY, ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      const depth = Math.floor(cameraY / 400);

      if (depth <= 1) {
        gradient.addColorStop(0, '#451a03');
        gradient.addColorStop(1, '#1c1917');
      } else if (depth <= 4) {
        gradient.addColorStop(0, '#881337');
        gradient.addColorStop(1, '#292524');
      } else {
        gradient.addColorStop(0, '#3b0764');
        gradient.addColorStop(1, '#0c0a09');
      }
      return gradient;
    }
  },

  aurora_borealis: {
    id: 'aurora_borealis',
    name: 'Aurora Borealis',
    tagline: 'Nordic emerald & teal ribbons',
    cost: 150,
    previewGradient: 'from-teal-950 via-emerald-950 to-slate-950',
    getGradient: (cameraY, ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      const depth = Math.floor(cameraY / 400);

      if (depth <= 1) {
        gradient.addColorStop(0, '#042f2e');
        gradient.addColorStop(1, '#0f172a');
      } else if (depth <= 4) {
        gradient.addColorStop(0, '#064e3b');
        gradient.addColorStop(1, '#022c22');
      } else {
        gradient.addColorStop(0, '#065f46');
        gradient.addColorStop(1, '#020617');
      }
      return gradient;
    }
  },

  deep_space: {
    id: 'deep_space',
    name: 'Deep Space',
    tagline: 'Cosmic obsidian void with distant nebulae',
    cost: 250,
    previewGradient: 'from-black via-zinc-950 to-slate-950',
    getGradient: (cameraY, ctx, width, height) => {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      const depth = Math.floor(cameraY / 400);

      if (depth <= 2) {
        gradient.addColorStop(0, '#030712');
        gradient.addColorStop(1, '#020617');
      } else {
        gradient.addColorStop(0, '#0f051d');
        gradient.addColorStop(1, '#000000');
      }
      return gradient;
    }
  }
};

export const getThemeBlockColor = (themeId = 'prism_neon', index = 0) => {
  const theme = BLOCK_MATERIALS[themeId] || BLOCK_MATERIALS.prism_neon;
  return theme.getColor(index);
};

export const getThemeBackground = (bgId = 'midnight_sky', cameraY, ctx, width, height) => {
  const bg = BACKGROUND_THEMES[bgId] || BACKGROUND_THEMES.midnight_sky;
  return bg.getGradient(cameraY, ctx, width, height);
};
