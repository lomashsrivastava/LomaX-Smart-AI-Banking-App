'use client';
import { useRef, useEffect, useCallback, useState } from 'react';
import { useAppStore } from '@/lib/store';

// 3D Point structure
interface Point3D {
  x: number; y: number; z: number;
}

// Projected 2D Point
interface Point2D {
  x: number; y: number; scale: number;
}

interface Node3D {
  p: Point3D;
  color: string;
}

interface Moon3D {
  angle: number;
  orbitRadius: number;
  orbitTiltX: number; // inclination
  orbitTiltZ: number; 
  size: number;
  color: string;
  label: string;
  balance: number;
  speed: number;
}

export default function HolographicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);
  
  // Data refs
  const globeNodesRef = useRef<Node3D[]>([]);
  const moonsRef = useRef<Moon3D[]>([]);
  const { accounts, netWorth } = useAppStore();

  // Camera & Interaction state
  const rotationRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });
  
  // Constants
  const GLOBE_RADIUS = 250;
  const FOCAL_LENGTH = 800;

  // 1. Math Utilities for 3D
  const rotateX = (p: Point3D, angle: number): Point3D => {
    const cos = Math.cos(angle), sin = Math.sin(angle);
    return { x: p.x, y: p.y * cos - p.z * sin, z: p.y * sin + p.z * cos };
  };

  const rotateY = (p: Point3D, angle: number): Point3D => {
    const cos = Math.cos(angle), sin = Math.sin(angle);
    return { x: p.x * cos + p.z * sin, y: p.y, z: -p.x * sin + p.z * cos };
  };

  const rotateZ = (p: Point3D, angle: number): Point3D => {
    const cos = Math.cos(angle), sin = Math.sin(angle);
    return { x: p.x * cos - p.y * sin, y: p.x * sin + p.y * cos, z: p.z };
  };

  const project = (p: Point3D, w: number, h: number): Point2D => {
    // Translate Z so the object is in front of the camera
    const z = p.z + FOCAL_LENGTH; 
    const scale = FOCAL_LENGTH / (z || 1);
    return {
      x: (p.x * scale) + (w / 2),
      y: (p.y * scale) + (h / 2),
      scale
    };
  };

  // 2. Initialization
  const initGlobe = useCallback(() => {
    const nodes: Node3D[] = [];
    // Fibonacci sphere distribution
    const numNodes = 400;
    const phi = Math.PI * (3 - Math.sqrt(5)); 
    
    for (let i = 0; i < numNodes; i++) {
      const y = 1 - (i / (numNodes - 1)) * 2; 
      const radius = Math.sqrt(1 - y * y); 
      const theta = phi * i; 

      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;

      // Make it look like a high-tech data core
      const isHot = Math.random() > 0.95;
      nodes.push({
        p: { x: x * GLOBE_RADIUS, y: y * GLOBE_RADIUS, z: z * GLOBE_RADIUS },
        color: isHot ? '#ff3366' : '#00f0ff'
      });
    }
    return nodes;
  }, []);

  const initMoons = useCallback(() => {
    return accounts.map((acc, i) => ({
      angle: (i / accounts.length) * Math.PI * 2,
      orbitRadius: GLOBE_RADIUS + 100 + i * 40,
      orbitTiltX: (Math.random() - 0.5) * Math.PI * 0.5,
      orbitTiltZ: (Math.random() - 0.5) * Math.PI * 0.5,
      size: 15 + (acc.balance / 1000000) * 20,
      color: acc.color,
      label: acc.accountType.charAt(0).toUpperCase() + acc.accountType.slice(1),
      balance: acc.balance,
      speed: 0.005 + (accounts.length - i) * 0.002,
    }));
  }, [accounts]);

  // 3. Main Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Setup
    globeNodesRef.current = initGlobe();
    moonsRef.current = initMoons();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Interaction handlers
    const handleDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      lastMouseRef.current = { x: clientX, y: clientY };
    };
    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const dx = clientX - lastMouseRef.current.x;
      const dy = clientY - lastMouseRef.current.y;
      
      rotationRef.current.y += dx * 0.005;
      rotationRef.current.x -= dy * 0.005;
      lastMouseRef.current = { x: clientX, y: clientY };
    };
    const handleUp = () => { isDraggingRef.current = false; };

    canvas.addEventListener('mousedown', handleDown);
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
    canvas.addEventListener('touchstart', handleDown);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleUp);

    // Render loop
    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      ctx.clearRect(0, 0, w, h);

      // Auto rotation
      if (!isDraggingRef.current) {
        rotationRef.current.y += 0.002;
        rotationRef.current.x += 0.0005;
      }

      // Draw Globe
      const sortedNodes = globeNodesRef.current.map(node => {
        let p = rotateX(node.p, rotationRef.current.x);
        p = rotateY(p, rotationRef.current.y);
        return { ...node, rotated: p, proj: project(p, w, h) };
      }).sort((a, b) => b.rotated.z - a.rotated.z); // Z-sort (draw back to front)

      sortedNodes.forEach((node, i) => {
        const { proj, rotated } = node;
        // Fade out nodes in the back
        const alpha = Math.max(0.1, 1 - (rotated.z + GLOBE_RADIUS) / (GLOBE_RADIUS * 2));
        const r = Math.max(0.5, 2 * proj.scale);
        
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();

        // Connect some nearby nodes to form wireframe
        if (i % 3 === 0 && i > 0 && alpha > 0.3) {
          const prev = sortedNodes[i - 1].proj;
          ctx.beginPath();
          ctx.moveTo(proj.x, proj.y);
          ctx.lineTo(prev.x, prev.y);
          ctx.strokeStyle = `rgba(0, 240, 255, ${alpha * 0.15})`;
          ctx.lineWidth = 0.5 * proj.scale;
          ctx.stroke();
        }
      });

      // Draw Singularity Core (Net Worth text in the center of the globe)
      const centerProj = project({x:0, y:0, z:0}, w, h);
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${24 * centerProj.scale}px Outfit`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`₹${(netWorth / 100000).toFixed(1)}L`, centerProj.x, centerProj.y - 10 * centerProj.scale);
      ctx.font = `${10 * centerProj.scale}px Space Grotesk`;
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText('GLOBAL SINGULARITY', centerProj.x, centerProj.y + 15 * centerProj.scale);

      // Draw Moons (Accounts)
      const moonObjects = moonsRef.current.map(moon => {
        moon.angle += moon.speed;
        // Base flat orbit
        let p: Point3D = {
          x: Math.cos(moon.angle) * moon.orbitRadius,
          y: 0,
          z: Math.sin(moon.angle) * moon.orbitRadius
        };
        // Apply individual moon orbit tilt
        p = rotateX(p, moon.orbitTiltX);
        p = rotateZ(p, moon.orbitTiltZ);
        // Apply global camera rotation
        p = rotateX(p, rotationRef.current.x);
        p = rotateY(p, rotationRef.current.y);
        
        return { ...moon, rotated: p, proj: project(p, w, h) };
      }).sort((a, b) => b.rotated.z - a.rotated.z);

      moonObjects.forEach(moon => {
        const { proj, rotated } = moon;
        // Z-depth calculation for fading and sizing
        const depthRatio = 1 - (rotated.z + GLOBE_RADIUS * 2) / (GLOBE_RADIUS * 4);
        const alpha = Math.max(0.1, Math.min(1, depthRatio * 1.5));
        const finalSize = moon.size * proj.scale;

        // Draw Moon Aura
        const moonGlow = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, finalSize * 2.5);
        moonGlow.addColorStop(0, `${moon.color}${Math.floor(alpha * 100).toString(16).padStart(2,'0')}`);
        moonGlow.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, finalSize * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = moonGlow;
        ctx.fill();

        // Draw Moon Core
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, finalSize, 0, Math.PI * 2);
        ctx.fillStyle = `${moon.color}${Math.floor(alpha * 200).toString(16).padStart(2,'0')}`;
        ctx.fill();
        ctx.strokeStyle = `${moon.color}${Math.floor(alpha * 255).toString(16).padStart(2,'0')}`;
        ctx.lineWidth = 1.5 * proj.scale;
        ctx.stroke();

        // Draw labels if moon is somewhat in front
        if (alpha > 0.4) {
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.font = `bold ${12 * proj.scale}px Outfit`;
          ctx.textAlign = 'center';
          ctx.fillText(moon.label, proj.x, proj.y + finalSize + 16 * proj.scale);
          ctx.font = `${10 * proj.scale}px Space Grotesk`;
          ctx.fillStyle = `rgba(255,255,255,${alpha * 0.7})`;
          ctx.fillText(`₹${(moon.balance / 1000).toFixed(0)}K`, proj.x, proj.y + finalSize + 30 * proj.scale);
        }
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousedown', handleDown);
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
      canvas.removeEventListener('touchstart', handleDown);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [initGlobe, initMoons, netWorth]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      style={{ background: 'transparent' }}
    />
  );
}
