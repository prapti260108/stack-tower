import React, { useEffect, useState } from 'react';
import { Layers } from 'lucide-react';
import { audioService } from '../services/audioService';

export default function SplashScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (onFinish) onFinish();
          }, 300);
          return 100;
        }
        return prev + 15;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [onFinish]);

  const handleWarmup = () => {
    audioService.init();
  };

  return (
    <div
      onClick={handleWarmup}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 px-6 select-none"
    >
      <div className="flex flex-col items-center max-w-xs w-full text-center">
        {/* Animated Stack Logo */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 via-sky-400 to-amber-400 p-0.5 shadow-2xl shadow-cyan-500/30 animate-pulse-subtle">
            <div className="w-full h-full bg-slate-900 rounded-[22px] flex items-center justify-center">
              <Layers className="w-12 h-12 text-cyan-400 animate-float" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-display font-black text-4xl tracking-tight text-white mb-1">
          STACK <span className="text-cyan-400">TOWER</span>
        </h1>
        <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-8">
          One-Tap Arcade Stacking
        </p>

        {/* Loading Progress Bar */}
        <div className="w-full h-2 rounded-full bg-slate-800/80 overflow-hidden p-0.5 border border-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-amber-400 transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <span className="text-[11px] text-slate-500 mt-3 font-medium">
          Loading assets & sound engine...
        </span>
      </div>
    </div>
  );
}
