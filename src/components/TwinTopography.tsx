'use client';
import { useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export default function TwinTopography() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const timeRef = useRef<number>(0);
  const { netWorth } = useAppStore();

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
    };

    resize();
    window.addEventListener('resize', resize);

    // Grid configuration
    const cols = 25;
    const rows = 25;
    const scale = 20;

    // 2D to Isometric projection
    const isoProject = (x: number, y: number, z: number) => {
      // Standard isometric matrix
      const isoX = (x - y) * Math.cos(0.523599);
      const isoY = (x + y) * Math.sin(0.523599) - z;
      return { x: isoX, y: isoY };
    };

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      
      ctx.clearRect(0, 0, w, h);
      timeRef.current += 0.02;

      const time = timeRef.current;
      const offsetX = w / 2;
      const offsetY = h / 2 - (rows * scale * 0.25); // center adjustment

      // Calculate heights and base color shift based on NetWorth scale
      const volatility = 1 + (netWorth / 5000000); 

      // Draw the mesh
      for (let y = 0; y < rows - 1; y++) {
        for (let x = 0; x < cols - 1; x++) {
          
          // Generate pseudo-terrain using sine waves
          const getZ = (col: number, row: number) => {
            const distToCenter = Math.sqrt((col - cols/2)**2 + (row - rows/2)**2);
            // Dynamic wave based on time and position
            const wave1 = Math.sin(col * 0.3 + time) * Math.cos(row * 0.3 + time) * 20 * volatility;
            const wave2 = Math.sin(distToCenter * 0.5 - time * 2) * 15;
            // Center peak representing wealth
            const centerPeak = Math.max(0, 40 - distToCenter * 3) * volatility;
            
            return wave1 + wave2 + centerPeak;
          };

          const z1 = getZ(x, y);
          const z2 = getZ(x + 1, y);
          const z3 = getZ(x + 1, y + 1);
          const z4 = getZ(x, y + 1);

          // Center coordinates (offset from 0,0 to center of grid)
          const cx = x - cols / 2;
          const cy = y - rows / 2;

          // Project the 4 points of the quad
          const p1 = isoProject(cx * scale, cy * scale, z1);
          const p2 = isoProject((cx + 1) * scale, cy * scale, z2);
          const p3 = isoProject((cx + 1) * scale, (cy + 1) * scale, z3);
          const p4 = isoProject(cx * scale, (cy + 1) * scale, z4);

          // Draw the quad
          ctx.beginPath();
          ctx.moveTo(p1.x + offsetX, p1.y + offsetY);
          ctx.lineTo(p2.x + offsetX, p2.y + offsetY);
          ctx.lineTo(p3.x + offsetX, p3.y + offsetY);
          ctx.lineTo(p4.x + offsetX, p4.y + offsetY);
          ctx.closePath();

          // Color based on height (z1)
          const normalizedZ = (z1 + 30) / 100; // rough 0-1 scale
          
          // Interpolate between magenta (low/debt) and cyan (high/wealth)
          if (normalizedZ > 0.4) {
            ctx.strokeStyle = `rgba(0, 240, 255, ${Math.min(1, normalizedZ + 0.2)})`;
            ctx.fillStyle = `rgba(0, 240, 255, ${Math.min(0.2, normalizedZ * 0.3)})`;
          } else {
            ctx.strokeStyle = `rgba(201, 0, 255, ${Math.max(0.2, 1 - normalizedZ)})`;
            ctx.fillStyle = `rgba(201, 0, 255, ${Math.max(0.05, (1 - normalizedZ) * 0.1)})`;
          }

          ctx.lineWidth = 0.5;
          ctx.fill();
          ctx.stroke();
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [netWorth]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden glass-card flex flex-col">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-sm font-bold text-white tracking-widest uppercase">Wealth Topography</h3>
        <p className="text-[10px] text-[#00f0ff] font-mono mt-1">Multi-dimensional stress test active</p>
      </div>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
