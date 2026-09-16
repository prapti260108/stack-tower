import React from 'react';
import { audioService } from '../../services/audioService';

export default function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  size = 'md',
  icon: Icon,
  disabled = false,
  ...props
}) {
  const handleClick = (e) => {
    if (disabled) return;
    audioService.playClick();
    if (onClick) onClick(e);
  };

  const baseStyles = 'inline-flex items-center justify-center font-display font-bold tracking-wide rounded-2xl transition-all duration-150 active:scale-[0.97] select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 focus:ring-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3.5 text-base gap-2',
    lg: 'px-8 py-4.5 text-lg gap-2.5',
    icon: 'p-3 text-lg'
  };

  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:brightness-105 border border-cyan-300/30',
    gold: 'bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/45 hover:brightness-105 border border-amber-200/40',
    glass: 'bg-white/10 hover:bg-white/20 active:bg-white/15 text-white border border-white/15 backdrop-blur-md shadow-md',
    danger: 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 shadow-md',
    ghost: 'text-slate-400 hover:text-white hover:bg-white/5'
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 shrink-0" />}
      {children}
    </button>
  );
}
