import React, { useEffect, useRef, useState } from 'react';

export default function InteractiveTutorialPreview() {
  const canvasRef = useRef(null);
  const [step, setStep] = useState(0); // 0: moving, 1: dropped/aligned

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let x = 30;
    let direction = 1;
    const speed = 90;
    let lastTime = performance.now();
    let state = 'moving'; // moving, dropping, resting
    let blockY = 25;
    let timer = 0;

    const targetX = 85;
    const targetY = 100;
    const blockWidth = 90;
    const blockHeight = 26;

    const render = (now) => {
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw base platform
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.roundRect(targetX, targetY, blockWidth, blockHeight, 6);
      ctx.fill();

      // State machine for demo
      if (state === 'moving') {
        x += direction * speed * dt;
        if (x > 140) direction = -1;
        if (x < 30) direction = 1;

        // Auto drop when close to center for tutorial visualization
        if (Math.abs(x - targetX) < 4) {
          state = 'dropping';
        }
      } else if (state === 'dropping') {
        blockY += 280 * dt;
        if (blockY >= targetY - blockHeight) {
          blockY = targetY - blockHeight;
          state = 'resting';
          timer = 0;
        }
      } else if (state === 'resting') {
        timer += dt;
        if (timer > 1.2) {
          state = 'moving';
          blockY = 25;
          x = 30;
          direction = 1;
        }
      }

      // Draw active block
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = 'rgba(56, 189, 248, 0.4)';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(x, blockY, blockWidth, blockHeight, 6);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw tap indicator
      if (state === 'dropping' || (state === 'moving' && Math.abs(x - targetX) < 15)) {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(x + blockWidth / 2, blockY - 12, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div className="w-full flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/60 border border-white/10">
      <canvas
        ref={canvasRef}
        width={260}
        height={140}
        className="rounded-xl"
      />
      <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        Tap when the moving block aligns with the tower!
      </div>
    </div>
  );
}
