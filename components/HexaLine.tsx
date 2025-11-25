'use client';

import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';

interface HexaLineProps {
    startVertex: { x: number; y: number };
    direction: { x: number; y: number };
    length?: number;
    color?: string;
    onClick?: (event: React.MouseEvent, point: { x: number; y: number }) => void;
    index?: number;
}

export default function HexaLine({
    startVertex,
    direction,
    length = 200,
    color = '#9b5cff',
    onClick,
    index = 0
}: HexaLineProps) {
    const pathRef = useRef<SVGPathElement>(null);
    const containerRef = useRef<SVGSVGElement>(null);
    const animationRef = useRef<gsap.core.Timeline | null>(null);

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
        if (!pathRef.current) return;
        pathRef.current.setAttribute('d', getBasePath());
    }, [getBasePath]);

    const animateStringVibration = useCallback((clickPoint: { x: number; y: number }) => {
        if (!pathRef.current) return;

        if (animationRef.current) {
            animationRef.current.kill();
        }

        const path = pathRef.current;

        const cx = clickPoint.x - startVertex.x;
        const cy = clickPoint.y - startVertex.y;

        let clickT = (cx * dx + cy * dy) / (lineLength * lineLength);
        clickT = Math.max(0.05, Math.min(0.95, clickT));

        const state = { time: 0 };

        // ══════════════════════════════════════════════════════════════
        // CONFIGURAÇÕES DA ANIMAÇÃO - altere esses valores para ajustar
        // ══════════════════════════════════════════════════════════════

        const totalDuration = 4.8;      // Duração total da animação em segundos
        const segments = 40;            // Quantidade de pontos na linha (mais = curva mais suave)

        const initialAmplitude = 18;    // Amplitude máxima da distorção em pixels
        const damping = 3.5;            // Velocidade que a vibração perde força (maior = para mais rápido)
        const waveSpeed = 26;           // Velocidade de propagação da onda ao longo do tempo
        const frequency = 8;            // Quantidade de ondas visíveis na linha (maior = mais ondulações)
        const spatialDecay = 2;         // Concentração da onda no ponto clicado (maior = mais localizada)

        const tl = gsap.timeline({
            onComplete: () => {
                path.setAttribute('d', getBasePath());
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
                    path.setAttribute('d', getBasePath());
                    return;
                }

                const pathData = buildPath((segmentT) => {
                    const distFromClick = Math.abs(segmentT - clickT);

                    const boundaryFactor = Math.sin(segmentT * Math.PI);

                    const spatialEnvelope = Math.exp(-spatialDecay * distFromClick);

                    const phase = (segmentT - clickT) * frequency * Math.PI;
                    const timePhase = t * waveSpeed;

                    // Onda principal + harmônico secundário (0.3 = intensidade do segundo harmônico)
                    const wave = Math.sin(phase - timePhase) + 0.3 * Math.sin(phase * 2 - timePhase * 1.5);

                    return amplitude * spatialEnvelope * boundaryFactor * wave;
                }, segments);

                path.setAttribute('d', pathData);
            }
        });
    }, [startVertex.x, startVertex.y, dx, dy, lineLength, buildPath, getBasePath]);

    const handleClick = useCallback((e: React.MouseEvent<SVGPathElement>) => {
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

            <path
                ref={pathRef}
                stroke={color}
                strokeWidth="2"
                fill="none"
                filter={`url(#glow-line-${index})`}
                className="pointer-events-auto cursor-crosshair transition-all hover:stroke-[3px]"
                onClick={handleClick}
                style={{
                    filter: `drop-shadow(0 0 10px ${color})`
                }}
            />
        </svg>
    );
}