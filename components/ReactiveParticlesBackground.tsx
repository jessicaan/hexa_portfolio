'use client';

import { useRef, useEffect, useMemo } from 'react';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

interface ReactiveParticlesBackgroundProps {
  particleCount?: number;
  particleColor?: string;
  shockwave?: { position: { x: number; y: number } } | null;
}

export default function ReactiveParticlesBackground({
  particleCount = 150,
  particleColor = '#9b5cff2d',
  shockwave
}: ReactiveParticlesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const shockwaveDataRef = useRef<{
    x: number;
    y: number;
    time: number;
    active: boolean;
  } | null>(null);

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 155, g: 92, b: 255 };
  };

  const rgb = useMemo(() => hexToRgb(particleColor), [particleColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      particlesRef.current = [];
      for (let i = 0; i < particleCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        particlesRef.current.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.3
        });
      }
    };

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const currentTime = Date.now() / 1000;

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        const returnForce = 0.02;
        particle.vx += (particle.baseX - particle.x) * returnForce;
        particle.vy += (particle.baseY - particle.y) * returnForce;

        particle.vx *= 0.95;
        particle.vy *= 0.95;

        if (shockwaveDataRef.current && shockwaveDataRef.current.active) {
          const sw = shockwaveDataRef.current;
          const elapsed = currentTime - sw.time;

          if (elapsed < 3) {
            const dx = particle.x - sw.x;
            const dy = particle.y - sw.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const waveSpeed = 200;
            const waveWidth = 150;
            const waveFront = elapsed * waveSpeed;

            if (distance < waveFront && distance > waveFront - waveWidth) {
              const falloff = (waveWidth - (waveFront - distance)) / waveWidth;
              const strength = Math.pow(falloff, 2) * 15;

              const angle = Math.atan2(dy, dx);
              particle.vx += Math.cos(angle) * strength;
              particle.vy += Math.sin(angle) * strength;
            }
          } else {
            shockwaveDataRef.current.active = false;
          }
        }

        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${particle.opacity})`;
        ctx.fill();
      });

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p1 = particlesRef.current[i];
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p2 = particlesRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particleCount, rgb]);

  useEffect(() => {
    if (shockwave) {
      shockwaveDataRef.current = {
        x: shockwave.position.x,
        y: shockwave.position.y,
        time: Date.now() / 1000,
        active: true
      };
    }
  }, [shockwave]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10"
      style={{ background: '#000' }}
    />
  );
}