import React from 'react';

export default function Header({ eyebrow, title }) {
  return (
    <header className="w-full bg-[#071a2e] text-white border-b border-[#0f2847] shadow-sm">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-12 py-5 sm:py-6">
        <div className="flex flex-col items-start justify-center">
          <span 
            className="text-[11px] sm:text-[11.5px] font-bold tracking-[0.14em] uppercase text-[#dfc28a] mb-1.5 select-none"
            style={{ letterSpacing: '0.14em' }}
          >
            {eyebrow || "ROLE 02 · ENGINEERING & PRODUCT"}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-[32px] font-bold text-white tracking-tight leading-none">
            {title || "AI Full-Stack Developer"}
          </h1>
        </div>
      </div>
    </header>
  );
}
