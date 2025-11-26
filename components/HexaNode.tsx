'use client';

import { useRef, useEffect, useState, ReactNode } from 'react';
import { gsap } from 'gsap';
import HexaLine from './HexaLine';

interface HexaNodeProps {
  size?: number;
  color?: string;
  glowColor?: string;
  onLineClick?: (lineIndex: number, clickPosition: { x: number; y: number }) => void;
  children?: ReactNode;
}

export default function HexaNode({
  size = 90,
  color = '#7c43d847',
  glowColor = '#370e791a',
  onLineClick,
  children
}: HexaNodeProps) {
  const hexRef = useRef<SVGPolygonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [vertices, setVertices] = useState<Array<{ x: number; y: number }>>([]);

  // Track viewport size so geometry scales with the screen
  useEffect(() => {
    const updateDimensions = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setDimensions({ width: vw, height: vh });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Recalculate the hexagon vertices whenever size or viewport changes
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const radius = Math.min(dimensions.width, dimensions.height) * (size / 75) * 0.5;

    const calculatedVertices = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      calculatedVertices.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      });
    }

    setVertices(calculatedVertices);
  }, [dimensions, size]);

  // Add a subtle tilt effect that follows the mouse
  useEffect(() => {
    if (!hexRef.current || !containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = containerRef.current!.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

      gsap.to(hexRef.current, {
        duration: 0.6,
        rotationY: x * 8,
        rotationX: -y * 8,
        transformPerspective: 4000,
        ease: 'power2.out'
      });
    };

    const container = containerRef.current;
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Unit vector for each line that extends from a vertex
  const getLineDirection = (index: number) => {
    const angle = (Math.PI / 3) * index - Math.PI / 2;
    return {
      x: Math.cos(angle),
      y: Math.sin(angle)
    };
  };

  // Bubble line clicks (with hit position) up to the parent
  const handleLineClick = (lineIndex: number) => (
    event: React.MouseEvent,
    point: { x: number; y: number }
  ) => {
    if (onLineClick) {
      onLineClick(lineIndex, point);
    }
  };

  if (vertices.length === 0) return null; // Wait for geometry before rendering

  const points = vertices.map(v => `${v.x},${v.y}`).join(' ');

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-screen h-screen overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* Six rays coming out of each vertex */}
      {vertices.map((vertex, index) => (
        <HexaLine
          key={index}
          index={index}
          startVertex={vertex}
          direction={getLineDirection(index)}
          length={Math.max(dimensions.width, dimensions.height)}
          color={color}
          onClick={handleLineClick(index)}
        />
      ))}

      {/* Central hexagon with glow and tilt */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Blur + merge to create the glow */}
          <filter id="hexagon-glow" x="-50%" y="-50%" width="50%" height="50%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <polygon
          ref={hexRef}
          points={points}
          fill="rgba(0, 0, 0, 0.6)"
          stroke={color}
          strokeWidth="3"
          filter="url(#hexagon-glow)"
          style={{
            filter: `drop-shadow(0 0 20px ${glowColor})`,
            transformOrigin: 'center center',
            transformStyle: 'preserve-3d'
          }}
        />
      </svg>

      {/* Content to be rendered inside the hexagon */}
      <div className="absolute inset-0 flex items-center justify-center w-full h-full pointer-events-none">
        {children}
      </div>
    </div>
  );
}
