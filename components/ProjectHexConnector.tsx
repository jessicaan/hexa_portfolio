'use client';

import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '@/components/ThemeProvider';

interface ProjectHexConnectorProps {
    start: { x: number; y: number };
    end: { x: number; y: number };
    index?: number;
    isActive?: boolean;
}

export default function ProjectHexConnector({
    start,
    end,
    index = 0,
    isActive = false,
}: ProjectHexConnectorProps) {
    const pathRef = useRef<SVGPathElement>(null);
    const visiblePathRef = useRef<SVGPathElement>(null);
    const animationRef = useRef<gsap.core.Timeline | null>(null);

    const { primaryRgb, theme } = useTheme();

    const getLineColor = useCallback(() => {
        const { r, g, b } = primaryRgb;
        const isDark = theme === 'dark';
        const opacity = isActive ? (isDark ? 0.85 : 0.75) : (isDark ? 0.35 : 0.25);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }, [primaryRgb, theme, isActive]);

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lineLength = Math.sqrt(dx * dx + dy * dy);
    const perpX = lineLength > 0 ? -dy / lineLength : 0;
    const perpY = lineLength > 0 ? dx / lineLength : 0;

    const buildPath = useCallback((getOffset: (t: number) => number, segments: number = 50) => {
        let d = `M ${start.x} ${start.y}`;
        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const baseX = start.x + dx * t;
            const baseY = start.y + dy * t;
            const offset = getOffset(t);
            d += ` L ${baseX + perpX * offset} ${baseY + perpY * offset}`;
        }
        return d;
    }, [start.x, start.y, dx, dy, perpX, perpY]);

    const getBasePath = useCallback(() => {
        return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    }, [start.x, start.y, end.x, end.y]);

    useEffect(() => {
        if (!pathRef.current || !visiblePathRef.current) return;
        const basePath = getBasePath();
        pathRef.current.setAttribute('d', basePath);
        visiblePathRef.current.setAttribute('d', basePath);
    }, [getBasePath]);

    useEffect(() => {
        if (!isActive || !pathRef.current || !visiblePathRef.current) return;

        if (animationRef.current) {
            animationRef.current.kill();
        }

        const path = pathRef.current;
        const visiblePath = visiblePathRef.current;
        const clickT = 0.5;
        const state = { time: 0 };

        const totalDuration = 2;
        const segments = 50;
        const initialAmplitude = 10;
        const damping = 4.5;
        const waveSpeed = 18;
        const frequency = 12;
        const spatialDecay = 3;

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

        return () => {
            animationRef.current?.kill();
        };
    }, [isActive, buildPath, getBasePath]);

    const lineColor = getLineColor();

    return (
        <>
            <defs>
                <filter id={`connector-glow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation={isActive ? 4 : 2} result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <path
                ref={pathRef}
                stroke="transparent"
                strokeWidth="16"
                fill="none"
                className="pointer-events-none"
            />
            <path
                ref={visiblePathRef}
                stroke={lineColor}
                strokeWidth={isActive ? 2 : 1.5}
                fill="none"
                strokeLinecap="round"
                filter={isActive ? `url(#connector-glow-${index})` : undefined}
                className="pointer-events-none transition-all duration-300"
                style={{
                    filter: isActive ? `drop-shadow(0 0 8px ${lineColor})` : undefined,
                }}
            />
        </>
    );
}