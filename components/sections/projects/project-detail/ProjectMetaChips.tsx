import { HiCalendarDays, HiBuildingOffice2 } from 'react-icons/hi2';
import type { TranslatedProjects } from '@/lib/content/schema';
import type { ProjectWithTranslations } from '../ProjectCard';
import type { StatusStyle } from './types';

interface ProjectMetaChipsProps {
    translation: TranslatedProjects;
    project: ProjectWithTranslations;
    statusStyle: StatusStyle;
    timeline: string | null;
    primaryColor: string;
    size: 'sm' | 'lg';
}

export default function ProjectMetaChips({
    translation,
    project,
    statusStyle,
    timeline,
    primaryColor,
    size,
}: ProjectMetaChipsProps) {
    const baseText = size === 'sm' ? 'text-[11px]' : 'text-xs';

    return (
        <div className="flex flex-wrap gap-2">
            <span
                className={`px-2.5 py-0.5 rounded-full font-medium border border-border-subtle bg-muted/40 text-muted-foreground ${baseText}`}
            >
                {translation.typeLabels[project.type]}
            </span>
            <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium border border-transparent ${statusStyle.bg} ${statusStyle.text} ${baseText}`}
            >
                <span
                    className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} ${project.status === 'in-progress' ? 'animate-pulse' : ''
                        }`}
                />
                {translation.statusLabels[project.status]}
            </span>
            {timeline && (
                <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium border border-border-subtle text-foreground/80 ${baseText}`}
                >
                    <HiCalendarDays
                        className="w-3.5 h-3.5"
                        style={{ color: primaryColor }}
                    />
                    {timeline}
                </span>
            )}
            {project.client && (
                <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-medium border border-border-subtle text-foreground/80 ${baseText}`}
                >
                    <HiBuildingOffice2
                        className="w-3.5 h-3.5"
                        style={{ color: primaryColor }}
                    />
                    {project.client}
                </span>
            )}
        </div>
    );
}
