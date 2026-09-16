import React from 'react';
import { audioService } from '../../services/audioService';

export default function Toggle({ label, description, checked, onChange, icon: Icon }) {
  const handleToggle = (e) => {
    e.stopPropagation();
    audioService.playClick();
    onChange(!checked);
  };

  return (
    <div
      onClick={handleToggle}
      className={`group flex items-center justify-between p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer select-none active:scale-[0.99] ${
        checked
          ? 'bg-slate-850/80 border-cyan-500/30 hover:border-cyan-400/50 shadow-sm shadow-cyan-500/5'
          : 'bg-slate-900/60 border-slate-800 hover:border-slate-750'
      }`}
    >
      {/* Left side: Icon + Labels */}
      <div className="flex items-center gap-3.5 min-w-0">
        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all duration-200 shrink-0 ${
              checked
                ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                : 'bg-slate-800/60 text-slate-500 border-slate-750'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="min-w-0">
          <div className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
            <span>{label}</span>
          </div>
          {description && (
            <div className="text-xs text-slate-400 mt-0.5 leading-snug">
              {description}
            </div>
          )}
        </div>
      </div>

      {/* Right side: ON/OFF indicator badge + Switch slider */}
      <div className="flex items-center gap-2.5 shrink-0 pl-3">
        {/* Status text pill */}
        <span
          className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border transition-all duration-200 ${
            checked
              ? 'bg-cyan-400/15 text-cyan-300 border-cyan-400/30 font-display'
              : 'bg-slate-800 text-slate-400 border-slate-700/60 font-display'
          }`}
        >
          {checked ? 'ON' : 'OFF'}
        </span>

        {/* The Toggle Switch Button */}
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={handleToggle}
          className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full p-[2.5px] transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
            checked
              ? 'bg-gradient-to-r from-cyan-500 to-sky-400 shadow-md shadow-cyan-500/30 border border-cyan-300/40'
              : 'bg-slate-800 border border-slate-700'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-[22px] w-[22px] transform rounded-full bg-white shadow-md transition-transform duration-200 ease-out ${
              checked ? 'translate-x-[20px]' : 'translate-x-0 bg-slate-300'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
