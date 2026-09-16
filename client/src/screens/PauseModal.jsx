import React, { useState, useEffect } from 'react';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import { Play, RotateCcw, Settings, Home, AlertTriangle } from 'lucide-react';

export default function PauseModal({
  isOpen,
  onResume,
  onRestart,
  onOpenSettings,
  onQuit
}) {
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowQuitConfirm(false);
    }
  }, [isOpen]);

  const handleQuitClick = () => {
    setShowQuitConfirm(true);
  };

  const handleConfirmQuit = () => {
    setShowQuitConfirm(false);
    onQuit();
  };

  const handleCancelQuit = () => {
    setShowQuitConfirm(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onResume} title="Game Paused" maxWidth="max-w-xs">
      {showQuitConfirm ? (
        <div className="flex flex-col gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="text-left">
              <div className="text-xs font-bold text-rose-200">Quit current run?</div>
              <div className="text-[11px] text-rose-300/80 mt-0.5 leading-snug">
                Your current active tower progress will be lost.
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleConfirmQuit}
              className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
            >
              Quit Run
            </button>
            <button
              onClick={handleCancelQuit}
              className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs active:scale-95 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3 pt-2">
          <Button
            variant="primary"
            onClick={onResume}
            className="w-full py-3.5"
            icon={Play}
          >
            RESUME
          </Button>

          <Button
            variant="glass"
            onClick={onRestart}
            className="w-full py-3"
            icon={RotateCcw}
          >
            RESTART
          </Button>

          <Button
            variant="glass"
            onClick={onOpenSettings}
            className="w-full py-3"
            icon={Settings}
          >
            SETTINGS
          </Button>

          <Button
            variant="ghost"
            onClick={handleQuitClick}
            className="w-full py-2.5 text-rose-400 hover:text-rose-300"
            icon={Home}
          >
            QUIT TO MENU
          </Button>
        </div>
      )}
    </Modal>
  );
}
