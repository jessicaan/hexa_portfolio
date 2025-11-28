'use client';

import { useRef, useEffect, useState, useMemo } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import ProjectHexCard from './ProjectHexCard';
import ProjectHexConnector from './ProjectHexConnector';
import type { ProjectWithTranslations } from './ProjectCard';

interface ProjectHexGalleryProps {
    projects: ProjectWithTranslations[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

const HEX_WIDTH = 200;
const HEX_HEIGHT = 230;
const VERTICAL_SPACING = 80;
const HORIZONTAL_OFFSET = 80;

export default function ProjectHexGallery({
    projects,
    selectedId,
    onSelect,
}: ProjectHexGalleryProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerHeight, setContainerHeight] = useState(0);
    const { primaryRgb } = useTheme();

    useEffect(() => {
        if (!containerRef.current) return;

        const updateHeight = () => {
            if (containerRef.current) {
                setContainerHeight(containerRef.current.offsetHeight);
            }
        };

        updateHeight();
        const observer = new ResizeObserver(updateHeight);
        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, []);

    const positions = useMemo(() => {
        return projects.map((_, index) => {
            const x = index % 2 === 0 ? 0 : HORIZONTAL_OFFSET;
            const y = index * (HEX_HEIGHT * 0.65 + VERTICAL_SPACING);
            return { x, y };
        });
    }, [projects.length]);

    const connections = useMemo(() => {
        return projects.slice(0, -1).map((_, index) => {
            const from = positions[index];
            const to = positions[index + 1];

            const fromCenterX = from.x + HEX_WIDTH / 2;
            const fromCenterY = from.y + HEX_HEIGHT / 2;
            const toCenterX = to.x + HEX_WIDTH / 2;
            const toCenterY = to.y + HEX_HEIGHT / 2;

            const fromBottomY = from.y + HEX_HEIGHT * 0.85;
            const toTopY = to.y + HEX_HEIGHT * 0.15;

            const startX = fromCenterX + (index % 2 === 0 ? HEX_WIDTH * 0.25 : -HEX_WIDTH * 0.25);
            const endX = toCenterX + (index % 2 === 0 ? -HEX_WIDTH * 0.25 : HEX_WIDTH * 0.25);

            return {
                start: { x: startX, y: fromBottomY },
                end: { x: endX, y: toTopY },
                isActive: selectedId === projects[index].id || selectedId === projects[index + 1]?.id,
            };
        });
    }, [positions, projects, selectedId]);

    const totalWidth = HEX_WIDTH + HORIZONTAL_OFFSET + 40;
    const totalHeight = positions.length > 0
        ? positions[positions.length - 1].y + HEX_HEIGHT + 40
        : 0;

    return (
        <div
            ref={containerRef}
            className="relative h-full overflow-y-auto overflow-x-hidden pr-2"
            style={{
                scrollbarWidth: 'thin',
                scrollbarColor: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.3) transparent`,
            }}
        >
            <div
                className="relative"
                style={{
                    width: totalWidth,
                    height: totalHeight,
                    minHeight: totalHeight,
                }}
            >
                <svg
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        width: totalWidth,
                        height: totalHeight,
                        overflow: 'visible',
                    }}
                >
                    {connections.map((conn, index) => (
                        <ProjectHexConnector
                            key={`conn-${index}`}
                            start={conn.start}
                            end={conn.end}
                            index={index}
                            isActive={conn.isActive}
                        />
                    ))}
                </svg>

                {projects.map((project, index) => {
                    const position = positions[index];
                    const techs = project.technologies?.length ? project.technologies : project.tags || [];

                    return (
                        <div
                            key={project.id}
                            className="absolute"
                            style={{
                                left: position.x,
                                top: position.y,
                            }}
                        >
                            <ProjectHexCard
                                id={project.id}
                                title={project._title}
                                thumbnail={project.thumbnail}
                                status={project.status}
                                technologies={techs}
                                isSelected={selectedId === project.id}
                                onClick={() => onSelect(project.id)}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}