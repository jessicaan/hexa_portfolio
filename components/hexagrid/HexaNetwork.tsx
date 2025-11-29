'use client';

import { useState, useEffect } from 'react';
import HexaNetworkWeb from './HexaNetworkWeb';
import HexaNetworkMobile from './HexaNetworkMobile';
import { ReactNode } from 'react';

export interface NetworkNode {
    id: string;
    label: string;
    content?: ReactNode;
    position: { x: number; y: number };
    mobilePosition?: { x: number; y: number };
    connections: string[];
}

export interface HexaNetworkProps {
    nodes: NetworkNode[];
    initialNode?: string;
    nodeRadius?: number;
    mobileNodeRadius?: number;
    mobileBreakpoint?: number;
    networkScaleDesktop?: number;
    networkScaleMobile?: number;
    onNodeChange?: (nodeId: string) => void;
    transitionToNode?: {
        targetId: string;
        triggerKey: number;
    };
    command?: { name: 'zoomOut'; key: number } | null;
}

export default function HexaNetwork(props: HexaNetworkProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);
    const breakpoint = props.mobileBreakpoint || 640;

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
        checkMobile();

        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [breakpoint]);

    if (!mounted) return null;

    return isMobile ? (
        <HexaNetworkMobile {...props} />
    ) : (
        <HexaNetworkWeb {...props} />
    );
}