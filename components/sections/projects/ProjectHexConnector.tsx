'use client';

import { useRef, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '@/components/theme/ThemeProvider';

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
    isActive = false,
    onVibrate,
}: ProjectHexConnectorProps) {
    const pathRef = useRef<SVGPathElement>(null);
    const interactionRef = useRef<SVGPathElement>(null);
    const [isHovered, setIsHovered] = useState(false);


    const animationRef = useRef<gsap.core.Timeline | null>(null);

    const { primaryRgb } = useTheme();
    const lineColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;

    const dString = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;

    const animateString = useCallback(() => {
        if (!pathRef.current) return;

        if (animationRef.current) animationRef.current.kill();

        const state = { time: 0 };
        const tl = gsap.timeline();
        animationRef.current = tl;

        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const perpX = -dy / len;
        const perpY = dx / len;

        tl.to(state, {
            time: 4, // Duração da vibração
            duration: 4,
            ease: 'none',
            onUpdate: () => {
                const t = state.time;
                const amplitude = 15 * Math.exp(-3 * t);

                if (amplitude < 0.1) {
                    pathRef.current?.setAttribute('d', dString);
                    return;
                }

                let newD = `M ${start.x} ${start.y}`;
                const segments = 20;

                for (let i = 1; i <= segments; i++) {
                    const segmentT = i / segments;
                    const bx = start.x + dx * segmentT;
                    const by = start.y + dy * segmentT;
                    const wave = Math.sin(segmentT * Math.PI) * Math.sin(t * 20) * amplitude;
                    newD += ` L ${bx + perpX * wave} ${by + perpY * wave}`;
                }

                pathRef.current?.setAttribute('d', newD);
            }
        });

    }, [start, end, dString]);

    return (
        <g
            className="pointer-events-auto"
            onMouseEnter={() => {
                setIsHovered(true);
                animateString();
            }}
            onMouseLeave={() => setIsHovered(false)}
            onClick={(e) => {
                onVibrate?.({ x: e.clientX, y: e.clientY });
                animateString();
            }}
        >
            <path
                ref={interactionRef}
                d={dString}
                stroke="transparent"
                strokeWidth="30"
                fill="none"
                className="cursor-crosshair"
            />

            <path
                ref={pathRef}
                d={dString}
                stroke={lineColor}
                strokeWidth={isActive ? 2 : 1}
                strokeOpacity={isActive ? 0.9 : 0.4}
                fill="none"
                strokeLinecap="round"
                className="transition-all duration-300"
                style={{
                    filter: isActive || isHovered ? `drop-shadow(0 0 8px ${lineColor})` : 'none',
                }}
            />
        </g>
    );
}