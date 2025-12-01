import type { Technology } from '@/lib/content/technologies';
import type { TranslatedProjects } from '@/lib/content/schema';
import type { ProjectWithTranslations } from '../ProjectCard';

export type NavigationDirection = 'prev' | 'next';

export interface StatusStyle {
    bg: string;
    text: string;
    dot: string;
}

export type ProjectMetric = NonNullable<ProjectWithTranslations['metrics']>[number];

export interface ProjectDetailImage {
    url: string;
    caption: string;
}

export interface SharedDetailProps {
    project: ProjectWithTranslations;
    translation: TranslatedProjects;
    statusStyle: StatusStyle;
    timeline: string | null;
    descriptionHtml: string;
    metrics: ProjectMetric[];
    technologies: Technology[];
    unknownTechs: string[];
    primaryColor: string;
}

export interface ProjectDetailMobileProps extends SharedDetailProps {
    allImages: ProjectDetailImage[];
    currentImageIndex: number;
    onPrevImage: () => void;
    onNextImage: () => void;
    onSelectImage: (index: number) => void;
    primaryColorBg: string;
    onNavigate?: (direction: NavigationDirection) => void;
    currentIndex: number;
    totalProjects: number;
}

export interface ProjectDetailDesktopProps extends SharedDetailProps {
    allImages: ProjectDetailImage[];
    currentImageIndex: number;
    onPrevImage: () => void;
    onNextImage: () => void;
    onSelectImage: (index: number) => void;
    primaryColorBg: string;
    isDark: boolean;
    onClose?: () => void;
}
