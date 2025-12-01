import { HiBuildingOffice2, HiCalendarDays } from 'react-icons/hi2';
import type { TranslatedProjects } from '@/lib/content/schema';
import type { ProjectWithTranslations } from '../ProjectCard';
import type { ProjectMetric } from './types';

interface ProjectInfoGridProps {
    translation: TranslatedProjects;
    project: ProjectWithTranslations;
    metrics: ProjectMetric[];
    timeline: string | null;
    primaryColor: string;
}

export default function ProjectInfoGrid({
    translation,
    project,
    metrics,
    timeline,
    primaryColor,
}: ProjectInfoGridProps) {
    if (metrics.length === 0 && !project.client && !timeline) {
        return null;
    }

    return (
        <section>
            <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground">
                {translation.otherInfoLabel}
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {metrics.map((metric, idx) => (
                    <div
                        key={`${metric.label}-${idx}`}
                        className="rounded-xl border border-border-subtle bg-background/50 p-3"
                    >
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            {metric.label}
                        </p>
                        <p className="mt-1 text-lg font-semibold text-foreground">
                            {metric.value}
                        </p>
                    </div>
                ))}
                {project.client && (
                    <div className="rounded-xl border border-border-subtle bg-background/50 p-3">
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            {translation.clientLabel}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-sm font-medium text-foreground">
                            <HiBuildingOffice2
                                className="w-4 h-4"
                                style={{ color: primaryColor }}
                            />
                            {project.client}
                        </div>
                    </div>
                )}
                {timeline && (
                    <div className="rounded-xl border border-border-subtle bg-background/50 p-3">
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            {translation.periodLabel}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-sm font-medium text-foreground">
                            <HiCalendarDays
                                className="w-4 h-4"
                                style={{ color: primaryColor }}
                            />
                            {timeline}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
