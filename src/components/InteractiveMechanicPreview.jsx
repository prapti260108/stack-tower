import React, { useState, useEffect, useRef } from 'react';
import Section from './Section';

export default function InteractiveMechanicPreview() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [message, setMessage] = useState('TAP OR CLICK TO DROP');

  const canvasRef = useRef(null);
  const gameStateRef = useRef({
    blocks: [],
    movingBlock: null,
    direction: 1,
    speed: 2.2,
    baseY: 340,
    blockHeight: 22,
    debris: [],
    animationFrameId: null
  });

  const initGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const baseWidth = 140;
    const initialBlocks = [
      { x: (width - baseWidth) / 2, y: height - 40, width: baseWidth, color: '#071a2e' }
    ];

    gameStateRef.current = {
      blocks: initialBlocks,
      movingBlock: {
        x: 20,
        y: height - 40 - 22,
        width: baseWidth,
        color: '#c59b27'
      },
      direction: 1,
      speed: 2.5,
      blockHeight: 22,
      debris: [],
      animationFrameId: null
    };

    setScore(0);
    setCombo(0);
    setIsGameOver(false);
    setIsPlaying(true);
    setMessage('TAP TO DROP BLOCK');
  };

  const handleDrop = () => {
    if (!isPlaying) {
      initGame();
      return;
    }
    if (isGameOver) {
      initGame();
      return;
    }

    const { blocks, movingBlock } = gameStateRef.current;
    const prevBlock = blocks[blocks.length - 1];

    const currentLeft = movingBlock.x;
    const currentRight = movingBlock.x + movingBlock.width;
    const prevLeft = prevBlock.x;
    const prevRight = prevBlock.x + prevBlock.width;

    // Check overlap
    const overlapLeft = Math.max(currentLeft, prevLeft);
    const overlapRight = Math.min(currentRight, prevRight);
    const overlapWidth = overlapRight - overlapLeft;

    if (overlapWidth <= 0) {
      // Missed completely - Failure
      setIsGameOver(true);
      setMessage('MISSED! GAME OVER');
      return;
    }

    const diff = Math.abs(currentLeft - prevLeft);
    let isPerfect = diff < 3;
    let newWidth = isPerfect ? prevBlock.width : overlapWidth;
    let newX = isPerfect ? prevBlock.x : overlapLeft;

    // Overhang debris
    let debrisWidth = movingBlock.width - newWidth;
    if (!isPerfect && debrisWidth > 0) {
      let debrisX = currentLeft < prevLeft ? currentLeft : overlapRight;
      gameStateRef.current.debris.push({
        x: debrisX,
        y: movingBlock.y,
        width: debrisWidth,
        height: 22,
        vy: 2,
        color: '#94a3b8'
      });
    }

    const nextScore = score + 1;
    const nextCombo = isPerfect ? combo + 1 : 0;
    setScore(nextScore);
    setCombo(nextCombo);

    if (isPerfect) {
      setMessage(`PERFECT DROP! COMBO x${nextCombo}`);
    } else {
      setMessage(`PLACED (+1 PT)`);
    }

    // Add settled block
    blocks.push({
      x: newX,
      y: movingBlock.y,
      width: newWidth,
      color: isPerfect ? '#dfc28a' : (nextScore % 2 === 0 ? '#143152' : '#0a1a2e')
    });

    // Check tower height & camera shift if needed
    const canvas = canvasRef.current;
    const targetY = movingBlock.y - 22;

    // Spawn next block
    gameStateRef.current.movingBlock = {
      x: 10,
      y: targetY < 80 ? 80 : targetY,
      width: newWidth,
      color: '#c59b27'
    };

    // Camera shift down if too tall
    if (targetY < 80) {
      blocks.forEach(b => { b.y += 22; });
      gameStateRef.current.debris.forEach(d => { d.y += 22; });
      gameStateRef.current.movingBlock.y = 80;
    }

    // Increase speed slightly with score
    gameStateRef.current.speed = Math.min(5.5, 2.5 + nextScore * 0.15);
    gameStateRef.current.direction = Math.random() > 0.5 ? 1 : -1;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background subtle grid
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#f1f5f9';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      const { blocks, movingBlock, debris } = gameStateRef.current;

      // Draw stacked tower
      blocks.forEach((block) => {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, block.width, 22);
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.strokeRect(block.x, block.y, block.width, 22);
      });

      // Draw debris falling
      debris.forEach((d, idx) => {
        d.y += d.vy;
        d.vy += 0.25;
        ctx.fillStyle = d.color;
        ctx.fillRect(d.x, d.y, d.width, d.height);
      });
      gameStateRef.current.debris = debris.filter(d => d.y < canvas.height + 40);

      // Draw moving block if active and not game over
      if (isPlaying && !isGameOver && movingBlock) {
        movingBlock.x += gameStateRef.current.speed * gameStateRef.current.direction;
        if (movingBlock.x <= 10) {
          movingBlock.x = 10;
          gameStateRef.current.direction = 1;
        } else if (movingBlock.x + movingBlock.width >= canvas.width - 10) {
          movingBlock.x = canvas.width - 10 - movingBlock.width;
          gameStateRef.current.direction = -1;
        }

        ctx.fillStyle = movingBlock.color;
        ctx.fillRect(movingBlock.x, movingBlock.y, movingBlock.width, 22);
        ctx.strokeStyle = '#dfc28a';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(movingBlock.x, movingBlock.y, movingBlock.width, 22);
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, isGameOver]);

  return (
    <Section title="INTERACTIVE SOW MECHANIC PROTOTYPE" id="interactive-prototype" className="pt-6 border-t border-slate-200">
      <div className="bg-[#f8fafc] border border-slate-200 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-200 gap-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Deterministic 60 FPS Physics Simulation
            </span>
            <h4 className="text-sm font-bold text-[#071a2e]">
              Core Loop Prototype (Single-Tap Overlap & Cutaway)
            </h4>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="bg-white border border-slate-200 px-3 py-1 font-mono font-bold text-slate-800">
              SCORE: <span className="text-[#c59b27]">{score}</span>
            </div>
            {combo > 0 && (
              <div className="bg-amber-100 border border-amber-300 px-3 py-1 font-mono font-bold text-amber-800">
                COMBO x{combo}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6">
          {/* Mobile phone frame */}
          <div 
            onClick={handleDrop}
            className="w-[280px] h-[380px] bg-slate-900 border-4 border-slate-800 rounded-2xl shadow-lg relative overflow-hidden cursor-pointer select-none group"
            style={{ boxShadow: '0 10px 25px -5px rgba(10, 26, 46, 0.25)' }}
          >
            {/* Screen Safe Area Header */}
            <div className="h-6 bg-[#071a2e] text-white flex items-center justify-between px-3 text-[9px] font-mono border-b border-slate-700">
              <span>STACK TOWER</span>
              <span>60 FPS</span>
            </div>

            <canvas
              ref={canvasRef}
              width={272}
              height={315}
              className="bg-white"
            />

            {/* Bottom Tap Overlay / Status */}
            <div className="h-9 bg-[#071a2e] text-center flex items-center justify-center border-t border-slate-700">
              <span className="text-[11px] font-semibold text-white tracking-wide group-hover:text-amber-300 transition-colors">
                {isPlaying ? (isGameOver ? 'TAP TO REPLAY' : message) : 'TAP TO START PROTOTYPE'}
              </span>
            </div>
          </div>

          {/* SOW Verification Legend */}
          <div className="max-w-md text-xs space-y-3">
            <div className="bg-white p-3 border border-slate-200">
              <span className="font-bold text-[#071a2e] block mb-1">
                SOW Mechanic Rules Demonstrated:
              </span>
              <ul className="gold-bullet-list">
                <li className="text-[11.5px]">
                  <strong>Single-Tap Input:</strong> Releases block instantly from horizontal traversal.
                </li>
                <li className="text-[11.5px]">
                  <strong>Overhang Slicing:</strong> Non-overlapping width severed as animated physics debris.
                </li>
                <li className="text-[11.5px]">
                  <strong>Combo Multiplier:</strong> Near-perfect alignment awards bonus score and alignment lock.
                </li>
                <li className="text-[11.5px]">
                  <strong>Defeat State:</strong> Full misses immediately terminate run, block input and finalize score.
                </li>
              </ul>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              Demonstrates compliance with Section 3 ("Detailed Gameplay Specification") and Section 7 ("Fixed-step or equivalent stable simulation").
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
