import TechBadge from '@/components/TechBadge';
import type { Technology } from '@/lib/content/technologies';
import type { TranslatedProjects } from '@/lib/content/schema';

interface ProjectTechnologiesProps {
    translation: TranslatedProjects;
    technologies: Technology[];
    unknownTechs: string[];
}

export default function ProjectTechnologies({
    translation,
    technologies,
    unknownTechs,
}: ProjectTechnologiesProps) {
    if (technologies.length === 0 && unknownTechs.length === 0) {
        return null;
    }

    return (
        <section>
            <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground">
                {translation.technologiesLabel}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
                {technologies.map((tech) => (
                    <TechBadge key={tech.id} tech={tech} size="sm" />
                ))}
                {unknownTechs.map((tech) => (
                    <span
                        key={tech}
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border border-border-subtle bg-background/60 text-muted-foreground"
                    >
                        {tech}
                    </span>
                ))}
            </div>
        </section>
    );
}
