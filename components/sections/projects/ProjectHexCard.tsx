'use client';

import { useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '@/components/theme/ThemeProvider';
import type { ProjectStatus } from '@/lib/content/schema';

import {
    SiTypescript, SiJavascript, SiReact, SiNextdotjs, SiTailwindcss,
    SiPrisma, SiSupabase, SiNodedotjs, SiFirebase, SiMongodb,
    SiPostgresql, SiDocker, SiGithub, SiVercel, SiFramer,
    SiGreensock, SiGraphql, SiRedis, SiStripe, SiPython,
    SiVuedotjs, SiAngular, SiFigma, SiAmazonwebservices,
    SiHtml5, SiCss3, SiSass
} from 'react-icons/si';

interface ProjectHexCardProps {
    id: string;
    title: string;
    shortDesc?: string;
    status: ProjectStatus;
    technologies?: string[];
    isSelected: boolean;
    onClick: () => void;
    viewDetailsText: string;
}

const STATUS_COLORS: Record<ProjectStatus, string> = {
    completed: '#10b981', // Emerald
    'in-progress': '#3b82f6', // Blue
    archived: '#6b7280', // Gray
    concept: '#a855f7', // Purple
};

const TECH_MAP: Record<string, { icon: React.ElementType; color: string }> = {
    typescript: { icon: SiTypescript, color: '#3178c6' },
    ts: { icon: SiTypescript, color: '#3178c6' },
    javascript: { icon: SiJavascript, color: '#f7df1e' },
    js: { icon: SiJavascript, color: '#f7df1e' },
    react: { icon: SiReact, color: '#61dafb' },
    'reactjs': { icon: SiReact, color: '#61dafb' },
    'react native': { icon: SiReact, color: '#61dafb' },
    nextjs: { icon: SiNextdotjs, color: '#ffffff' },
    'next.js': { icon: SiNextdotjs, color: '#ffffff' },
    tailwindcss: { icon: SiTailwindcss, color: '#06b6d4' },
    'tailwind css': { icon: SiTailwindcss, color: '#06b6d4' },
    'tailwind': { icon: SiTailwindcss, color: '#06b6d4' },
    prisma: { icon: SiPrisma, color: '#5a67d8' },
    supabase: { icon: SiSupabase, color: '#3fcf8e' },
    nodejs: { icon: SiNodedotjs, color: '#339933' },
    'node.js': { icon: SiNodedotjs, color: '#339933' },
    firebase: { icon: SiFirebase, color: '#ffca28' },
    mongodb: { icon: SiMongodb, color: '#47a248' },
    postgresql: { icon: SiPostgresql, color: '#4169e1' },
    postgres: { icon: SiPostgresql, color: '#4169e1' },
    docker: { icon: SiDocker, color: '#2496ed' },
    github: { icon: SiGithub, color: '#ffffff' },
    git: { icon: SiGithub, color: '#ffffff' },
    vercel: { icon: SiVercel, color: '#ffffff' },
    framer: { icon: SiFramer, color: '#0055ff' },
    'framer motion': { icon: SiFramer, color: '#0055ff' },
    gsap: { icon: SiGreensock, color: '#88ce02' },
    graphql: { icon: SiGraphql, color: '#e10098' },
    redis: { icon: SiRedis, color: '#dc382d' },
    stripe: { icon: SiStripe, color: '#008cdd' },
    python: { icon: SiPython, color: '#3776ab' },
    vue: { icon: SiVuedotjs, color: '#4fc08d' },
    angular: { icon: SiAngular, color: '#dd0031' },
    figma: { icon: SiFigma, color: '#f24e1e' },
    aws: { icon: SiAmazonwebservices, color: '#ff9900' },
    html: { icon: SiHtml5, color: '#E34F26' },
    css: { icon: SiCss3, color: '#1572B6' },
    sass: { icon: SiSass, color: '#CC6699' },
    scss: { icon: SiSass, color: '#CC6699' },
};

export default function ProjectHexCard({
    id,
    title,
    shortDesc,
    status,
    technologies = [],
    isSelected,
    onClick,
    viewDetailsText,
}: ProjectHexCardProps) {
    const hexRef = useRef<HTMLDivElement>(null);
    const { primaryRgb, theme } = useTheme();

    const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;

    useEffect(() => {
        if (!hexRef.current) return;
        if (isSelected) {
            gsap.to(hexRef.current, { scale: 1.05, duration: 0.4, ease: 'back.out(1.4)' });
        } else {
            gsap.to(hexRef.current, { scale: 1, duration: 0.3, ease: 'power2.out' });
        }
    }, [isSelected]);

    const handleMouseEnter = useCallback(() => {
        if (!hexRef.current || isSelected) return;
        gsap.to(hexRef.current, { scale: 1.02, duration: 0.25, ease: 'power2.out' });
    }, [isSelected]);

    const handleMouseLeave = useCallback(() => {
        if (!hexRef.current || isSelected) return;
        gsap.to(hexRef.current, { scale: 1, duration: 0.25, ease: 'power2.out' });
    }, [isSelected]);

    const displayTechs = technologies.slice(0, 4).map(techId => {
        const key = techId.toLowerCase().trim();
        const techData = TECH_MAP[key]
            || TECH_MAP[key.replace(/\./g, '')]
            || TECH_MAP[key.replace(/\s+/g, '-')]
            || TECH_MAP[key.replace(/\s+/g, '')];

        return {
            id: techId,
            Icon: techData?.icon,
            color: techData?.color || '#fff'
        };
    });

    const width = 200;
    const height = 230;

    return (
        <div
            ref={hexRef}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="relative cursor-pointer shrink-0 z-10"
            style={{ width, height }}
        >
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="absolute inset-0 w-full h-full drop-shadow-2xl"
                style={{ overflow: 'visible' }}
            >
                <defs>
                    <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                    <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(20, 20, 25, 0.95)" />
                        <stop offset="100%" stopColor="rgba(10, 10, 15, 0.98)" />
                    </linearGradient>
                </defs>

                <polygon
                    points="100,8 192,60 192,170 100,222 8,170 8,60"
                    fill={`url(#grad-${id})`}
                    stroke={isSelected ? primaryColor : 'rgba(255,255,255,0.1)'}
                    strokeWidth={isSelected ? 2 : 1}
                    filter={isSelected ? `url(#glow-${id})` : undefined}
                    className="transition-all duration-300"
                />

                <circle cx="100" cy="8" r="3" fill={primaryColor} className={isSelected ? "animate-pulse" : ""} />
                <circle cx="100" cy="8" r="8" fill={primaryColor} opacity="0.15" />

                <circle cx="100" cy="222" r="3" fill={primaryColor} className={isSelected ? "animate-pulse" : ""} />
                <circle cx="100" cy="222" r="8" fill={primaryColor} opacity="0.15" />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pt-8 pb-8 text-center pointer-events-none">

                <div
                    className="w-1.5 h-1.5 rounded-full mb-3 shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: STATUS_COLORS[status], color: STATUS_COLORS[status] }}
                />

                <h3
                    className="text-base font-light leading-5 mb-2 text-white transition-colors duration-300"
                    style={{
                        textShadow: isSelected ? `0 0 15px ${primaryColor}80` : 'none',
                        color: isSelected ? primaryColor : '#fff'
                    }}
                >
                    {title}
                </h3>

                <p className="text-[10px] text-white/50 line-clamp-2 mb-3 leading-relaxed max-w-[140px]">
                    {shortDesc || viewDetailsText}
                </p>

                <div className="flex items-center justify-center gap-1.5 mt-1 min-h-7">
                    {displayTechs.map((tech, i) => (
                        tech.Icon ? (
                            <div
                                key={i}
                                className="p-1 rounded-full bg-white/5 border border-white/5 backdrop-blur-sm shadow-sm transition-transform hover:scale-110"
                                title={tech.id}
                            >
                                <tech.Icon
                                    className="w-4 h-4 md:w-5 md:h-5 transition-colors"
                                    style={{ color: tech.color }}
                                />
                            </div>
                        ) : (
                            <div
                                key={i}
                                className="px-1.5 py-1 rounded-md bg-white/5 border border-white/5 text-[10px] text-white/50 font-medium uppercase"
                            >
                                {tech.id.substring(0, 2)}
                            </div>
                        )
                    ))}
                    {technologies.length > 4 && (
                        <span className="text-[9px] text-white/30 font-medium ml-0.5">
                            +{technologies.length - 4}
                        </span>
                    )}
                </div>

            </div>
        </div>
    );
}