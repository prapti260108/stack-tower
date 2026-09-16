import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { audioService } from '../../services/audioService';

export default function Modal({ isOpen, onClose, title, children, showCloseButton = true, maxWidth = 'max-w-sm' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className={`relative w-full ${maxWidth} glass-panel rounded-3xl p-6 shadow-2xl border border-white/15 overflow-hidden animate-scale-up`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          {title && (
            <h3 className="font-display font-black text-xl tracking-tight text-white">
              {title}
            </h3>
          )}
          {showCloseButton && onClose && (
            <button
              onClick={() => {
                audioService.playClick();
                onClose();
              }}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
