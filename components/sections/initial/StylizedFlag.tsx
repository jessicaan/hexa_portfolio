'use client';

import { motion } from 'framer-motion';
import { flagPaths } from './constants';

interface StylizedFlagProps {
    country: string;
    isHovered: boolean;
    primaryRgb: { r: number; g: number; b: number };
}

export default function StylizedFlag({ country, isHovered, primaryRgb }: StylizedFlagProps) {
    const glowColor = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.4)`;
    const innerGlow = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.3)`;

    return (
        <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20">
            <motion.div
                className="absolute inset-0 rounded-2xl opacity-0"
                animate={{
                    opacity: isHovered ? 0.6 : 0,
                    scale: isHovered ? 1.3 : 1,
                }}
                transition={{ duration: 0.4 }}
                style={{
                    background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
                    filter: 'blur(20px)',
                }}
            />

            <motion.svg
                viewBox="0 0 100 100"
                className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden"
                style={{
                    filter: isHovered
                        ? `drop-shadow(0 0 30px ${glowColor})`
                        : 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))',
                }}
                animate={{
                    scale: isHovered ? 1.05 : 1,
                }}
                transition={{ duration: 0.3 }}
            >
                <defs>
                    <clipPath id={`clip-${country}`}>
                        <rect width="100" height="100" rx="16" />
                    </clipPath>
                    <linearGradient id={`shine-${country}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                    </linearGradient>
                </defs>

                <g clipPath={`url(#clip-${country})`}>
                    {flagPaths[country]}
                    <rect
                        width="100%"
                        height="100%"
                        fill={`url(#shine-${country})`}
                        style={{ mixBlendMode: 'overlay' }}
                    />
                </g>

                <rect
                    width="100"
                    height="100"
                    rx="16"
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="1"
                />
            </motion.svg>

            <motion.div
                className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none"
                animate={{
                    boxShadow: isHovered
                        ? `inset 0 0 30px ${innerGlow}`
                        : 'inset 0 0 0px transparent',
                }}
                transition={{ duration: 0.3 }}
            />
        </div>
    );
}