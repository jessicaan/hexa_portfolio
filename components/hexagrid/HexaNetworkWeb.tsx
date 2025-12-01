'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import ReactiveParticlesBackground from '../background/ReactiveParticlesBackground';
import { gsap } from 'gsap';
import { useTheme } from '../theme/ThemeProvider';
import { HexaNetworkProps, NetworkNode } from './HexaNetwork';

type ViewState = 'focused' | 'zooming-out' | 'network' | 'zooming-in';

export default function HexaNetworkWeb({
    nodes,
    initialNode,
    nodeRadius = 180,
    networkScaleDesktop = 0.95,
    onNodeChange,
    transitionToNode,
    command
}: HexaNetworkProps) {
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
    const getNodePosition = useCallback((node: NetworkNode) => node.position, []);

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
        const fromPos = getNodePosition(from);
        const toPos = getNodePosition(to);
        const angle = Math.atan2(toPos.y - fromPos.y, toPos.x - fromPos.x);
        const normalized = ((angle + Math.PI * 2) % (Math.PI * 2));
        const fromIdx = Math.round((normalized + Math.PI / 2) / (Math.PI / 3)) % 6;
        const toIdx = (fromIdx + 3) % 6;

        return {
            start: getVertex(fromPos.x, fromPos.y, nodeRadius, fromIdx),
            end: getVertex(toPos.x, toPos.y, nodeRadius, toIdx)
        };
    }, [nodeRadius, getVertex, getNodePosition]);

    const buildLinePath = useCallback((start: { x: number; y: number }, end: { x: number; y: number }, wave = 0, wavePos = 0.5) => {
        if (wave === 0) return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
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

    // Animate the line with a shockwave effect
    const animateLine = useCallback((key: string, start: { x: number; y: number }, end: { x: number; y: number }) => {
        const path = linesRef.current.get(key);
        if (!path) return;
        const state = { wave: 0 };


        gsap.to(state, {
            wave: 25,
            duration: 0.1,
            ease: 'power2.out',
            onUpdate: () => path.setAttribute('d', buildLinePath(start, end, state.wave, 0.5))
        });
        gsap.to(state, {
            wave: 0,
            duration: 1.5,
            delay: 0.1,
            ease: 'elastic.out(1.2, 0.2)',
            onUpdate: () => path.setAttribute('d', buildLinePath(start, end, state.wave, 0.5))
        });
    }, [buildLinePath]);

    // Viewport and Zoom

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
        const scale = Math.min(scaleX, scaleY, networkScaleDesktop);

        return { scale, x: vw / 2 - centerX * scale, y: vh / 2 - centerY * scale };
    }, [nodes, nodeRadius, networkScaleDesktop, getNode]);

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
        const tl = gsap.timeline({ onComplete: () => setViewState('network') });
        timelineRef.current = tl;
        tl.to(current, {
            scale: target.scale, x: target.x, y: target.y, duration: 1.2, ease: 'power4.inOut',
            onUpdate: () => applyTransform(current.scale, current.x, current.y)
        });
        if (contentContainerRef.current) tl.to(contentContainerRef.current, { opacity: 0, duration: 0.3 }, 0);
    }, [viewState, calculateView, applyTransform]);

    const zoomIn = useCallback((nodeId: string) => {
        if (viewState !== 'network') return;
        setActiveNode(nodeId);
        setViewState('zooming-in');
        timelineRef.current?.kill();
        const target = calculateView(nodeId);
        const current = { ...transformState.current };
        const tl = gsap.timeline({
            onComplete: () => {
                setViewState('focused');
                onNodeChange?.(nodeId);
            }
        });
        timelineRef.current = tl;
        tl.to(current, {
            scale: target.scale, x: target.x, y: target.y, duration: 1.2, ease: 'power4.inOut',
            onUpdate: () => applyTransform(current.scale, current.x, current.y)
        });
        if (contentContainerRef.current) tl.to(contentContainerRef.current, { opacity: 1, duration: 0.4 }, 0.8);
    }, [viewState, calculateView, applyTransform, onNodeChange]);

    const zoomOutRef = useRef(zoomOut);
    const zoomInRef = useRef(zoomIn);
    useEffect(() => {
        zoomOutRef.current = zoomOut;
        zoomInRef.current = zoomIn;
    });


    const triggerShockwave = (e: React.MouseEvent | MouseEvent) => {

        setShockwave({ position: { x: e.clientX, y: e.clientY } });
    };

    const handleNodeClick = useCallback((nodeId: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Avoid double click bugs
        triggerShockwave(e);

        if (viewState === 'focused' && nodeId === activeNode) zoomOut();
        else if (viewState === 'network') zoomIn(nodeId);
    }, [viewState, activeNode, zoomOut, zoomIn]);

    const handleLineClick = useCallback((key: string, from: NetworkNode, to: NetworkNode, e: React.MouseEvent) => {
        e.stopPropagation();
        triggerShockwave(e);

        const endpoints = getConnectionEndpoints(from, to);
        animateLine(key, endpoints.start, endpoints.end);
    }, [getConnectionEndpoints, animateLine]);

    useEffect(() => {
        if (!transitionToNode) return;
        pendingTargetRef.current = transitionToNode.targetId;
        if (viewState === 'focused') zoomOutRef.current();
        else if (viewState === 'network') {
            const target = pendingTargetRef.current;
            pendingTargetRef.current = null;
            if (target) zoomInRef.current(target);
        }
    }, [transitionToNode?.triggerKey]);

    useEffect(() => {
        if (viewState === 'network' && pendingTargetRef.current) {
            const target = pendingTargetRef.current;
            pendingTargetRef.current = null;
            if (target) zoomInRef.current(target);
        }
    }, [viewState]);

    useEffect(() => {
        if (command?.name === 'zoomOut') zoomOutRef.current();
    }, [command]);

    useEffect(() => {
        const view = calculateView(activeNode);
        applyTransform(view.scale, view.x, view.y);
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
            synapseConnections.push({ key: `synapse-${nodes[i].id}--${nodes[j].id}`, from: nodes[i], to: nodes[j] });
        }
    }

    const colors = getColors();

    return (
        <div ref={containerRef} className="fixed inset-0 w-screen h-screen overflow-hidden bg-background transition-colors duration-500">

            <ReactiveParticlesBackground shockwave={shockwave} />

            <div ref={transformRef} style={{ transformOrigin: '0 0' }}>
                <svg className="absolute overflow-visible" style={{ width: '1px', height: '1px', pointerEvents: viewState === 'network' || viewState === 'focused' ? 'auto' : 'none' }}>
                    <defs>
                        <filter id="hex-glow" x="-100%" y="-100%" width="300%" height="300%">
                            <feGaussianBlur stdDeviation="8" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                        <filter id="line-soft" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="1" result="blur" />
                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                        </filter>
                    </defs>

                    {/* Ghost Connections (Synapses) */}
                    {synapseConnections.map(({ key, from, to }) => {
                        const { start, end } = getConnectionEndpoints(from, to);
                        return <path key={key} d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`} stroke={colors.line} strokeWidth="0.8" opacity="0.12" fill="none" filter="url(#line-soft)" className="pointer-events-none transition-colors duration-300" />;
                    })}

                    {/* Principal meaninfull connections */}
                    {connections.map(({ key, from, to }) => {
                        const { start, end } = getConnectionEndpoints(from, to);
                        return (
                            <g key={key}>
                                {/* Click area expanded to make it easy to click*/}
                                <path
                                    d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                                    stroke="transparent"
                                    strokeWidth="40"
                                    fill="none"
                                    className="cursor-pointer"
                                    onClick={(e) => handleLineClick(key, from, to, e)}
                                />
                                {/*  Visible Line */}
                                <path
                                    ref={el => { if (el) linesRef.current.set(key, el); }}
                                    d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                                    stroke={colors.line}
                                    strokeWidth="2"
                                    fill="none"
                                    filter="url(#line-soft)"
                                    className="pointer-events-none transition-colors duration-300"
                                    opacity="0.8"
                                />
                                {/* Vertice dots */}
                                <circle cx={start.x} cy={start.y} r="3" fill={colors.glow} opacity="0.6" />
                                <circle cx={end.x} cy={end.y} r="3" fill={colors.glow} opacity="0.6" />
                            </g>
                        );
                    })}

                    {/* Hexa Nodes */}
                    {nodes.map(node => {
                        const isActive = node.id === activeNode;
                        const isHovered = node.id === hoveredNode;
                        return (
                            <g
                                key={node.id}
                                onClick={(e) => handleNodeClick(node.id, e)} // Passando o evento 'e'
                                onMouseEnter={() => setHoveredNode(node.id)}
                                onMouseLeave={() => setHoveredNode(null)}
                                className="cursor-pointer"
                                style={{ transition: 'transform 0.3s ease-out' }}
                            >
                                <polygon
                                    points={hexPoints(node.position.x, node.position.y, nodeRadius)}
                                    fill={colors.nodeFill}
                                    stroke={isActive ? colors.activeGlow : isHovered ? colors.glow : colors.nodeStroke}
                                    strokeWidth={isActive ? 3 : isHovered ? 2 : 1}
                                    filter={isActive || isHovered ? 'url(#hex-glow)' : undefined}
                                    className="transition-all duration-300"
                                />
                                <text
                                    x={node.position.x}
                                    y={node.position.y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill={colors.text}
                                    fontSize="18"
                                    fontWeight={isActive ? "600" : "300"}
                                    letterSpacing="0.05em"
                                    opacity={viewState === 'focused' ? 0 : 1}
                                    className="pointer-events-none select-none transition-all duration-300 text-md font-light font-sans"
                                    style={{ textShadow: isActive ? `0 0 10px ${colors.glow}` : 'none' }}
                                >
                                    {node.label}
                                </text>
                            </g>
                        );
                    })}
                </svg>

                <div ref={contentContainerRef}>
                    {nodes.map(node => (
                        <div key={`content-${node.id}`} className="absolute" style={{ left: node.position.x, top: node.position.y, transform: 'translate(-50%, -50%)', opacity: node.id === activeNode && viewState === 'focused' ? 1 : 0, pointerEvents: node.id === activeNode && viewState === 'focused' ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
                            {node.content}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
