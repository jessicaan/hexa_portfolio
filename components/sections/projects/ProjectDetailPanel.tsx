'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { getTechById, type Technology } from '@/lib/content/technologies';
import type { TranslatedProjects } from '@/lib/content/schema';
import ProjectDetailDesktop from './project-detail/ProjectDetailDesktop';
import ProjectDetailEmptyState from './project-detail/ProjectDetailEmptyState';
import ProjectDetailMobile from './project-detail/ProjectDetailMobile';
import { STATUS_STYLES } from './project-detail/constants';
import type {
    NavigationDirection,
    SharedDetailProps,
} from './project-detail/types';
import type { ProjectWithTranslations } from './ProjectCard';

export { STATUS_STYLES } from './project-detail/constants';

interface ProjectDetailPanelProps {
    project: ProjectWithTranslations | null;
    translation: TranslatedProjects;
    onClose?: () => void;
    onNavigate?: (direction: NavigationDirection) => void;
    currentIndex?: number;
    totalProjects?: number;
    isMobile?: boolean;
}

export default function ProjectDetailPanel({
    project,
    translation,
    onClose,
    onNavigate,
    currentIndex = 0,
    totalProjects = 0,
    isMobile = false,
}: ProjectDetailPanelProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const themeContext = useTheme();
    const primaryRgb = themeContext?.primaryRgb ?? { r: 255, g: 255, b: 255 };
    const theme = themeContext?.theme ?? 'dark';

    const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;
    const primaryColorBg = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`;
    const isDark = theme === 'dark';

    const allImages = project
        ? [
            { url: project.thumbnail, caption: project._title },
            ...(project._images?.map((img) => ({
                url: img.url,
                caption: img.description || '',
            })) || []),
        ].filter((img) => Boolean(img.url))
        : [];

    useEffect(() => {
        setCurrentImageIndex(0);
    }, [project?.id]);

    const nextImage = () =>
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    const prevImage = () =>
        setCurrentImageIndex(
            (prev) => (prev - 1 + allImages.length) % allImages.length,
        );

    const techIds = project?.technologies?.length
        ? project.technologies
        : project?.tags || [];
    const technologies: Technology[] = techIds
        .map((id) =>
            getTechById(id.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '')),
        )
        .filter((t): t is Technology => t !== undefined);

    const unknownTechs = techIds.filter((id) => {
        const normalized = id.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
        return !getTechById(normalized);
    });

    if (!project) {
        return (
            <ProjectDetailEmptyState translation={translation} isDark={isDark} />
        );
    }

    const statusStyle = STATUS_STYLES[project.status];
    const timeline =
        project.startDate || project.endDate
            ? [project.startDate, project.endDate].filter(Boolean).join(' - ')
            : null;
    const descriptionHtml = project._desc || project._short || '';
    const metrics = Array.isArray(project.metrics) ? project.metrics : [];

    const sharedProps: SharedDetailProps = {
        project,
        translation,
        statusStyle,
        timeline,
        descriptionHtml,
        metrics,
        technologies,
        unknownTechs,
        primaryColor,
    };

    if (isMobile) {
        return (
            <ProjectDetailMobile
                {...sharedProps}
                allImages={allImages}
                currentImageIndex={currentImageIndex}
                onPrevImage={prevImage}
                onNextImage={nextImage}
                onSelectImage={setCurrentImageIndex}
                primaryColorBg={primaryColorBg}
                onNavigate={onNavigate}
                currentIndex={currentIndex}
                totalProjects={totalProjects}
            />
        );
    }

    return (
        <ProjectDetailDesktop
            {...sharedProps}
            allImages={allImages}
            currentImageIndex={currentImageIndex}
            onPrevImage={prevImage}
            onNextImage={nextImage}
            onSelectImage={setCurrentImageIndex}
            primaryColorBg={primaryColorBg}
            isDark={isDark}
            onClose={onClose}
        />
    );
}
