'use client';
import React, { useEffect, useRef } from 'react';
import { useCosmicControl } from '@/lib/useCosmicControl';

interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  trail: [number, number][];
  life: number;
  opacity: number;
}

export default function CometCanvas() {
  const { cometsEnabled } = useCosmicControl();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cometsRef = useRef<Comet[]>([]);

  useEffect(() => {
    if (!cometsEnabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);

    const spawnComet = () => {
      if (cometsRef.current.length === 0) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.6 + Math.random() * 0.3;
        cometsRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          trail: [],
          life: 0,
          opacity: 1,
        });
      }
    };

    const interval = setInterval(spawnComet, 15000 + Math.random() * 10000);
    spawnComet();

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      const fadeStart = 500;
      const maxLife = 700;
      cometsRef.current.forEach((c, idx) => {
        c.x += c.vx;
        c.y += c.vy;
        c.trail.push([c.x, c.y]);
        if (c.trail.length > 40) c.trail.shift();
        c.life += 1;

        if (c.life > fadeStart) {
          c.opacity = Math.max(0, 1 - (c.life - fadeStart) / (maxLife - fadeStart));
        }

        const grad = ctx.createLinearGradient(c.x, c.y, c.x - c.vx * 40, c.y - c.vy * 40);
        grad.addColorStop(0, `rgba(255,255,255,${0.8 * c.opacity})`);
        grad.addColorStop(1, 'rgba(0,128,255,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        c.trail.forEach(([tx, ty], i) => {
          if (i === 0) ctx.moveTo(tx, ty);
          else ctx.lineTo(tx, ty);
        });
        ctx.stroke();

        if (c.x < -50 || c.x > width + 50 || c.y < -50 || c.y > height + 50 || c.life > maxLife) {
          cometsRef.current.splice(idx, 1);
        }
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(interval);
      window.removeEventListener('resize', resize);
    };
  }, [cometsEnabled]);

  if (!cometsEnabled) return null;

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[-1]" />;
}
