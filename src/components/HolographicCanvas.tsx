'use client';
import { useRef, useEffect, useCallback } from 'react';
import { useAppStore } from '@/lib/store';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  radius: number; color: string; alpha: number; life: number;
}

interface Moon {
  angle: number; radius: number; size: number;
  color: string; label: string; balance: number; speed: number;
}

export default function HolographicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const moonsRef = useRef<Moon[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);
  const { accounts, netWorth, transactions } = useAppStore();

  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < 120; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * Math.min(w, h) * 0.35;
      particles.push({
        x: w / 2 + Math.cos(angle) * dist,
        y: h / 2 + Math.sin(angle) * dist,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 0.5,
        color: ['#00e5ff', '#b900ff', '#ff007f', '#10b981', '#f59e0b'][Math.floor(Math.random() * 5)],
        alpha: Math.random() * 0.6 + 0.2,
        life: Math.random() * 1000,
      });
    }
    // Transaction particles (shooting stars)
    const recentTxns = transactions.slice(0, 15);
    recentTxns.forEach((txn, i) => {
      const a = (i / 15) * Math.PI * 2;
      const d = 80 + Math.random() * 100;
      particles.push({
        x: w / 2 + Math.cos(a) * d, y: h / 2 + Math.sin(a) * d,
        vx: Math.cos(a) * 0.8, vy: Math.sin(a) * 0.8,
        radius: 2 + txn.amount / 20000,
        color: txn.type === 'credit' ? '#10b981' : txn.type === 'debit' ? '#ef4444' : '#f59e0b',
        alpha: 0.7, life: 500 + Math.random() * 500,
      });
    });
    return particles;
  }, [transactions]);

  const initMoons = useCallback(() => {
    return accounts.map((acc, i) => ({
      angle: (i / accounts.length) * Math.PI * 2,
      radius: 100 + i * 35,
      size: 8 + (acc.balance / 1000000) * 12,
      color: acc.color,
      label: acc.accountType.charAt(0).toUpperCase() + acc.accountType.slice(1),
      balance: acc.balance,
      speed: 0.002 + (accounts.length - i) * 0.001,
    }));
  }, [accounts]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      particlesRef.current = initParticles(rect.width, rect.height);
      moonsRef.current = initMoons();
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    canvas.addEventListener('mousemove', handleMouse);

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      timeRef.current += 0.016;
      ctx.clearRect(0, 0, w, h);

      // Draw grid
      ctx.strokeStyle = 'rgba(0,229,255,0.03)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      const cx = w / 2, cy = h / 2;

      // Draw orbit paths
      moonsRef.current.forEach(moon => {
        ctx.beginPath();
        ctx.arc(cx, cy, moon.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0,229,255,0.06)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // Draw central singularity (net worth core)
      const pulseScale = 1 + Math.sin(timeRef.current * 2) * 0.05;
      const coreRadius = 30 * pulseScale;
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 2.5);
      gradient.addColorStop(0, 'rgba(0,229,255,0.6)');
      gradient.addColorStop(0.4, 'rgba(185,0,255,0.3)');
      gradient.addColorStop(0.7, 'rgba(255,0,127,0.1)');
      gradient.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Inner core
      ctx.beginPath();
      ctx.arc(cx, cy, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,229,255,0.15)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,229,255,0.5)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Net worth text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Inter';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`₹${(netWorth / 100000).toFixed(1)}L`, cx, cy - 4);
      ctx.font = '10px Inter';
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText('NET WORTH', cx, cy + 12);

      // Draw moons (accounts)
      moonsRef.current.forEach(moon => {
        moon.angle += moon.speed;
        const mx = cx + Math.cos(moon.angle) * moon.radius;
        const my = cy + Math.sin(moon.angle) * moon.radius;

        // Moon glow
        const moonGlow = ctx.createRadialGradient(mx, my, 0, mx, my, moon.size * 2);
        moonGlow.addColorStop(0, moon.color + '40');
        moonGlow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(mx, my, moon.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = moonGlow;
        ctx.fill();

        // Moon body
        ctx.beginPath();
        ctx.arc(mx, my, moon.size, 0, Math.PI * 2);
        ctx.fillStyle = moon.color + '30';
        ctx.fill();
        ctx.strokeStyle = moon.color + '80';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Moon label
        ctx.fillStyle = '#ffffff';
        ctx.font = '9px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(moon.label, mx, my + moon.size + 14);
        ctx.font = '8px JetBrains Mono';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText(`₹${(moon.balance / 1000).toFixed(0)}K`, mx, my + moon.size + 24);
      });

      // Draw particles
      particlesRef.current.forEach(p => {
        // Mouse interaction
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          p.vx -= dx * 0.0003;
          p.vy -= dy * 0.0003;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.5;
        p.alpha = Math.max(0, Math.min(1, p.alpha + (Math.random() - 0.5) * 0.02));

        // Wrap around
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // Draw connecting lines between nearby particles
      particlesRef.current.forEach((p, i) => {
        for (let j = i + 1; j < Math.min(i + 8, particlesRef.current.length); j++) {
          const p2 = particlesRef.current[j];
          const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (d < 60) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0,229,255,${0.08 * (1 - d / 60)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouse);
    };
  }, [accounts, netWorth, initParticles, initMoons]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full rounded-2xl"
      style={{ background: 'transparent' }}
    />
  );
}
