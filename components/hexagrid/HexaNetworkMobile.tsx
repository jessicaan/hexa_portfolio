'use client';

import { useRef, useEffect, useState, useCallback, useMemo, ReactNode } from 'react';
import ReactiveParticlesBackground from '../background/ReactiveParticlesBackground';
import { gsap } from 'gsap';
import { useTheme } from '../theme/ThemeProvider';
import { HexaNetworkProps } from './HexaNetwork';

type ViewState = 'focused' | 'zooming-out' | 'network' | 'zooming-in';

export default function HexaNetworkMobile({
    nodes,
    initialNode,
    mobileNodeRadius = 90,
    networkScaleMobile = 0.85,
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

    const verticalNodes = useMemo(() => {
        const verticalSpacing = mobileNodeRadius * 2.2;
        const horizontalOffset = mobileNodeRadius * 0.8;

        return nodes.map((node, index) => {
            const isLeft = index % 2 === 0;
            const xOffset = isLeft ? -horizontalOffset : horizontalOffset;

            return {
                ...node,
                position: {
                    x: xOffset,
                    y: index * verticalSpacing
                }
            };
        });
    }, [nodes, mobileNodeRadius]);

    const contentHeight = useMemo(() => {
        if (verticalNodes.length === 0) return 0;
        const lastNode = verticalNodes[verticalNodes.length - 1];
        return lastNode.position.y + mobileNodeRadius * 4;
    }, [verticalNodes, mobileNodeRadius]);

    const containerRef = useRef<HTMLDivElement>(null);
    const transformRef = useRef<HTMLDivElement>(null);
    const contentContainerRef = useRef<HTMLDivElement>(null);

    const [activeNode, setActiveNode] = useState(initialNode || nodes[0]?.id);
    const [viewState, setViewState] = useState<ViewState>('focused');
    const [scrollProgress, setScrollProgress] = useState(0);

    const transformState = useRef({ scale: 1, x: 0, y: 0 });
    const dragRef = useRef({ isDragging: false, startY: 0, lastTransformY: 0 });
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const pendingTargetRef = useRef<string | null>(null);

    const getNode = useCallback((id: string) => verticalNodes.find(n => n.id === id), [verticalNodes]);

    const hexPoints = useCallback((cx: number, cy: number, r: number): string => {
        return Array.from({ length: 6 }, (_, i) => {
            const angle = (Math.PI / 3) * i - Math.PI / 2;
            return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
        }).join(' ');
    }, []);

    const applyTransform = useCallback((scale: number, x: number, y: number) => {
        if (!transformRef.current) return;
        transformRef.current.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        transformState.current = { scale, x, y };
    }, []);

    const calculateView = useCallback((targetNodeId?: string) => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const centerX = vw / 2;

        if (targetNodeId) {
            const node = getNode(targetNodeId);
            if (!node) return { scale: 1, x: centerX, y: vh / 2 };

            return {
                scale: 1,
                x: centerX - node.position.x,
                y: vh / 2 - node.position.y
            };
        }

        return {
            scale: networkScaleMobile,
            x: centerX,
            y: vh * 0.15
        };
    }, [networkScaleMobile, getNode]);

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
            duration: 1.0,
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
            duration: 1.0,
            ease: 'power3.inOut',
            onUpdate: () => applyTransform(current.scale, current.x, current.y)
        });

        if (contentContainerRef.current) {
            tl.to(contentContainerRef.current, { opacity: 1, duration: 0.4 }, 0.6);
        }
    }, [viewState, calculateView, applyTransform, onNodeChange]);

    const zoomOutRef = useRef(zoomOut);
    const zoomInRef = useRef(zoomIn);

    useEffect(() => {
        zoomOutRef.current = zoomOut;
        zoomInRef.current = zoomIn;
    });

    const handleNodeClick = useCallback((nodeId: string) => {
        if (viewState === 'focused' && nodeId === activeNode) {
            zoomOut();
        } else if (viewState === 'network') {
            zoomIn(nodeId);
        }
    }, [viewState, activeNode, zoomOut, zoomIn]);

    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        if (viewState !== 'network') return;
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        dragRef.current = {
            isDragging: true,
            startY: clientY,
            lastTransformY: transformState.current.y
        };
    };

    const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!dragRef.current.isDragging || viewState !== 'network') return;

        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
        const deltaY = clientY - dragRef.current.startY;
        let newY = dragRef.current.lastTransformY + deltaY;

        const vh = window.innerHeight;
        const maxScroll = -(contentHeight * networkScaleMobile) + (vh * 0.8);
        const minScroll = vh * 0.2;

        newY = Math.min(minScroll, Math.max(maxScroll, newY));

        applyTransform(transformState.current.scale, transformState.current.x, newY);

        const progress = Math.max(0, Math.min(1, (minScroll - newY) / (minScroll - maxScroll)));
        setScrollProgress(progress);
    };

    const handleTouchEnd = () => {
        dragRef.current.isDragging = false;
    };

    useEffect(() => {
        if (!transitionToNode) return;

        pendingTargetRef.current = transitionToNode.targetId;

        if (viewState === 'focused') {
            zoomOutRef.current();
        } else if (viewState === 'network') {
            const target = pendingTargetRef.current;
            pendingTargetRef.current = null;
            if (target) {
                zoomInRef.current(target);
            }
        }
    }, [transitionToNode?.triggerKey]);

    useEffect(() => {
        if (viewState === 'network' && pendingTargetRef.current) {
            const target = pendingTargetRef.current;
            pendingTargetRef.current = null;
            if (target) {
                zoomInRef.current(target);
            }
        }
    }, [viewState]);

    useEffect(() => {
        if (command?.name === 'zoomOut') {
            zoomOutRef.current();
        }
    }, [command]);

    useEffect(() => {
        const view = calculateView(activeNode);
        applyTransform(view.scale, view.x, view.y);
    }, []);

    useEffect(() => {
        return () => { timelineRef.current?.kill(); };
    }, []);

    const connections = useMemo(() => {
        const lines: ReactNode[] = [];
        const colors = getColors();

        verticalNodes.forEach((node, i) => {
            if (i < verticalNodes.length - 1) {
                const nextNode = verticalNodes[i + 1];
                const start = { x: node.position.x, y: node.position.y + mobileNodeRadius };
                const end = { x: nextNode.position.x, y: nextNode.position.y - mobileNodeRadius };

                lines.push(
                    <path
                        key={`conn-${node.id}-${nextNode.id}`}
                        d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                        stroke={colors.line}
                        strokeWidth="1"
                        opacity="0.3"
                        strokeDasharray="5,5"
                        fill="none"
                    />
                );
            }
        });
        return lines;
    }, [verticalNodes, mobileNodeRadius, getColors]);

    const colors = getColors();

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 w-screen h-screen overflow-hidden bg-background touch-none transition-colors duration-500"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseMove={handleTouchMove}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
        >
            <ReactiveParticlesBackground shockwave={null} />

            <div
                className={`absolute right-1 top-20 bottom-20 w-1 rounded-full bg-gray-800/30 transition-opacity duration-300 ${viewState === 'network' ? 'opacity-100' : 'opacity-0'}`}
                style={{ zIndex: 50 }}
            >
                <div
                    className="absolute w-full rounded-full"
                    style={{
                        backgroundColor: colors.glow,
                        height: '15%',
                        top: `${scrollProgress * 85}%`,
                        boxShadow: `0 0 10px ${colors.glow}`,
                        transition: 'top 75ms'
                    }}
                />
            </div>

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
                        <filter id="hex-glow-mobile" x="-100%" y="-100%" width="300%" height="300%">
                            <feGaussianBlur stdDeviation="4" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {connections}

                    {verticalNodes.map(node => {
                        const isActive = node.id === activeNode;

                        return (
                            <g
                                key={node.id}
                                onClick={() => handleNodeClick(node.id)}
                                className="cursor-pointer"
                            >
                                <polygon
                                    points={hexPoints(node.position.x, node.position.y, mobileNodeRadius)}
                                    fill={colors.nodeFill}
                                    stroke={isActive ? colors.activeGlow : colors.nodeStroke}
                                    strokeWidth={isActive ? 2 : 1}
                                    filter={isActive ? 'url(#hex-glow-mobile)' : undefined}
                                    className="transition-all duration-300"
                                />
                                <text
                                    x={node.position.x}
                                    y={node.position.y}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    fill={colors.text}
                                    fontSize="12"
                                    fontWeight="500"
                                    letterSpacing="0.05em"
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
                    {verticalNodes.map(node => (
                        <div
                            key={`content-${node.id}`}
                            className="absolute"
                            style={{
                                left: node.position.x,
                                top: node.position.y,
                                transform: 'translate(-50%, -50%)',
                                width: '100vw',
                                maxWidth: '400px',
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