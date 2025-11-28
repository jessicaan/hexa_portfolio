'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '@/components/ThemeProvider';

interface ProjectHexConnectorProps {
    start: { x: number; y: number };
    end: { x: number; y: number };
    index?: number;
    isActive?: boolean;
    onVibrate?: (position: { x: number; y: number }) => void;
}

export default function ProjectHexConnector({
    start,
    end,
    index = 0,
    isActive = false,
    onVibrate,
}: ProjectHexConnectorProps) {
    const pathRef = useRef<SVGPathElement>(null);
    const visiblePathRef = useRef<SVGPathElement>(null);
    const containerRef = useRef<SVGSVGElement>(null);
    const [isHovered, setIsHovered] = useState(false);
    const animationRef = useRef<gsap.core.Timeline | null>(null);

    const { primaryRgb, theme } = useTheme();

    const getLineColor = useCallback(() => {
        const { r, g, b } = primaryRgb;
        const isDark = theme === 'dark';
        const baseOpacity = isActive ? (isDark ? 0.85 : 0.75) : (isDark ? 0.4 : 0.3);
        const opacity = isHovered ? Math.min(baseOpacity + 0.2, 1) : baseOpacity;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }, [primaryRgb, theme, isActive, isHovered]);

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lineLength = Math.sqrt(dx * dx + dy * dy);
    const perpX = lineLength > 0 ? -dy / lineLength : 0;
    const perpY = lineLength > 0 ? dx / lineLength : 0;

    const buildPath = useCallback((getOffset: (t: number) => number, segments: number = 80) => {
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

    const animateStringVibration = useCallback((clickPoint: { x: number; y: number }) => {
        if (!pathRef.current || !visiblePathRef.current) return;

        if (animationRef.current) {
            animationRef.current.kill();
        }

        const path = pathRef.current;
        const visiblePath = visiblePathRef.current;

        const cx = clickPoint.x - start.x;
        const cy = clickPoint.y - start.y;

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
    }, [start.x, start.y, dx, dy, lineLength, buildPath, getBasePath]);

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

        if (onVibrate) {
            onVibrate(clickPoint);
        }
    }, [animateStringVibration, onVibrate]);

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
                <filter id={`connector-glow-${index}`} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation={isActive ? 5 : 3} result="blur" />
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
                    strokeWidth={isHovered ? 3 : (isActive ? 2.5 : 1.5)}
                    fill="none"
                    strokeLinecap="round"
                    filter={`url(#connector-glow-${index})`}
                    className="pointer-events-none transition-all duration-300"
                    style={{
                        filter: `drop-shadow(0 0 ${isActive ? 10 : 6}px ${lineColor})`,
                    }}
                />
            </g>
        </svg>
    );
}