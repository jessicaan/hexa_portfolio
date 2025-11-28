'use client';

import { useRef, useMemo } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import ProjectHexCard from './ProjectHexCard';
import ProjectHexConnector from './ProjectHexConnector';
import type { ProjectWithTranslations } from './ProjectCard';

interface ProjectHexGalleryProps {
    projects: ProjectWithTranslations[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    onShockwave?: (position: { x: number; y: number }) => void;
}

// Dimensões exatas do SVG do Card
const HEX_WIDTH = 200;
const HEX_HEIGHT = 230;

// Aumentado para garantir que o card de baixo comece DEPOIS que o de cima termina
const VERTICAL_SPACING = 260;
const HORIZONTAL_OFFSET = 100; // Deslocamento para o Zig-Zag

export default function ProjectHexGallery({
    projects,
    selectedId,
    onSelect,
    onShockwave,
}: ProjectHexGalleryProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { primaryRgb } = useTheme();

    // 1. Calcular Posições dos Cards (ZigZag)
    const positions = useMemo(() => {
        return projects.map((_, index) => {
            // Alterna esquerda/direita (0 ou 100px)
            const x = index % 2 === 0 ? 0 : HORIZONTAL_OFFSET;
            // Cada card desce VERTICAL_SPACING pixels
            const y = index * VERTICAL_SPACING;
            return { x, y };
        });
    }, [projects.length]);

    // 2. Calcular Linhas de Conexão
    const connections = useMemo(() => {
        return projects.slice(0, -1).map((_, index) => {
            const fromPos = positions[index];
            const toPos = positions[index + 1];

            // Ponto de Saída: Fundo do Card A (Centro X, Base Y)
            // O card tem 230px de altura, o "bico" inferior está em Y=222
            const startX = fromPos.x + (HEX_WIDTH / 2);
            const startY = fromPos.y + 222;

            // Ponto de Chegada: Topo do Card B (Centro X, Topo Y)
            // O "bico" superior está em Y=8
            const endX = toPos.x + (HEX_WIDTH / 2);
            const endY = toPos.y + 8;

            return {
                start: { x: startX, y: startY },
                end: { x: endX, y: endY },
                isActive: selectedId === projects[index].id || selectedId === projects[index + 1]?.id,
            };
        });
    }, [positions, projects, selectedId]);

    const totalWidth = HEX_WIDTH + HORIZONTAL_OFFSET + 40;
    const totalHeight = positions.length > 0
        ? positions[positions.length - 1].y + HEX_HEIGHT + 40
        : 0;

    const handleConnectorVibrate = (position: { x: number; y: number }) => {
        if (onShockwave && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            onShockwave({
                x: rect.left + position.x,
                y: rect.top + position.y,
            });
        }
    };

    return (
        <div
            ref={containerRef}
            className="relative h-full overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar"
            style={{
                scrollbarWidth: 'thin',
                scrollbarColor: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.3) transparent`,
            }}
        >
            <div
                className="relative mx-auto"
                style={{
                    width: totalWidth,
                    height: totalHeight,
                    minHeight: totalHeight,
                }}
            >
                {/* CAMADA 1: Conexões (Desenhadas atrás dos cards) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
                    {connections.map((conn, index) => (
                        <ProjectHexConnector
                            key={`conn-${index}`}
                            start={conn.start}
                            end={conn.end}
                            index={index}
                            isActive={conn.isActive}
                            onVibrate={handleConnectorVibrate}
                        />
                    ))}
                </svg>

                {/* CAMADA 2: Cards (Desenhados na frente) */}
                {projects.map((project, index) => {
                    const position = positions[index];
                    const techs = project.technologies?.length ? project.technologies : project.tags || [];

                    return (
                        <div
                            key={project.id}
                            className="absolute z-10" // Garante que o card fique SOBRE a linha
                            style={{
                                left: position.x,
                                top: position.y,
                                width: HEX_WIDTH,
                                height: HEX_HEIGHT,
                            }}
                        >
                            <ProjectHexCard
                                id={project.id}
                                title={project._title}
                                shortDesc={project._short}
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