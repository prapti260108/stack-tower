import React, { useState } from 'react';
import { X, Check, Star, Lock, Sparkles, Palette, Mountain } from 'lucide-react';
import Button from '../components/common/Button';
import { BLOCK_MATERIALS, BACKGROUND_THEMES } from '../utils/themes';

export default function CosmeticsModal({
  isOpen,
  onClose,
  stars = 0,
  cosmetics,
  onEquipMaterial,
  onEquipBackground,
  onUnlockMaterial,
  onUnlockBackground
}) {
  const [activeTab, setActiveTab] = useState('materials'); // 'materials' | 'backgrounds'

  if (!isOpen) return null;

  const unlockedMaterials = cosmetics.unlockedMaterials || ['prism_neon'];
  const unlockedBackgrounds = cosmetics.unlockedBackgrounds || ['midnight_sky'];
  const selectedMaterial = cosmetics.selectedMaterial || 'prism_neon';
  const selectedBackground = cosmetics.selectedBackground || 'midnight_sky';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900/95 border border-slate-750 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-display font-black text-white">THEME VAULT</h2>
              <p className="text-xs text-slate-400">Customize blocks & atmospheres</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/25 text-amber-400 font-bold text-sm">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{stars}</span>
            </div>

            <Button
              variant="glass"
              size="icon"
              onClick={onClose}
              className="w-9 h-9 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-slate-800/60 rounded-2xl border border-slate-700/50">
          <button
            onClick={() => setActiveTab('materials')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'materials'
                ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Block Materials (6)</span>
          </button>
          <button
            onClick={() => setActiveTab('backgrounds')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'backgrounds'
                ? 'bg-gradient-to-r from-cyan-500 to-sky-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mountain className="w-3.5 h-3.5" />
            <span>Environments (5)</span>
          </button>
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto pr-1 my-4 space-y-3 custom-scrollbar">
          {activeTab === 'materials' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(BLOCK_MATERIALS).map((theme) => {
                const isUnlocked = unlockedMaterials.includes(theme.id);
                const isSelected = selectedMaterial === theme.id;
                const canAfford = stars >= theme.cost;

                return (
                  <div
                    key={theme.id}
                    className={`relative p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/30 border-cyan-400/50 shadow-lg shadow-cyan-500/10'
                        : isUnlocked
                        ? 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                        : 'bg-slate-900/40 border-slate-800/80 opacity-80'
                    }`}
                  >
                    <div>
                      {/* Color Preview Swatches */}
                      <div className="flex items-center gap-1.5 mb-2.5">
                        {theme.previewColors.map((hex, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-lg shadow-sm"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>

                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h3 className="text-sm font-bold text-white">{theme.name}</h3>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{theme.tagline}</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex items-center justify-between">
                      {isSelected ? (
                        <div className="flex items-center gap-1 text-xs font-bold text-cyan-400">
                          <Check className="w-4 h-4" />
                          <span>Equipped</span>
                        </div>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => onEquipMaterial(theme.id)}
                          className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                        >
                          Equip
                        </button>
                      ) : (
                        <button
                          onClick={() => onUnlockMaterial(theme)}
                          disabled={!canAfford}
                          className={`w-full py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                            canAfford
                              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Unlock ({theme.cost} ⭐)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'backgrounds' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.values(BACKGROUND_THEMES).map((bg) => {
                const isUnlocked = unlockedBackgrounds.includes(bg.id);
                const isSelected = selectedBackground === bg.id;
                const canAfford = stars >= bg.cost;

                return (
                  <div
                    key={bg.id}
                    className={`relative p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-cyan-950/30 border-cyan-400/50 shadow-lg shadow-cyan-500/10'
                        : isUnlocked
                        ? 'bg-slate-800/40 border-slate-700/60 hover:border-slate-600'
                        : 'bg-slate-900/40 border-slate-800/80 opacity-80'
                    }`}
                  >
                    <div>
                      {/* Gradient preview swatch */}
                      <div className={`w-full h-10 rounded-xl bg-gradient-to-r ${bg.previewGradient} border border-white/10 mb-2.5 shadow-inner`} />

                      <div>
                        <h3 className="text-sm font-bold text-white">{bg.name}</h3>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{bg.tagline}</p>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800/70 flex items-center justify-between">
                      {isSelected ? (
                        <div className="flex items-center gap-1 text-xs font-bold text-cyan-400">
                          <Check className="w-4 h-4" />
                          <span>Active Environment</span>
                        </div>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => onEquipBackground(bg.id)}
                          className="w-full py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors"
                        >
                          Equip
                        </button>
                      ) : (
                        <button
                          onClick={() => onUnlockBackground(bg)}
                          disabled={!canAfford}
                          className={`w-full py-1.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                            canAfford
                              ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          }`}
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Unlock ({bg.cost} ⭐)</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer tip */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Earn stars by landing blocks and scoring perfect combos!
          </span>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
