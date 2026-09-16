import React from 'react';
import { Play, Trophy, HelpCircle, Settings, Layers, Flame, Star, Palette, Database, Music, VolumeX } from 'lucide-react';
import Button from '../components/common/Button';

export default function HomeScreen({
  onPlay,
  onOpenHowToPlay,
  onOpenSettings,
  onOpenCosmetics,
  onOpenLeaderboard,
  stats = { bestScore: 0, totalGames: 0, highestCombo: 0 },
  stars = 0,
  mongoStatus,
  musicEnabled = true,
  onToggleMusic
}) {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-6 pt-10 sm:pt-6 z-20 pointer-events-auto">
      {/* Top Bar: Settings, Help, Music, Stars Currency & Status Indicator */}
      <div className="w-full max-w-lg flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="glass"
            size="icon"
            onClick={onOpenHowToPlay}
            aria-label="How to play"
            className="w-9 h-9 sm:w-10 sm:h-10"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
          </Button>

          <Button
            variant="glass"
            size="icon"
            onClick={onOpenSettings}
            aria-label="Settings"
            className="w-9 h-9 sm:w-10 sm:h-10"
          >
            <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
          </Button>

          {onToggleMusic && (
            <Button
              variant="glass"
              size="icon"
              onClick={onToggleMusic}
              aria-label="Toggle Music"
              className={`w-9 h-9 sm:w-10 sm:h-10 transition-colors ${
                musicEnabled ? 'text-cyan-400 border-cyan-500/30' : 'text-slate-500'
              }`}
              title={musicEnabled ? 'Music: ON' : 'Music: OFF'}
            >
              {musicEnabled ? <Music className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Stars Currency Pill */}
          <button
            onClick={onOpenCosmetics}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-amber-400/10 border border-amber-400/25 text-amber-400 hover:bg-amber-400/20 transition-all font-bold text-xs shadow-sm"
          >
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{stars}</span>
          </button>

          {/* Online / Offline Status Badge */}
          <button
            onClick={onOpenSettings}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-2xl border transition-all text-[11px] font-bold shadow-sm whitespace-nowrap ${
              mongoStatus?.connected
                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/50'
                : 'bg-amber-950/50 border-amber-500/40 text-amber-300 hover:bg-amber-900/50'
            }`}
            title={mongoStatus?.connected ? 'Online: Synced to MongoDB Atlas' : 'Offline Mode: Device Save Active'}
          >
            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${mongoStatus?.connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{mongoStatus?.connected ? 'Online' : 'Offline'}</span>
          </button>
        </div>
      </div>

      {/* Hero Title & Logo */}
      <div className="flex flex-col items-center text-center my-auto">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-amber-400 p-0.5 shadow-2xl shadow-cyan-500/30 mb-4 animate-float">
          <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center">
            <Layers className="w-10 h-10 text-cyan-400" />
          </div>
        </div>

        <h1
          className="font-display font-black tracking-tight leading-none whitespace-nowrap text-white mb-2"
          style={{ fontSize: 'clamp(2.25rem, 10vw, 3.75rem)' }}
        >
          STACK <span className="text-cyan-400">TOWER</span>
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm font-medium tracking-wide max-w-xs">
          Drop moving blocks and build the highest stable tower.
        </p>

        {/* Best Score Trophy Card */}
        <div className="mt-7 px-6 py-3.5 rounded-2xl glass-panel flex items-center gap-3 border border-amber-400/20 shadow-lg shadow-amber-500/5">
          <div className="p-2 rounded-xl bg-amber-400/15 text-amber-400">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="text-left">
            <div className="text-[11px] font-bold tracking-wider text-amber-400/80 uppercase">
              Best Score
            </div>
            <div className="font-display font-black text-2xl text-white">
              {stats.bestScore || 0}
            </div>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-4 mt-4 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{stats.totalGames || 0} Runs</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-700" />
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Streak {stats.highestCombo || 0}</span>
          </div>
        </div>
      </div>

      {/* Bottom Actions: Leaderboard & Themes + PLAY Button */}
      <div className="w-full max-w-xs space-y-3 pb-4">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onOpenLeaderboard}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 text-white font-bold text-xs transition-all shadow-md active:scale-98"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Leaderboard</span>
          </button>

          <button
            onClick={onOpenCosmetics}
            className="flex items-center justify-center gap-2 py-3 px-3 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 text-white font-bold text-xs transition-all shadow-md active:scale-98"
          >
            <Palette className="w-4 h-4 text-cyan-400" />
            <span>Themes</span>
          </button>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={onPlay}
          className="w-full py-4 text-xl shadow-cyan-500/30 font-black tracking-wider"
          icon={Play}
        >
          PLAY NOW
        </Button>
      </div>
    </div>
  );
}
