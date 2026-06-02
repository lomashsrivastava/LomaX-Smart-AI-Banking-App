'use client';
import { useState, useRef } from 'react';

interface MagicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export default function MagicButton({ children, onClick, variant = 'primary', size = 'md', icon, disabled = false, loading = false, className = '' }: MagicButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);

  const colors = {
    primary: { bg: 'rgba(0,229,255,0.15)', border: 'rgba(0,229,255,0.4)', glow: '0 0 16px rgba(0,229,255,0.4)', text: '#00e5ff' },
    secondary: { bg: 'rgba(185,0,255,0.15)', border: 'rgba(185,0,255,0.4)', glow: '0 0 16px rgba(185,0,255,0.4)', text: '#b900ff' },
    danger: { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.4)', glow: '0 0 16px rgba(239,68,68,0.4)', text: '#ef4444' },
    ghost: { bg: 'transparent', border: 'rgba(255,255,255,0.1)', glow: 'none', text: '#9ca3af' },
  };

  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-base' };
  const c = colors[variant];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    const rect = btnRef.current?.getBoundingClientRect();
    if (rect) {
      const id = Date.now();
      setRipples(prev => [...prev, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 600);
    }
    onClick?.();
  };

  return (
    <button
      ref={btnRef}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`relative overflow-hidden rounded-xl font-medium tracking-wide transition-all duration-300 cursor-pointer
        ${sizes[size]} ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.03] active:scale-[0.97]'} ${className}`}
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.text,
        boxShadow: disabled ? 'none' : c.glow,
        backdropFilter: 'blur(8px)',
      }}
    >
      {ripples.map(r => (
        <span key={r.id} className="absolute rounded-full animate-[particle-burst_0.6s_ease-out_forwards] pointer-events-none"
          style={{ left: r.x - 10, top: r.y - 10, width: 20, height: 20, background: `radial-gradient(circle, ${c.text}40, transparent)` }} />
      ))}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? (
          <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: `${c.text}40`, borderTopColor: c.text }} />
        ) : icon}
        {children}
      </span>
    </button>
  );
}
