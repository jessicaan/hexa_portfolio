'use client';

import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '@/components/ThemeProvider';
import type { ProjectStatus } from '@/lib/content/schema';

interface ProjectHexCardProps {
    id: string;
    title: string;
    thumbnail?: string;
    status: ProjectStatus;
    technologies?: string[];
    isSelected: boolean;
    onClick: () => void;
}

const STATUS_COLORS: Record<ProjectStatus, string> = {
    completed: '#10b981',
    'in-progress': '#3b82f6',
    archived: '#6b7280',
    concept: '#a855f7',
};

export default function ProjectHexCard({
    id,
    title,
    thumbnail,
    status,
    technologies = [],
    isSelected,
    onClick,
}: ProjectHexCardProps) {
    const hexRef = useRef<HTMLDivElement>(null);
    const { primaryRgb, theme } = useTheme();

    const accentColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;
    const isDark = theme === 'dark';

    useEffect(() => {
        if (!hexRef.current) return;

        if (isSelected) {
            gsap.to(hexRef.current, {
                scale: 1.06,
                duration: 0.4,
                ease: 'back.out(1.4)',
            });
        } else {
            gsap.to(hexRef.current, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out',
            });
        }
    }, [isSelected]);

    const handleMouseEnter = useCallback(() => {
        if (!hexRef.current || isSelected) return;
        gsap.to(hexRef.current, {
            scale: 1.03,
            duration: 0.25,
            ease: 'power2.out',
        });
    }, [isSelected]);

    const handleMouseLeave = useCallback(() => {
        if (!hexRef.current || isSelected) return;
        gsap.to(hexRef.current, {
            scale: 1,
            duration: 0.25,
            ease: 'power2.out',
        });
    }, [isSelected]);

    const statusColor = STATUS_COLORS[status];
    const displayTechs = technologies.slice(0, 3);

    const width = 200;
    const height = 230;

    return (
        <div
            ref={hexRef}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative cursor-pointer shrink-0 transition-[filter] duration-300"
            style={{
                width,
                height,
                filter: isSelected
                    ? `drop-shadow(0 0 25px ${accentColor}50)`
                    : `drop-shadow(0 4px 12px rgba(0,0,0,${isDark ? 0.4 : 0.15}))`,
            }}
        >
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="absolute inset-0 w-full h-full"
                style={{ overflow: 'visible' }}
            >
                <defs>
                    <clipPath id={`hex-clip-${id}`}>
                        <polygon points="100,8 192,60 192,170 100,222 8,170 8,60" />
                    </clipPath>
                    <filter id={`hex-glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <polygon
                    points="100,8 192,60 192,170 100,222 8,170 8,60"
                    fill={isDark ? 'rgba(20, 20, 28, 0.85)' : 'rgba(255, 255, 255, 0.9)'}
                    stroke={isSelected ? accentColor : (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)')}
                    strokeWidth={isSelected ? 2 : 1}
                    filter={isSelected ? `url(#hex-glow-${id})` : undefined}
                    style={{ backdropFilter: 'blur(12px)' }}
                />

                {thumbnail && (
                    <g clipPath={`url(#hex-clip-${id})`} opacity={0.15}>
                        <image
                            href={thumbnail}
                            x="0"
                            y="0"
                            width={width}
                            height={height}
                            preserveAspectRatio="xMidYMid slice"
                        />
                    </g>
                )}
            </svg>

            <div className="absolute inset-0 flex flex-col items-center px-4 pt-5 pb-4 pointer-events-none">
                <div className="flex items-center gap-1.5 mb-2">
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{
                            backgroundColor: statusColor,
                            boxShadow: `0 0 6px ${statusColor}`,
                        }}
                    />
                </div>

                <h3
                    className="text-center font-semibold leading-snug line-clamp-2 flex-1 flex items-center"
                    style={{
                        fontSize: 14,
                        color: isSelected ? accentColor : (isDark ? '#f1f5f9' : '#1e293b'),
                    }}
                >
                    {title}
                </h3>

                {displayTechs.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1 mt-auto pt-2">
                        {displayTechs.map((tech) => (
                            <span
                                key={tech}
                                className="px-2 py-0.5 rounded text-[9px] font-medium truncate max-w-[70px]"
                                style={{
                                    backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
                                    color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)',
                                    border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
                                }}
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}