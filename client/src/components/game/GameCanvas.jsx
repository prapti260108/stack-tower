import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { GameEngine } from '../../game/GameEngine';

const GameCanvas = forwardRef(({ onScoreUpdate, onStateChange, onGameOver, settings }, ref) => {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  useImperativeHandle(ref, () => ({
    startGame: () => engineRef.current?.startGame(),
    resetGame: () => engineRef.current?.resetGame(),
    pauseGame: () => engineRef.current?.pauseGame(),
    resumeGame: () => engineRef.current?.resumeGame(),
    triggerDrop: () => engineRef.current?.triggerDropAction(),
    setTheme: (materialId, bgId) => engineRef.current?.setTheme(materialId, bgId),
    updateSettings: (newSettings) => engineRef.current?.updateSettings(newSettings)
  }));

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new GameEngine(canvasRef.current, {
      onScoreUpdate,
      onStateChange,
      onGameOver
    });

    if (settings) {
      engine.updateSettings(settings);
    }

    engineRef.current = engine;

    return () => {
      engine.destroy();
    };
  }, []);

  useEffect(() => {
    if (engineRef.current && settings) {
      engineRef.current.updateSettings(settings);
    }
  }, [settings]);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden touch-none select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-pointer"
        style={{ touchAction: 'none' }}
      />
    </div>
  );
});

export default GameCanvas;
