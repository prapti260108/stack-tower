import React from 'react';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { RotateCcw, Home, Trophy, Flame, Star, Palette } from 'lucide-react';

export default function GameOverModal({
  isOpen,
  score,
  bestScore,
  isNewBest,
  highestCombo,
  totalPlacements,
  starsEarned = 0,
  onReplay,
  onHome,
  onOpenLeaderboard,
  onOpenCosmetics
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onReplay}
      showCloseButton={false}
      maxWidth="max-w-xs"
    >
      <div className="flex flex-col items-center text-center pt-1 pb-2">
        {/* New Record Banner or Game Over */}
        {isNewBest ? (
          <div className="mb-3 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs uppercase tracking-widest shadow-lg shadow-amber-500/30 animate-bounce">
            ★ NEW HIGH SCORE! ★
          </div>
        ) : (
          <div className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
            RUN COMPLETE
          </div>
        )}

        <h2 className="font-display font-black text-3xl text-white mb-3">
          {isNewBest ? 'Tower Champion!' : 'Game Over'}
        </h2>

        {/* Big Score Box */}
        <div className="w-full py-4 rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] border border-white/10 mb-3 shadow-inner">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
            Final Score
          </div>
          <div className="font-display font-black text-6xl text-white tracking-tight">
            {score}
          </div>
          {starsEarned > 0 && (
            <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-bold text-xs">
              <Star className="w-3.5 h-3.5 fill-amber-300" />
              <span>+{starsEarned} Stars Earned</span>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="w-full grid grid-cols-2 gap-2 mb-3 text-left">
          {/* Best Score */}
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-400 font-bold mb-0.5">
              <Trophy className="w-3.5 h-3.5" /> Best
            </div>
            <div className="font-display font-black text-xl text-white">
              {bestScore}
            </div>
          </div>

          {/* Highest Combo */}
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <div className="flex items-center gap-1.5 text-[11px] text-cyan-400 font-bold mb-0.5">
              <Flame className="w-3.5 h-3.5" /> Max Combo
            </div>
            <div className="font-display font-black text-xl text-white">
              {highestCombo || 0}
            </div>
          </div>
        </div>

        {/* Quick Links: Leaderboard & Themes */}
        <div className="w-full grid grid-cols-2 gap-2 mb-4">
          {onOpenLeaderboard && (
            <button
              onClick={onOpenLeaderboard}
              className="py-2 px-3 rounded-xl bg-slate-800/70 hover:bg-slate-750 border border-slate-750 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Rankings</span>
            </button>
          )}

          {onOpenCosmetics && (
            <button
              onClick={onOpenCosmetics}
              className="py-2 px-3 rounded-xl bg-slate-800/70 hover:bg-slate-750 border border-slate-750 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span>Themes</span>
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2">
          <Button
            variant="primary"
            size="lg"
            onClick={onReplay}
            className="w-full py-3.5 text-base font-black shadow-cyan-500/25"
            icon={RotateCcw}
          >
            PLAY AGAIN
          </Button>

          <Button
            variant="glass"
            onClick={onHome}
            className="w-full py-2.5 text-xs"
            icon={Home}
          >
            MAIN MENU
          </Button>
        </div>
      </div>
    </Modal>
  );
}
