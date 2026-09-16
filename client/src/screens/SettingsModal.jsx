import React, { useState } from 'react';
import Modal from '../components/common/Modal';
import Toggle from '../components/common/Toggle';
import Button from '../components/common/Button';
import { Music, Volume2, Smartphone, Eye, BookOpen, Database, RefreshCw, CheckCircle2, AlertCircle, Trash2, Info } from 'lucide-react';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onReplayTutorial,
  mongoStatus,
  onRefreshMongoStatus,
  onResetData
}) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleToggle = (key, value) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Settings" maxWidth="max-w-md">
      <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1 custom-scrollbar">
        {/* Audio Toggles */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Audio & Vibration
          </div>
          <Toggle
            label="Music"
            description="Procedural synth background soundtrack"
            checked={settings.music}
            onChange={(val) => handleToggle('music', val)}
            icon={Music}
          />

          <Toggle
            label="Sound Effects"
            description="Drop, landing, cut & combo chime audio"
            checked={settings.sfx}
            onChange={(val) => handleToggle('sfx', val)}
            icon={Volume2}
          />

          <Toggle
            label="Haptic Feedback"
            description="Tactile vibration on landing (mobile)"
            checked={settings.haptics}
            onChange={(val) => handleToggle('haptics', val)}
            icon={Smartphone}
          />
        </div>

        {/* Accessibility */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
            Accessibility
          </div>
          <Toggle
            label="Reduced Motion"
            description="Disable camera screen shake & heavy particles"
            checked={settings.reducedMotion}
            onChange={(val) => handleToggle('reducedMotion', val)}
            icon={Eye}
          />
        </div>

        {/* Offline / Online Cloud Sync Section */}
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between mb-2 px-1">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Game Mode & Cloud Sync</span>
            </div>
            <div className="flex items-center gap-1 text-[10px]">
              <div className={`w-2 h-2 rounded-full ${mongoStatus?.connected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className={mongoStatus?.connected ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                {mongoStatus?.connected ? 'ONLINE (Atlas)' : 'OFFLINE (Local)'}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2.5">
            <div className="text-[11px] text-slate-300 space-y-1.5 leading-relaxed">
              <p>
                • <strong>Offline Mode (Device Save):</strong> Internet ya server ke bina bhi game 100% chalega. Aapke high scores, stars, aur unlocked themes device me safe rehte hain.
              </p>
              <p>
                • <strong>Online Mode (Cloud Sync):</strong> Backend server aur MongoDB Atlas connect hone par aapka best score aur runs automatic cloud me sync ho jate hain.
              </p>
            </div>

            <div className={`flex items-start gap-1.5 text-[11px] p-2.5 rounded-xl border ${
              mongoStatus?.connected
                ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-950/40 border-amber-500/30 text-amber-200'
            }`}>
              {mongoStatus?.connected ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
              <span>
                {mongoStatus?.connected
                  ? `MongoDB Atlas se connected hai${mongoStatus.host ? ` (${mongoStatus.host})` : ''}. Global leaderboard live hai!`
                  : mongoStatus?.browserOnline === false
                    ? 'Aap offline hain. Saare scores device par save ho rahe hain.'
                    : mongoStatus?.apiAvailable
                      ? 'Local API server active hai. Scores device par safe hain.'
                      : 'Running in Offline Mode. Scores & themes safely saved on this device.'}
              </span>
            </div>

            <Button
              variant="glass"
              size="sm"
              onClick={onRefreshMongoStatus}
              disabled={mongoStatus?.checking}
              className="w-full py-2 text-xs font-bold justify-center"
            >
              <span className="flex items-center gap-2">
                <RefreshCw className={`w-3.5 h-3.5 ${mongoStatus?.checking ? 'animate-spin text-cyan-400' : ''}`} />
                {mongoStatus?.checking ? 'Checking cloud status...' : 'Check Cloud Sync / Refresh'}
              </span>
            </Button>
          </div>
        </div>

        {/* Tutorial & Reset */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <Button
            variant="glass"
            onClick={() => {
              onClose();
              if (onReplayTutorial) onReplayTutorial();
            }}
            className="w-full py-2.5 text-xs justify-start text-slate-300 hover:text-white"
            icon={BookOpen}
          >
            Replay How-To-Play Guide
          </Button>

          {showResetConfirm ? (
            <div className="p-3 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2">
              <p className="text-[11px] text-rose-300 font-semibold">
                Are you sure you want to reset all local scores, unlocks, and settings?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    if (onResetData) onResetData();
                    setShowResetConfirm(false);
                    onClose();
                  }}
                  className="flex-1 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                >
                  Yes, Reset
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full py-2 text-xs text-rose-400 hover:text-rose-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Game Save Data</span>
            </button>
          )}
        </div>

        {/* About Section */}
        <div className="pt-2 border-t border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-semibold mb-0.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" /> Stack Tower v1.0.0
          </div>
          <p className="text-[10px] text-slate-500">
            Engineered with React, HTML5 Canvas 60 FPS, Node.js REST API & MongoDB Atlas.
          </p>
        </div>
      </div>
    </Modal>
  );
}
