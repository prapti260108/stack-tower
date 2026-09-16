import React from 'react';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import InteractiveTutorialPreview from '../components/game/InteractiveTutorialPreview';
import { Play, CheckCircle2 } from 'lucide-react';

export default function HowToPlayModal({ isOpen, onClose, onStartGame }) {
  const handleProceed = () => {
    onClose();
    if (onStartGame) onStartGame();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How To Play" maxWidth="max-w-md">
      {/* Animated Visual Hint */}
      <InteractiveTutorialPreview />

      {/* Rules list */}
      <div className="space-y-2.5 py-1">
        <div className="flex items-start gap-2.5 text-sm text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span><strong>Block moves left & right</strong> automatically above the tower.</span>
        </div>
        <div className="flex items-start gap-2.5 text-sm text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span><strong>Tap screen or press Space</strong> to drop the block onto the platform.</span>
        </div>
        <div className="flex items-start gap-2.5 text-sm text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span><strong>Overhanging parts get sliced off</strong>. Perfect alignment preserves width and builds combos!</span>
        </div>
        <div className="flex items-start gap-2.5 text-sm text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span><strong>Avoid missing completely</strong> — a full miss ends the run!</span>
        </div>
      </div>

      <Button
        variant="primary"
        onClick={handleProceed}
        className="w-full mt-3 py-3 font-bold"
        icon={Play}
      >
        LET'S STACK
      </Button>
    </Modal>
  );
}
