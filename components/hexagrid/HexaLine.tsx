'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../theme/ThemeProvider';

interface HexaLineProps {
    startVertex: { x: number; y: number };
    direction: { x: number; y: number };
    length?: number;
    onClick?: (event: React.MouseEvent | React.PointerEvent, point: { x: number; y: number }) => void;
    index?: number;
}

export default function HexaLine({
    startVertex,
    direction,
    length = 200,
    onClick,
    index = 0
}: HexaLineProps) {
    const pathRef = useRef<SVGPathElement>(null);
    const visiblePathRef = useRef<SVGPathElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<SVGSVGElement>(null);
    const animationRef = useRef<gsap.core.Timeline | null>(null);

    const { primaryRgb, theme } = useTheme();

    const getLineColor = useCallback(() => {
        const { r, g, b } = primaryRgb;
        const isDark = theme === 'dark';
        return `rgba(${r}, ${g}, ${b}, ${isDark ? 0.9 : 0.85})`;
    }, [primaryRgb, theme]);

    const endX = startVertex.x + direction.x * length;
    const endY = startVertex.y + direction.y * length;

    const dx = endX - startVertex.x;
    const dy = endY - startVertex.y;
    const lineLength = Math.sqrt(dx * dx + dy * dy);

    const perpX = -dy / lineLength;
    const perpY = dx / lineLength;

    const buildPath = useCallback((getOffset: (t: number) => number, segments: number = 80) => {
        let d = `M ${startVertex.x} ${startVertex.y}`;

        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const baseX = startVertex.x + dx * t;
            const baseY = startVertex.y + dy * t;
            const offset = getOffset(t);

            d += ` L ${baseX + perpX * offset} ${baseY + perpY * offset}`;
        }

        return d;
    }, [startVertex.x, startVertex.y, dx, dy, perpX, perpY]);

    const getBasePath = useCallback(() => {
        return `M ${startVertex.x} ${startVertex.y} L ${endX} ${endY}`;
    }, [startVertex.x, startVertex.y, endX, endY]);

    useEffect(() => {
        if (!pathRef.current || !visiblePathRef.current) return;
        const basePath = getBasePath();
        pathRef.current.setAttribute('d', basePath);
        visiblePathRef.current.setAttribute('d', basePath);
    }, [getBasePath]);

    const animateStringVibration = useCallback((clickPoint: { x: number; y: number }) => {
        if (!pathRef.current || !visiblePathRef.current) return;

        if (animationRef.current) {
            animationRef.current.kill();
        }

        const path = pathRef.current;
        const visiblePath = visiblePathRef.current;

        const cx = clickPoint.x - startVertex.x;
        const cy = clickPoint.y - startVertex.y;

        let clickT = (cx * dx + cy * dy) / (lineLength * lineLength);
        clickT = Math.max(0.05, Math.min(0.95, clickT));

        const state = { time: 0 };

        const totalDuration = 4.8;
        const segments = 80;
        const initialAmplitude = 18;
        const damping = 3.5;
        const waveSpeed = 26;
        const frequency = 18;
        const spatialDecay = 2;

        const tl = gsap.timeline({
            onComplete: () => {
                const basePath = getBasePath();
                path.setAttribute('d', basePath);
                visiblePath.setAttribute('d', basePath);
            }
        });

        animationRef.current = tl;

        tl.to(state, {
            time: totalDuration,
            duration: totalDuration,
            ease: 'none',
            onUpdate: () => {
                const t = state.time;
                const amplitude = initialAmplitude * Math.exp(-damping * t);

                if (amplitude < 0.1) {
                    const basePath = getBasePath();
                    path.setAttribute('d', basePath);
                    visiblePath.setAttribute('d', basePath);
                    return;
                }

                const pathData = buildPath((segmentT) => {
                    const distFromClick = Math.abs(segmentT - clickT);
                    const boundaryFactor = Math.sin(segmentT * Math.PI);
                    const spatialEnvelope = Math.exp(-spatialDecay * distFromClick);
                    const phase = (segmentT - clickT) * frequency * Math.PI;
                    const timePhase = t * waveSpeed;
                    const wave = Math.sin(phase - timePhase) + 0.3 * Math.sin(phase * 2 - timePhase * 1.5);
                    return amplitude * spatialEnvelope * boundaryFactor * wave;
                }, segments);

                path.setAttribute('d', pathData);
                visiblePath.setAttribute('d', pathData);
            }
        });
    }, [startVertex.x, startVertex.y, dx, dy, lineLength, buildPath, getBasePath]);

    const handlePointerDown = useCallback((e: React.PointerEvent<SVGPathElement>) => {
        if (!pathRef.current || !containerRef.current) return;

        const svg = containerRef.current;
        const ctm = svg.getScreenCTM();
        if (!ctm) return;

        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;

        const svgPoint = pt.matrixTransform(ctm.inverse());
        const clickPoint = { x: svgPoint.x, y: svgPoint.y };

        animateStringVibration(clickPoint);

        onClick?.(e, clickPoint);
    }, [animateStringVibration, onClick]);

    useEffect(() => {
        return () => {
            animationRef.current?.kill();
        };
    }, []);

    const lineColor = getLineColor();

    return (
        <svg
            ref={containerRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ overflow: 'visible' }}
        >
            <defs>
                <filter id={`glow-line-${index}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            <g>
                <path
                    ref={pathRef}
                    stroke="transparent"
                    strokeWidth="20"
                    fill="none"
                    className="pointer-events-auto cursor-crosshair"
                    onPointerDown={handlePointerDown}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                />
                <path
                    ref={visiblePathRef}
                    stroke={lineColor}
                    strokeWidth={isHovered ? '3' : '2'}
                    fill="none"
                    filter={`url(#glow-line-${index})`}
                    className="pointer-events-none transition-all duration-300"
                    style={{
                        filter: `drop-shadow(0 0 10px ${lineColor})`
                    }}
                />
            </g>
        </svg>
    );
}