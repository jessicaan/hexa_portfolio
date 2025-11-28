'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
    HiArrowTopRightOnSquare,
    HiBuildingOffice2,
    HiCalendarDays,
    HiChevronLeft,
    HiChevronRight,
    HiXMark,
} from 'react-icons/hi2';
import { SiGithub } from 'react-icons/si';
import { useTheme } from '@/components/ThemeProvider';
import type { ProjectStatus, ProjectType, LanguageCode } from '@/lib/content/schema';
import type { ProjectWithTranslations } from './ProjectCard';

const i18n: Record<LanguageCode, {
    viewLive: string;
    viewCode: string;
    technologies: string;
    highlights: string;
    client: string;
    period: string;
    noProject: string;
    selectProject: string;
    status: Record<ProjectStatus, string>;
    type: Record<ProjectType, string>;
}> = {
    pt: {
        viewLive: 'Ver projeto',
        viewCode: 'Ver código',
        technologies: 'Tecnologias',
        highlights: 'Destaques',
        client: 'Cliente',
        period: 'Período',
        noProject: 'Nenhum projeto selecionado',
        selectProject: 'Selecione um projeto na galeria',
        status: {
            completed: 'Concluído',
            'in-progress': 'Em desenvolvimento',
            archived: 'Arquivado',
            concept: 'Conceito',
        },
        type: {
            web: 'Web App',
            mobile: 'Mobile',
            desktop: 'Desktop',
            api: 'API',
            library: 'Biblioteca',
            saas: 'SaaS',
            ecommerce: 'E-commerce',
            portfolio: 'Portfolio',
            other: 'Outro',
        },
    },
    en: {
        viewLive: 'View live',
        viewCode: 'Source code',
        technologies: 'Technologies',
        highlights: 'Highlights',
        client: 'Client',
        period: 'Period',
        noProject: 'No project selected',
        selectProject: 'Select a project from the gallery',
        status: {
            completed: 'Completed',
            'in-progress': 'In development',
            archived: 'Archived',
            concept: 'Concept',
        },
        type: {
            web: 'Web App',
            mobile: 'Mobile',
            desktop: 'Desktop',
            api: 'API',
            library: 'Library',
            saas: 'SaaS',
            ecommerce: 'E-commerce',
            portfolio: 'Portfolio',
            other: 'Other',
        },
    },
    es: {
        viewLive: 'Ver en vivo',
        viewCode: 'Ver código',
        technologies: 'Tecnologías',
        highlights: 'Destacados',
        client: 'Cliente',
        period: 'Período',
        noProject: 'Ningún proyecto seleccionado',
        selectProject: 'Selecciona un proyecto de la galería',
        status: {
            completed: 'Completado',
            'in-progress': 'En desarrollo',
            archived: 'Archivado',
            concept: 'Concepto',
        },
        type: {
            web: 'Web App',
            mobile: 'Móvil',
            desktop: 'Desktop',
            api: 'API',
            library: 'Biblioteca',
            saas: 'SaaS',
            ecommerce: 'E-commerce',
            portfolio: 'Portafolio',
            other: 'Otro',
        },
    },
    fr: {
        viewLive: 'Voir en ligne',
        viewCode: 'Code source',
        technologies: 'Technologies',
        highlights: 'Points forts',
        client: 'Client',
        period: 'Période',
        noProject: 'Aucun projet sélectionné',
        selectProject: 'Sélectionnez un projet dans la galerie',
        status: {
            completed: 'Terminé',
            'in-progress': 'En développement',
            archived: 'Archivé',
            concept: 'Concept',
        },
        type: {
            web: 'App Web',
            mobile: 'Mobile',
            desktop: 'Desktop',
            api: 'API',
            library: 'Bibliothèque',
            saas: 'SaaS',
            ecommerce: 'E-commerce',
            portfolio: 'Portfolio',
            other: 'Autre',
        },
    },
};

const STATUS_STYLES: Record<ProjectStatus, { bg: string; text: string; dot: string }> = {
    completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    'in-progress': { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
    archived: { bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400' },
    concept: { bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'bg-purple-400' },
};

interface ProjectDetailPanelProps {
    project: ProjectWithTranslations | null;
    language: LanguageCode;
    onClose?: () => void;
    isMobile?: boolean;
}

export default function ProjectDetailPanel({
    project,
    language,
    onClose,
    isMobile = false,
}: ProjectDetailPanelProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { primaryRgb, theme } = useTheme();

    const t = i18n[language] || i18n.pt;
    const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;
    const isDark = theme === 'dark';

    const allImages = project ? [
        project.thumbnail,
        ...(project._images?.map(img => img.url) || project.images?.map(img => img.url) || [])
    ].filter(Boolean) : [];

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [project?.id]);

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

    const techs = project?.technologies?.length ? project.technologies : project?.tags || [];

    if (!project) {
        return (
            <div
                className="h-full flex items-center justify-center rounded-2xl border border-border-subtle backdrop-blur-md"
                style={{
                    background: isDark ? 'rgba(20, 20, 25, 0.7)' : 'rgba(255, 255, 255, 0.5)',
                    boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? 0.3 : 0.1})`,
                }}
            >
                <div className="text-center p-8">
                    <p className="text-base font-medium text-foreground mb-2">{t.noProject}</p>
                    <p className="text-sm text-muted-foreground">{t.selectProject}</p>
                </div>
            </div>
        );
    }

    const statusStyle = STATUS_STYLES[project.status];

    return (
        <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full flex flex-col rounded-2xl border border-border-subtle overflow-hidden backdrop-blur-md"
            style={{
                background: isDark ? 'rgba(20, 20, 25, 0.7)' : 'rgba(255, 255, 255, 0.5)',
                boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? 0.3 : 0.1})`,
            }}
        >
            {isMobile && onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-colors"
                >
                    <HiXMark className="w-5 h-5 text-white" />
                </button>
            )}

            <div className="relative w-full aspect-video shrink-0 overflow-hidden">
                {allImages.length > 0 ? (
                    <>
                        <Image
                            src={allImages[currentImageIndex] as string}
                            alt={project._title}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors backdrop-blur-sm"
                                >
                                    <HiChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors backdrop-blur-sm"
                                >
                                    <HiChevronRight className="w-5 h-5" />
                                </button>

                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                                    {allImages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/70'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </>
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: `linear-gradient(135deg, ${primaryColor}20, transparent)` }}
                    >
                        <p className="text-sm text-muted-foreground">Sem imagem</p>
                    </div>
                )}
            </div>

            <div
                className="flex-1 overflow-y-auto p-6"
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${primaryColor}30 transparent`,
                }}
            >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                    <h2 className="text-xl lg:text-2xl font-semibold text-foreground">
                        {project._title}
                    </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-5">
                    <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                        {t.type[project.type]}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} ${project.status === 'in-progress' ? 'animate-pulse' : ''}`} />
                        {t.status[project.status]}
                    </span>
                </div>

                {(project.client || project.startDate) && (
                    <div className="flex flex-wrap gap-x-5 gap-y-2 mb-5 text-sm text-muted-foreground">
                        {project.client && (
                            <div className="flex items-center gap-2">
                                <HiBuildingOffice2 className="w-4 h-4" style={{ color: primaryColor }} />
                                <span>{t.client}: <span className="font-medium text-foreground">{project.client}</span></span>
                            </div>
                        )}
                        {(project.startDate || project.endDate) && (
                            <div className="flex items-center gap-2">
                                <HiCalendarDays className="w-4 h-4" style={{ color: primaryColor }} />
                                <span>{t.period}: <span className="font-medium text-foreground">
                                    {project.startDate} {project.endDate ? `- ${project.endDate}` : ''}
                                </span></span>
                            </div>
                        )}
                    </div>
                )}

                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <span
                            className="h-0.5 w-8 rounded-full"
                            style={{ background: `linear-gradient(to right, ${primaryColor}, transparent)` }}
                        />
                        <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                            Descrição
                        </p>
                    </div>
                    <div
                        className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: project._desc || project._short }}
                    />
                </div>

                {project._highlights && project._highlights.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-3">
                            <span
                                className="h-0.5 w-8 rounded-full"
                                style={{ background: `linear-gradient(to right, ${primaryColor}, transparent)` }}
                            />
                            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                                {t.highlights}
                            </p>
                        </div>
                        <div className="space-y-2">
                            {project._highlights.map((highlight, idx) => (
                                <div
                                    key={idx}
                                    className="group rounded-lg border border-border-subtle p-3 relative overflow-hidden transition-all duration-300 hover:border-border"
                                    style={{
                                        background: isDark ? 'rgba(20, 20, 25, 0.5)' : 'rgba(255, 255, 255, 0.3)',
                                    }}
                                >
                                    <div
                                        className="absolute left-0 top-0 h-full w-0.5"
                                        style={{ background: `linear-gradient(to bottom, ${primaryColor}, transparent)` }}
                                    />
                                    <div className="relative flex items-start gap-2 pl-2">
                                        <div
                                            className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5"
                                            style={{ backgroundColor: primaryColor }}
                                        />
                                        <span className="text-sm text-foreground leading-relaxed">{highlight}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {techs.length > 0 && (
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-3">
                            <span
                                className="h-0.5 w-8 rounded-full"
                                style={{ background: `linear-gradient(to right, ${primaryColor}, transparent)` }}
                            />
                            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                                {t.technologies}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {techs.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border-subtle transition-colors hover:border-border"
                                    style={{
                                        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                                    }}
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border-subtle">
                    {project.demoUrl && (
                        <a
                            href={project.demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-[1.02]"
                            style={{ background: `linear-gradient(135deg, ${primaryColor}, hsl(var(--secondary)))` }}
                        >
                            <HiArrowTopRightOnSquare className="w-4 h-4" />
                            {t.viewLive}
                        </a>
                    )}
                    {project.repoUrl && (
                        <a
                            href={project.repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium border border-border-subtle bg-background/50 text-foreground transition-colors hover:bg-muted"
                        >
                            <SiGithub className="w-4 h-4" />
                            {t.viewCode}
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
}