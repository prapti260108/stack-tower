import React from 'react';
import { Pause, Flame, Sparkles, Music, VolumeX, Trophy } from 'lucide-react';
import { audioService } from '../../services/audioService';

export default function GameHUD({
  score,
  bestScore = 0,
  comboStreak,
  onPause,
  isReady,
  placementFeedback,
  musicEnabled = true,
  onToggleMusic
}) {
  const handlePause = (e) => {
    e.stopPropagation();
    audioService.playClick();
    if (onPause) onPause();
  };

  const handleMusicClick = (e) => {
    e.stopPropagation();
    audioService.playClick();
    if (onToggleMusic) onToggleMusic();
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between z-20 overflow-hidden">
      {/* Top HUD Bar - Centered Responsive Max-Width Container */}
      <div className="w-full max-w-lg mx-auto px-5 pt-8 sm:pt-6 flex items-start justify-between">
        {/* Left: Best Score Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-amber-400/25 shadow-lg shadow-amber-500/5">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-bold text-amber-400/80 uppercase tracking-wider leading-none">Best</span>
            <span className="font-display font-black text-xs text-white leading-tight">{bestScore}</span>
          </div>
        </div>

        {/* Center: Big Centered Score & Dynamic Combo Badges */}
        <div className="flex flex-col items-center pointer-events-none -mt-1">
          <span
            className="font-display font-black text-white tracking-tight leading-none drop-shadow-2xl"
            style={{ fontSize: 'clamp(3.5rem, 12vw, 5.5rem)' }}
          >
            {score}
          </span>

          {/* Combo Indicator Badge */}
          {comboStreak >= 2 && (
            <div className="flex items-center gap-1.5 mt-1 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/40 via-orange-500/40 to-amber-500/40 border border-amber-400/50 backdrop-blur-md shadow-lg shadow-amber-500/20 animate-bounce">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="font-display font-black text-xs text-amber-200 tracking-wider">
                COMBO x{comboStreak}
              </span>
            </div>
          )}

          {/* Placement Feedback Flash */}
          {placementFeedback && (
            <div className="flex items-center gap-1 mt-1 text-xs font-black tracking-widest uppercase animate-pulse">
              {placementFeedback === 'PERFECT' && (
                <span className="px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-md flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> PERFECT!
                </span>
              )}
              {placementFeedback === 'NEAR_PERFECT' && (
                <span className="px-3 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 shadow-md">
                  GREAT!
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right: Glass Action Controls (Music + Pause) */}
        <div className="flex items-center gap-2">
          {onToggleMusic && (
            <button
              onClick={handleMusicClick}
              className={`pointer-events-auto w-11 h-11 rounded-2xl flex items-center justify-center backdrop-blur-md border shadow-lg active:scale-90 transition-all ${
                musicEnabled
                  ? 'bg-slate-900/80 border-cyan-500/40 text-cyan-400 shadow-cyan-500/15'
                  : 'bg-slate-900/80 border-slate-700/80 text-slate-500'
              }`}
              aria-label="Toggle Music"
              title={musicEnabled ? 'Music: ON' : 'Music: OFF'}
            >
              {musicEnabled ? <Music className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={handlePause}
            className="pointer-events-auto w-11 h-11 rounded-2xl flex items-center justify-center bg-slate-900/80 hover:bg-slate-850 backdrop-blur-md border border-white/20 text-white shadow-lg active:scale-90 transition-all"
            aria-label="Pause Game"
            title="Pause Game"
          >
            <Pause className="w-4 h-4 fill-white" />
          </button>
        </div>
      </div>

      {/* Bottom Interactive Tap Hint for First-Time / Ready State */}
      {isReady && (
        <div className="self-center mb-10 px-5 py-2.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-400/30 text-white font-medium text-xs sm:text-sm flex items-center gap-2 animate-pulse shadow-lg">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>Tap anywhere or press Space to drop</span>
        </div>
      )}
    </div>
  );
}
