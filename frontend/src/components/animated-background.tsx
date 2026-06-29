"use client";

import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-950">
      {/* Main UI Background Image stretched to fit perfectly */}
      <div 
        className="absolute inset-0 bg-[url('/main-bg.png')] bg-[length:100%_100%] bg-no-repeat"
      />
      
      {/* Dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-slate-950/60" />

      {/* Grainy overlay for texture */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      
      {/* Moving lines for high-tech feel */}
      <div className="absolute inset-0 opacity-20">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent absolute top-[20%] animate-pulse" />
        <div className="h-full w-px bg-gradient-to-b from-transparent via-purple-500/50 to-transparent absolute left-[15%] animate-pulse delay-700" />
        <div className="h-full w-px bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent absolute right-[30%] animate-pulse delay-300" />
        <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent absolute bottom-[25%] animate-pulse delay-500" />
      </div>
    </div>
  );
}
