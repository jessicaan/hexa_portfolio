'use client';

import { useRef, useCallback, useState } from 'react';
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
    isActive = false,
    onVibrate,
}: ProjectHexConnectorProps) {
    const pathRef = useRef<SVGPathElement>(null); // Linha visível
    const interactionRef = useRef<SVGPathElement>(null); // Linha grossa invisível para mouse
    const [isHovered, setIsHovered] = useState(false);

    // Referência para guardar a animação atual
    const animationRef = useRef<gsap.core.Timeline | null>(null);

    const { primaryRgb } = useTheme();
    const lineColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;

    // Caminho Inicial (Linha Reta)
    const dString = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;

    // Lógica de "String Theory" (Animação de corda)
    const animateString = useCallback(() => {
        if (!pathRef.current) return;

        // Mata animação anterior se houver
        if (animationRef.current) animationRef.current.kill();

        const state = { time: 0 };
        const tl = gsap.timeline();
        animationRef.current = tl;

        // Dados matemáticos da linha
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        // Vetor perpendicular normalizado
        const perpX = -dy / len;
        const perpY = dx / len;

        tl.to(state, {
            time: 4, // Duração da vibração
            duration: 4,
            ease: 'none',
            onUpdate: () => {
                const t = state.time;
                // Amplitude decai com o tempo
                const amplitude = 15 * Math.exp(-3 * t);

                // Se amplitude muito pequena, volta para reta e para
                if (amplitude < 0.1) {
                    pathRef.current?.setAttribute('d', dString);
                    return;
                }

                // Reconstrói o path com uma curva senoidal
                let newD = `M ${start.x} ${start.y}`;
                const segments = 20;

                for (let i = 1; i <= segments; i++) {
                    const segmentT = i / segments;
                    // Posição base na linha reta
                    const bx = start.x + dx * segmentT;
                    const by = start.y + dy * segmentT;

                    // Cálculo da onda
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
            {/* 1. Área de Interação (Invisível e grossa) */}
            <path
                ref={interactionRef}
                d={dString}
                stroke="transparent"
                strokeWidth="30"
                fill="none"
                className="cursor-crosshair"
            />

            {/* 2. Linha Visual Brilhante */}
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

            {/* 3. Pontos de solda (Onde a linha conecta no card) */}
            {/* Ponto Inicial */}
            {/* <circle cx={start.x} cy={start.y} r="2" fill={lineColor} opacity="0.5" /> */}
            {/* Ponto Final */}
            {/* <circle cx={end.x} cy={end.y} r="2" fill={lineColor} opacity="0.5" /> */}
        </g>
    );
}