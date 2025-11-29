'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiArrowTopRightOnSquare,
    HiBuildingOffice2,
    HiCalendarDays,
    HiChevronLeft,
    HiChevronRight,
    HiXMark,
} from 'react-icons/hi2';
import { SiGithub } from 'react-icons/si';
import { useTheme } from '@/components/theme/ThemeProvider';
import TechBadge from '@/components/TechBadge';
import { getTechById, type Technology } from '@/lib/content/technologies';
import type { ProjectStatus, ProjectType, LanguageCode, TranslatedProjects } from '@/lib/content/schema';
import type { ProjectWithTranslations } from './ProjectCard';

const STATUS_STYLES: Record<ProjectStatus, { bg: string; text: string; dot: string }> = {
    completed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    'in-progress': { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
    archived: { bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400' },
    concept: { bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'bg-purple-400' },
};

interface ProjectDetailPanelProps {
    project: ProjectWithTranslations | null;
    translation: TranslatedProjects;
    onClose?: () => void;
    isMobile?: boolean;
}

export default function ProjectDetailPanel({
    project,
    translation,
    onClose,
    isMobile = false,
}: ProjectDetailPanelProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const { primaryRgb, theme } = useTheme();

    const t = translation;
    const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;
    const primaryColorBg = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`;
    const isDark = theme === 'dark';

    const allImages = project ? [
        { url: project.thumbnail, caption: project._title },
        ...(project._images?.map(img => ({ url: img.url, caption: img.description || '' })) || [])
    ].filter(img => Boolean(img.url)) : [];

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [project?.id]);

    const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);

    const techIds = project?.technologies?.length ? project.technologies : project?.tags || [];
    const technologies: Technology[] = techIds
        .map(id => getTechById(id.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')))
        .filter((t): t is Technology => t !== undefined);

    const unknownTechs = techIds.filter(id => {
        const normalized = id.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
        return !getTechById(normalized);
    });

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
                    <p className="text-base font-medium text-foreground mb-2">{translation.noProjectSelected}</p>
                    <p className="text-sm text-muted-foreground">{translation.selectProjectFromGallery}</p>
                </div>
            </div>
        );
    }

    const statusStyle = STATUS_STYLES[project.status];
    const currentImage = allImages[currentImageIndex];

    return (
        <>
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                    height: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.3);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.5);
                }
            `}</style>

            <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="h-full flex flex-col rounded-2xl border border-border-subtle overflow-hidden backdrop-blur-md"
                style={{
                    background: 'transparent',
                    boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? 0.3 : 0.1})`,
                }}
            >
                <div
                    className="relative h-[50%] w-full aspect-video shrink-0 overflow-hidden flex flex-col group backdrop-blur-[2px]"
                    style={{ backgroundColor: primaryColorBg }}
                >
                    {isMobile && onClose && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm transition-colors text-white border border-white/10"
                        >
                            <HiXMark className="w-5 h-5" />
                        </button>
                    )}

                    <div className="flex-1 flex items-center justify-between w-full h-full relative px-2 sm:px-4 lg:px-8">

                        {/* Left Button (Outside Image) */}
                        {allImages.length > 1 && (
                            <button
                                onClick={prevImage}
                                className="z-10 p-2 lg:p-3 rounded-full bg-black/60 hover:bg-black/90 transition-all border border-white/10 backdrop-blur-sm group/btn"
                            >
                                <HiChevronLeft
                                    className="w-5 h-5 lg:w-6 lg:h-6 transition-transform group-hover/btn:-translate-x-0.5"
                                    style={{ color: primaryColor }}
                                />
                            </button>
                        )}

                        {/* Image Container */}
                        <div className="relative h-full w-full max-w-[85%] lg:max-w-[60%] flex items-center justify-center p-4">
                            {allImages.length > 0 ? (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentImageIndex}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="relative w-full h-full"
                                    >
                                        <Image
                                            src={currentImage?.url as string}
                                            alt={currentImage?.caption || project._title}
                                            fill
                                            className="object-contain drop-shadow-2xl"
                                            priority
                                        />
                                    </motion.div>
                                </AnimatePresence>
                            ) : (
                                <div className="flex items-center justify-center text-white/60">
                                    <p className="text-sm">{translation.noImageAvailable}</p>
                                </div>
                            )}
                        </div>

                        {/* Right Button (Outside Image) */}
                        {allImages.length > 1 && (
                            <button
                                onClick={nextImage}
                                className="z-10 p-2 lg:p-3 rounded-full bg-black/60 hover:bg-black/80 transition-all border border-white/10 backdrop-blur-sm group/btn"
                            >
                                <HiChevronRight
                                    className="w-5 h-5 lg:w-6 lg:h-6 transition-transform group-hover/btn:translate-x-0.5"
                                    style={{ color: primaryColor }}
                                />
                            </button>
                        )}
                    </div>

                    {/* Bottom Info: Caption & Dots (VISUAL LIMPO) */}
                    {allImages.length > 0 && (
                        <div className="w-full absolute bottom-0 left-0 flex flex-col items-center justify-end pointer-events-none pt-12 pb-6 bg-linear-to-t from-black/90 via-black/40 to-transparent">

                            {/* Image Caption */}
                            <motion.div
                                key={`caption-${currentImageIndex}`}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-4 px-8 text-center max-w-[90%]"
                            >
                                <p className="text-sm md:text-base text-white font-medium tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                    {currentImage?.caption}
                                </p>
                            </motion.div>

                            {/* Dots - Floating */}
                            {allImages.length > 1 && (
                                <div className="flex items-center gap-2 pointer-events-auto">
                                    {allImages.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`transition-all duration-300 rounded-full ${idx === currentImageIndex
                                                ? 'w-6 h-1.5 shadow-[0_0_8px_rgba(0,0,0,0.5)]'
                                                : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/80'
                                                }`}
                                            style={{
                                                backgroundColor: idx === currentImageIndex ? primaryColor : undefined
                                            }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* --- SECTION 2: CONTENT (BOTTOM) --- */}
                <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden custom-scrollbar bg-background/80 backdrop-blur-sm">

                    {/* Left Column: Description */}
                    <div className="w-full lg:w-3/4 p-6 lg:p-8 lg:h-full lg:overflow-y-auto custom-scrollbar lg:border-r border-border-subtle">
                        <div className="mb-6">
                            <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-3 leading-tight">
                                {project._title}
                            </h2>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-muted-foreground border border-border-subtle">
                                    {translation.typeLabels[project.type]}
                                </span>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-transparent ${statusStyle.bg} ${statusStyle.text}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} ${project.status === 'in-progress' ? 'animate-pulse' : ''}`} />
                                    {translation.statusLabels[project.status]}
                                </span>
                            </div>
                        </div>

                        <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="h-px w-8 bg-linear-to-r from-primary/50 to-transparent" />
                                <p className="text-xs uppercase tracking-widest font-semibold text-foreground/80">
                                    {translation.descriptionLabel}
                                </p>
                            </div>

                            <div
                                className="leading-relaxed space-y-4"
                                dangerouslySetInnerHTML={{ __html: project._desc || project._short }}
                            />

                            {project._highlights && project._highlights.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-border-subtle">
                                    <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                                        <span className="w-1 h-4 rounded-full bg-primary" style={{ backgroundColor: primaryColor }} />
                                        {translation.highlightsLabel}
                                    </h3>
                                    <ul className="grid gap-3 sm:grid-cols-2">
                                        {project._highlights.map((highlight, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm p-3 rounded-lg bg-muted/30 border border-border-subtle">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: primaryColor }} />
                                                <span className="opacity-90">{highlight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Info & Techs */}
                    <div className="w-full lg:w-1/4 flex flex-col bg-muted/20 border-t lg:border-t-0 border-border-subtle">
                        <div className="flex-1 lg:overflow-y-auto custom-scrollbar flex flex-col">

                            {/* Technologies */}
                            <div className="p-6 border-b border-border-subtle">
                                <div className="flex items-center gap-2 mb-4">
                                    <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
                                        {translation.technologiesLabel}
                                    </p>                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {technologies.map((tech) => (
                                        <TechBadge key={tech.id} tech={tech} size="sm" />
                                    ))}
                                    {unknownTechs.map((tech) => (
                                        <span
                                            key={tech}
                                            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border border-border-subtle bg-background/50 text-muted-foreground"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Other Details */}
                            <div className="p-6 flex-1">
                                <div className="flex items-center gap-2 mb-4">
                                    <p className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">
                                        {translation.otherInfoLabel}
                                    </p>                                </div>

                                <div className="space-y-3">
                                    {(project.client || project.startDate) && (
                                        <div className="space-y-3 p-4 rounded-xl bg-background/50 border border-border-subtle">
                                            {project.client && (
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] text-muted-foreground uppercase">{translation.clientLabel}</span>
                                                    <div className="flex items-center gap-2 font-medium text-foreground text-sm">
                                                        <HiBuildingOffice2 className="w-4 h-4 text-primary" style={{ color: primaryColor }} />
                                                        {project.client}
                                                    </div>
                                                </div>
                                            )}
                                            {(project.startDate || project.endDate) && (
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-[10px] text-muted-foreground uppercase">{translation.periodLabel}</span>
                                                    <div className="flex items-center gap-2 font-medium text-foreground text-sm">
                                                        <HiCalendarDays className="w-4 h-4 text-primary" style={{ color: primaryColor }} />
                                                        <span>{project.startDate} {project.endDate ? `— ${project.endDate}` : ''}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-8 flex flex-col gap-3">
                                    {project.demoUrl && (
                                        <a
                                            href={project.demoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                                            style={{
                                                background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
                                            }}
                                        >
                                            <HiArrowTopRightOnSquare className="w-4 h-4" />
                                            {translation.viewLive}
                                        </a>
                                    )}
                                    {project.repoUrl && (
                                        <a
                                            href={project.repoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium bg-background border border-border-subtle hover:bg-muted/50 hover:border-border transition-all"
                                        >
                                            <SiGithub className="w-4 h-4" />
                                            {translation.viewCode}
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
}