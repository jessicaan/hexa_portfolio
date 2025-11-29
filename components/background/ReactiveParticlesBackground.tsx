'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../theme/ThemeProvider';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  opacity: number;
  baseOpacity: number;
}

interface ReactiveParticlesBackgroundProps {
  particleCount?: number;
  shockwave?: { position: { x: number; y: number } } | null;
}

export default function ReactiveParticlesBackground({
  particleCount = 70,
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

  const { theme, primaryRgb } = useTheme();

  const getThemeColors = useCallback(() => {
    const isDark = theme === 'dark';
    return {
      bg: isDark ? 'rgba(8, 8, 12, 0.12)' : 'rgba(250, 250, 252, 0.12)',
      particle: primaryRgb,
    };
  }, [theme, primaryRgb]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let colors = getThemeColors();

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
        const size = Math.random() * 2 + 0.5;
        const opacity = Math.random() * 0.3 + 0.1;

        particlesRef.current.push({
          x,
          y,
          baseX: x,
          baseY: y,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          size: size,
          baseSize: size,
          opacity: opacity,
          baseOpacity: opacity
        });
      }
    };

    const animate = () => {
      colors = getThemeColors();
      const { r, g, b } = colors.particle;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const currentTime = Date.now() / 1000;

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        const returnForce = 0.005;
        particle.vx += (particle.baseX - particle.x) * returnForce;
        particle.vy += (particle.baseY - particle.y) * returnForce;

        particle.vx *= 0.96;
        particle.vy *= 0.96;

        particle.size += (particle.baseSize - particle.size) * 0.1;
        particle.opacity += (particle.baseOpacity - particle.opacity) * 0.1;

        if (shockwaveDataRef.current && shockwaveDataRef.current.active) {
          const sw = shockwaveDataRef.current;
          const elapsed = currentTime - sw.time;

          if (elapsed < 2.0) {
            const dx = particle.x - sw.x;
            const dy = particle.y - sw.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            const waveSpeed = 250;
            const waveWidth = 100;
            const waveFront = elapsed * waveSpeed;

            if (distance < waveFront && distance > waveFront - waveWidth) {
              const falloff = (waveWidth - (waveFront - distance)) / waveWidth;
              const strength = Math.pow(falloff, 2) * 2;

              const angle = Math.atan2(dy, dx);
              particle.vx += Math.cos(angle) * strength;
              particle.vy += Math.sin(angle) * strength;

              const visualBoost = strength * 0.5;
              particle.size = particle.baseSize + (visualBoost * 3);
              particle.opacity = Math.min(1, particle.baseOpacity + visualBoost);
            }
          } else {
            shockwaveDataRef.current.active = false;
          }
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${particle.opacity})`;
        ctx.fill();
      });

      for (let i = 0; i < particlesRef.current.length; i++) {
        const p1 = particlesRef.current[i];
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p2 = particlesRef.current[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 180;

          if (distance < maxDistance) {
            const opacity = (1 - distance / maxDistance) * 0.15 * Math.min(p1.opacity, p2.opacity);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
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
  }, [particleCount, getThemeColors]);

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
      className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500"
      style={{ background: 'transparent' }}
    />
  );
}