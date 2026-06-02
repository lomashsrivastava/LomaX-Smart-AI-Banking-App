'use client';
import { useRef, useEffect } from 'react';

interface NeuralNode {
  x: number; y: number; vx: number; vy: number; radius: number;
}

export default function NeuralBrain({ isProcessing }: { isProcessing: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<NeuralNode[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const initNodes = (w: number, h: number) => {
      const nodes: NeuralNode[] = [];
      for (let i = 0; i < 40; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 2 + 1,
        });
      }
      return nodes;
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      nodesRef.current = initNodes(rect.width, rect.height);
    };

    resize();
    // No resize listener needed here as it's a fixed small panel, but good practice
    window.addEventListener('resize', resize);

    let time = 0;
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      ctx.clearRect(0, 0, w, h);
      time += isProcessing ? 0.05 : 0.01;

      // Draw background glow
      const cx = w / 2, cy = h / 2;
      const corePulse = isProcessing ? 1 + Math.sin(time * 2) * 0.2 : 1;
      const bgGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.8 * corePulse);
      bgGlow.addColorStop(0, isProcessing ? 'rgba(0, 240, 255, 0.15)' : 'rgba(0, 240, 255, 0.05)');
      bgGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, w, h);

      // Speed multiplier
      const speedMult = isProcessing ? 3 : 1;

      // Update and draw nodes
      nodesRef.current.forEach(node => {
        node.x += node.vx * speedMult;
        node.y += node.vy * speedMult;

        // Bounce
        if (node.x < 0 || node.x > w) node.vx *= -1;
        if (node.y < 0 || node.y > h) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * (isProcessing ? 1.5 : 1), 0, Math.PI * 2);
        ctx.fillStyle = isProcessing ? '#00f0ff' : 'rgba(0, 240, 255, 0.5)';
        ctx.fill();
      });

      // Draw Synapses
      nodesRef.current.forEach((n1, i) => {
        for (let j = i + 1; j < nodesRef.current.length; j++) {
          const n2 = nodesRef.current[j];
          const dist = Math.sqrt((n1.x - n2.x) ** 2 + (n1.y - n2.y) ** 2);
          const maxDist = isProcessing ? 80 : 50;

          if (dist < maxDist) {
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            const alpha = 1 - (dist / maxDist);
            // Synapse color shifts when processing
            ctx.strokeStyle = isProcessing 
              ? `rgba(201, 0, 255, ${alpha * 0.8})` 
              : `rgba(0, 240, 255, ${alpha * 0.3})`;
            ctx.lineWidth = isProcessing ? 1.5 : 0.5;
            ctx.stroke();
          }
        }
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isProcessing]);

  return (
    <div className="relative w-full h-32 rounded-2xl overflow-hidden glass-card mb-4 shrink-0 flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Overlay text */}
      <div className="relative z-10 flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full mb-2 shadow-[0_0_10px_currentColor] transition-colors duration-500 ${isProcessing ? 'bg-[#ff3366] text-[#ff3366] animate-pulse' : 'bg-[#00f0ff] text-[#00f0ff]'}`} />
        <span className="text-xs font-bold tracking-widest text-white uppercase font-mono">
          {isProcessing ? 'Loma Processing...' : 'Loma Idle'}
        </span>
      </div>
    </div>
  );
}
