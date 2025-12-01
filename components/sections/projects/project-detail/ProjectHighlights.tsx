import type { TranslatedProjects } from '@/lib/content/schema';
import type { ProjectWithTranslations } from '../ProjectCard';

interface ProjectHighlightsProps {
    translation: TranslatedProjects;
    project: ProjectWithTranslations;
    primaryColor: string;
}

export default function ProjectHighlights({
    translation,
    project,
    primaryColor,
}: ProjectHighlightsProps) {
    if (!project._highlights || project._highlights.length === 0) {
        return null;
    }

    return (
        <section>
            <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground">
                {translation.highlightsLabel}
            </p>
            <ul className="mt-3 space-y-2">
                {project._highlights.map((highlight, idx) => (
                    <li
                        key={idx}
                        className="flex items-start gap-3 rounded-xl border border-border-subtle/80 bg-background/60 px-3 py-2 text-sm text-foreground/80"
                    >
                        <span
                            className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: primaryColor }}
                        />
                        <span>{highlight}</span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
