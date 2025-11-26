'use client';

import { useRef, useEffect } from 'react';

interface GridPoint {
    x: number;
    y: number;
    baseX: number;
    baseY: number;
    offsetX: number;
    offsetY: number;
}

interface ReactiveGridBackgroundProps {
    gridSize?: number;
    gridColor?: string;
    shockwave?: { position: { x: number; y: number } } | null;
}

export default function ReactiveGridBackground({
    gridSize = 40,
    gridColor = '#ae83ff6a',
    shockwave
}: ReactiveGridBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gridPointsRef = useRef<GridPoint[][]>([]);
    const animationFrameRef = useRef<number | null>(null);
    const shockwaveDataRef = useRef<{
        x: number;
        y: number;
        time: number;
        active: boolean;
    } | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initGrid();
        };

        const initGrid = () => {
            gridPointsRef.current = [];
            const cols = Math.ceil(canvas.width / gridSize) + 1;
            const rows = Math.ceil(canvas.height / gridSize) + 1;

            for (let i = 0; i < rows; i++) {
                gridPointsRef.current[i] = [];
                for (let j = 0; j < cols; j++) {
                    const x = j * gridSize;
                    const y = i * gridSize;
                    gridPointsRef.current[i][j] = {
                        x,
                        y,
                        baseX: x,
                        baseY: y,
                        offsetX: 0,
                        offsetY: 0
                    };
                }
            }
        };

        const animate = () => {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const currentTime = Date.now() / 1000;

            const idleWaveAmplitude = 10;
            const idleWaveSpeed = 1.2;
            const idleWaveFrequency = 0.003;

            gridPointsRef.current.forEach((row) => {
                row.forEach((point) => {
                    const returnSpeed = 0.1;
                    point.offsetX += (0 - point.offsetX) * returnSpeed;
                    point.offsetY += (0 - point.offsetY) * returnSpeed;

                    if (shockwaveDataRef.current && shockwaveDataRef.current.active) {
                        const sw = shockwaveDataRef.current;
                        const elapsed = currentTime - sw.time;

                        if (elapsed < 3) {
                            const dx = point.baseX - sw.x;
                            const dy = point.baseY - sw.y;
                            const distance = Math.sqrt(dx * dx + dy * dy);

                            const waveSpeed = 200;
                            const waveWidth = 150;
                            const waveFront = elapsed * waveSpeed;

                            if (distance < waveFront && distance > waveFront - waveWidth) {
                                const falloff = (waveWidth - (waveFront - distance)) / waveWidth;
                                const strength = Math.pow(falloff, 2);

                                const angle = Math.atan2(dy, dx);
                                const displacement = strength * 25;

                                point.offsetX = Math.cos(angle) * displacement;
                                point.offsetY = Math.sin(angle) * displacement;
                            }
                        } else {
                            shockwaveDataRef.current.active = false;
                        }
                    }

                    const idleOffsetX =
                        Math.sin(point.baseY * idleWaveFrequency + currentTime * idleWaveSpeed) *
                        idleWaveAmplitude;
                    const idleOffsetY =
                        Math.cos(point.baseX * idleWaveFrequency + currentTime * idleWaveSpeed) *
                        idleWaveAmplitude;

                    point.x = point.baseX + point.offsetX + idleOffsetX;
                    point.y = point.baseY + point.offsetY + idleOffsetY;
                });
            });

            ctx.strokeStyle = gridColor;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.15;

            for (let i = 0; i < gridPointsRef.current.length; i++) {
                for (let j = 0; j < gridPointsRef.current[i].length - 1; j++) {
                    const p1 = gridPointsRef.current[i][j];
                    const p2 = gridPointsRef.current[i][j + 1];

                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            for (let j = 0; j < gridPointsRef.current[0].length; j++) {
                for (let i = 0; i < gridPointsRef.current.length - 1; i++) {
                    const p1 = gridPointsRef.current[i][j];
                    const p2 = gridPointsRef.current[i + 1][j];

                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            ctx.globalAlpha = 1;

            gridPointsRef.current.forEach((row) => {
                row.forEach((point) => {
                    ctx.beginPath();
                    ctx.arc(point.x, point.y, 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = gridColor;
                    ctx.fill();
                });
            });

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
    }, [gridSize, gridColor]);

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
