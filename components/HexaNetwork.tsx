'use client';

import { useRef, useEffect, useState, useCallback, ReactNode } from 'react';
import ReactiveParticlesBackground from './ReactiveParticlesBackground';
import { gsap } from 'gsap';
import { useTheme } from './ThemeProvider';

interface NetworkNode {
    id: string;
    label: string;
    content?: ReactNode;
    position: { x: number; y: number };
    connections: string[];
}

interface HexaNetworkAdvancedProps {
    nodes: NetworkNode[];
    initialNode?: string;
    nodeRadius?: number;
    onNodeChange?: (nodeId: string) => void;
    transitionToNode?: {
        targetId: string;
        triggerKey: number;
    };
}

type ViewState = 'focused' | 'zooming-out' | 'network' | 'zooming-in';

export default function HexaNetworkAdvanced({
    nodes,
    initialNode,
    nodeRadius = 120,
    onNodeChange,
    transitionToNode
}: HexaNetworkAdvancedProps) {
    const { theme, primaryRgb } = useTheme();

    const getColors = useCallback(() => {
        const { r, g, b } = primaryRgb;
        const isDark = theme === 'dark';

        return {
            line: `rgb(${r}, ${g}, ${b})`,
            nodeStroke: isDark ? '#333' : '#ccc',
            nodeFill: isDark ? 'rgba(10, 10, 15, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            glow: `rgb(${r}, ${g}, ${b})`,
            activeGlow: `rgb(${Math.min(r + 50, 255)}, ${Math.min(g + 50, 255)}, ${Math.min(b + 50, 255)})`,
            text: isDark ? '#fff' : '#1a1a1a',
        };
    }, [primaryRgb, theme]);

    const containerRef = useRef<HTMLDivElement>(null);
    const transformRef = useRef<HTMLDivElement>(null);
    const contentContainerRef = useRef<HTMLDivElement>(null);
    const linesRef = useRef<Map<string, SVGPathElement>>(new Map());

    const [activeNode, setActiveNode] = useState(initialNode || nodes[0]?.id);
    const [viewState, setViewState] = useState<ViewState>('focused');
    const [hoveredNode, setHoveredNode] = useState<string | null>(null);
    const [shockwave, setShockwave] = useState<{ position: { x: number; y: number } } | null>(null);

    const transformState = useRef({ scale: 1, x: 0, y: 0 });
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const pendingTargetRef = useRef<string | null>(null);

    const getNode = useCallback((id: string) => nodes.find(n => n.id === id), [nodes]);

    const hexPoints = useCallback((cx: number, cy: number, r: number): string => {
        return Array.from({ length: 6 }, (_, i) => {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
        }).join(' ');
    }, []);

    const getVertex = useCallback((cx: number, cy: number, r: number, index: number) => {
        const angle = (Math.PI / 3) * index - Math.PI / 2;
        return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    }, []);

    const getConnectionEndpoints = useCallback((from: NetworkNode, to: NetworkNode) => {
        const angle = Math.atan2(to.position.y - from.position.y, to.position.x - from.position.x);
        const normalized = ((angle + Math.PI * 2) % (Math.PI * 2));
        const fromIdx = Math.round((normalized + Math.PI / 2) / (Math.PI / 3)) % 6;
        const toIdx = (fromIdx + 3) % 6;

        return {
            start: getVertex(from.position.x, from.position.y, nodeRadius, fromIdx),
            end: getVertex(to.position.x, to.position.y, nodeRadius, toIdx)
        };
    }, [nodeRadius, getVertex]);

    const buildLinePath = useCallback((start: { x: number; y: number }, end: { x: number; y: number }, wave = 0, wavePos = 0.5) => {
        if (wave === 0) {
            return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
        }

        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const perpX = -dy / len;
        const perpY = dx / len;

        const segments = 60;
        let d = `M ${start.x} ${start.y}`;

        for (let i = 1; i <= segments; i++) {
            const t = i / segments;
            const baseX = start.x + dx * t;
            const baseY = start.y + dy * t;

            const dist = Math.abs(t - wavePos);
            const envelope = Math.exp(-8 * dist * dist) * Math.sin(t * Math.PI);
            const offset = wave * envelope * Math.sin((t - wavePos) * 20);

            d += ` L ${baseX + perpX * offset} ${baseY + perpY * offset}`;
        }

        return d;
    }, []);

    const animateLine = useCallback((key: string, start: { x: number; y: number }, end: { x: number; y: number }) => {
        const path = linesRef.current.get(key);
        if (!path) return;

        const state = { wave: 0 };

        gsap.to(state, {
            wave: 15,
            duration: 0.15,
            ease: 'power2.out',
            onUpdate: () => {
                path.setAttribute('d', buildLinePath(start, end, state.wave, 0.5));
            }
        });

        gsap.to(state, {
            wave: 0,
            duration: 2,
            delay: 0.15,
            ease: 'elastic.out(1, 0.15)',
            onUpdate: () => {
                path.setAttribute('d', buildLinePath(start, end, state.wave, 0.5));
            }
        });
    }, [buildLinePath]);

    const calculateView = useCallback((targetNodeId?: string) => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        if (targetNodeId) {
            const node = getNode(targetNodeId);
            if (!node) return { scale: 1, x: 0, y: 0 };
            return {
                scale: 1,
                x: vw / 2 - node.position.x,
                y: vh / 2 - node.position.y
            };
        }

        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        nodes.forEach(n => {
            minX = Math.min(minX, n.position.x - nodeRadius);
            maxX = Math.max(maxX, n.position.x + nodeRadius);
            minY = Math.min(minY, n.position.y - nodeRadius);
            maxY = Math.max(maxY, n.position.y + nodeRadius);
        });

        const width = maxX - minX;
        const height = maxY - minY;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        const padding = 150;
        const scaleX = (vw - padding * 2) / width;
        const scaleY = (vh - padding * 2) / height;
        const scale = Math.min(scaleX, scaleY, 0.45);

        return {
            scale,
            x: vw / 2 - centerX * scale,
            y: vh / 2 - centerY * scale
        };
    }, [nodes, nodeRadius, getNode]);

    const applyTransform = useCallback((scale: number, x: number, y: number) => {
        if (!transformRef.current) return;
        transformRef.current.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        transformState.current = { scale, x, y };
    }, []);

    const zoomOut = useCallback(() => {
        if (viewState !== 'focused') return;
        setViewState('zooming-out');

        timelineRef.current?.kill();

        const target = calculateView();
        const current = { ...transformState.current };

        const tl = gsap.timeline({
            onComplete: () => setViewState('network')
        });

        timelineRef.current = tl;

        tl.to(current, {
            scale: target.scale,
            x: target.x,
            y: target.y,
            duration: 1.4,
            ease: 'power3.inOut',
            onUpdate: () => applyTransform(current.scale, current.x, current.y)
        });

        if (contentContainerRef.current) {
            tl.to(contentContainerRef.current, { opacity: 0, duration: 0.3 }, 0);
        }
    }, [viewState, calculateView, applyTransform]);

    const zoomIn = useCallback((nodeId: string) => {
        if (viewState !== 'network') return;
        setViewState('zooming-in');

        timelineRef.current?.kill();

        const target = calculateView(nodeId);
        const current = { ...transformState.current };

        const tl = gsap.timeline({
            onComplete: () => {
                setViewState('focused');
                setActiveNode(nodeId);
                onNodeChange?.(nodeId);
            }
        });

        timelineRef.current = tl;

        tl.to(current, {
            scale: target.scale,
            x: target.x,
            y: target.y,
            duration: 1.4,
            ease: 'power3.inOut',
            onUpdate: () => applyTransform(current.scale, current.x, current.y)
        });

        if (contentContainerRef.current) {
            tl.to(contentContainerRef.current, { opacity: 1, duration: 0.4 }, 1);
        }
    }, [viewState, calculateView, applyTransform, onNodeChange]);

    const handleNodeClick = useCallback((nodeId: string) => {
        if (viewState === 'focused' && nodeId === activeNode) {
            zoomOut();
        } else if (viewState === 'network') {
            zoomIn(nodeId);
        }
    }, [viewState, activeNode, zoomOut, zoomIn]);

    const handleLineClick = useCallback((key: string, from: NetworkNode, to: NetworkNode) => {
        const endpoints = getConnectionEndpoints(from, to);
        animateLine(key, endpoints.start, endpoints.end);
    }, [getConnectionEndpoints, animateLine]);

    useEffect(() => {
        if (!transitionToNode) return;

        pendingTargetRef.current = transitionToNode.targetId;

        if (viewState === 'focused') {
            zoomOut();
        } else if (viewState === 'network') {
            const target = pendingTargetRef.current;
            pendingTargetRef.current = null;
            if (target) {
                zoomIn(target);
            }
        }
    }, [transitionToNode?.triggerKey]);

    useEffect(() => {
        if (viewState === 'network' && pendingTargetRef.current) {
            const target = pendingTargetRef.current;
            pendingTargetRef.current = null;
            if (target) {
                zoomIn(target);
            }
        }
    }, [viewState, zoomIn]);

    useEffect(() => {
        const view = calculateView(activeNode);
        applyTransform(view.scale, view.x, view.y);
    }, []);

    useEffect(() => {
        return () => { timelineRef.current?.kill(); };
    }, []);

    const connections: Array<{ key: string; from: NetworkNode; to: NetworkNode }> = [];
    const seen = new Set<string>();

    nodes.forEach(node => {
        node.connections.forEach(targetId => {
            const key = [node.id, targetId].sort().join('--');
            if (!seen.has(key)) {
                const target = getNode(targetId);
                if (target) {
                    connections.push({ key, from: node, to: target });
                    seen.add(key);
                }
            }
        });
    });

    const synapseConnections: Array<{ key: string; from: NetworkNode; to: NetworkNode }> = [];

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const from = nodes[i];
            const to = nodes[j];
            const key = `synapse-${from.id}--${to.id}`;
            synapseConnections.push({ key, from, to });
        }
    }

    const colors = getColors();

    return (
        <div ref={containerRef} className="fixed inset-0 w-screen h-screen overflow-hidden bg-background transition-colors duration-500">
            <ReactiveParticlesBackground shockwave={shockwave} />

            <div ref={transformRef} style={{ transformOrigin: '0 0' }}>
                <svg
                    className="absolute overflow-visible"
                    style={{
                        width: '1px',
                        height: '1px',
                        pointerEvents: viewState === 'network' || viewState === 'focused' ? 'auto' : 'none'
                    }}
                >
                    <defs>
                        <filter id="hex-glow" x="-100%" y="-100%" width="300%" height="300%">
                            <feGaussianBlur stdDeviation="8" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <filter id="line-soft" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="1" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {synapseConnections.map(({ key, from, to }) => {
                        const { start, end } = getConnectionEndpoints(from, to);
                        return (
                            <path
                                key={key}
                                d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                                stroke={colors.line}
                                strokeWidth="0.8"
                                opacity="0.18"
                                fill="none"
                                filter="url(#line-soft)"
                                className="pointer-events-none transition-colors duration-300"
                            />
                        );
                    })}

                    {connections.map(({ key, from, to }) => {
                        const { start, end } = getConnectionEndpoints(from, to);
                        return (
                            <g key={key}>
                                <path
                                    d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                                    stroke="transparent"
                                    strokeWidth="20"
                                    fill="none"
                                    className="cursor-pointer"
                                    onClick={() => handleLineClick(key, from, to)}
                                />
                                <path
                                    ref={el => { if (el) linesRef.current.set(key, el); }}
                                    d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                                    stroke={colors.line}
                                    strokeWidth="1.5"
                                    fill="none"
                                    filter="url(#line-soft)"
                                    className="pointer-events-none transition-colors duration-300"
                                    opacity="0.6"
                                />
                                <circle cx={start.x} cy={start.y} r="4" fill="transparent" stroke={colors.glow} strokeWidth="1" opacity="0.4" className="transition-colors duration-300" />
                                <circle cx={end.x} cy={end.y} r="4" fill="transparent" stroke={colors.glow} strokeWidth="1" opacity="0.4" className="transition-colors duration-300" />
                            </g>
                        );
                    })}

                    {nodes.map(node => {
                        const isActive = node.id === activeNode;
                        const isHovered = node.id === hoveredNode;

                        return (
                            <g
                                key={node.id}
                                onClick={() => handleNodeClick(node.id)}
                                onMouseEnter={() => setHoveredNode(node.id)}
                                onMouseLeave={() => setHoveredNode(null)}
                                className="cursor-pointer"
                            >
                                <polygon
                                    points={hexPoints(node.position.x, node.position.y, nodeRadius)}
                                    fill={colors.nodeFill}
                                    stroke={isActive ? colors.activeGlow : isHovered ? colors.glow : colors.nodeStroke}
                                    strokeWidth={isActive ? 2 : isHovered ? 1.5 : 1}
                                    filter={isActive || isHovered ? 'url(#hex-glow)' : undefined}
                                    className="transition-all duration-300"
                                />
                                <text
                                    x={node.position.x}
                                    y={node.position.y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill={colors.text}
                                    fontSize="16"
                                    fontWeight="300"
                                    letterSpacing="0.1em"
                                    opacity={viewState === 'network' || viewState === 'zooming-out' ? 1 : 0}
                                    className="pointer-events-none select-none transition-all duration-300"
                                >
                                    {node.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                <div ref={contentContainerRef}>
                    {nodes.map(node => (
                        <div
                            key={`content-${node.id}`}
                            className="absolute"
                            style={{
                                left: node.position.x,
                                top: node.position.y,
                                transform: 'translate(-50%, -50%)',
                                opacity: node.id === activeNode && viewState === 'focused' ? 1 : 0,
                                pointerEvents: node.id === activeNode && viewState === 'focused' ? 'auto' : 'none',
                                transition: 'opacity 0.3s'
                            }}
                        >
                            {node.content}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}