import type { TranslatedProjects } from '@/lib/content/schema';

interface ProjectDescriptionProps {
    translation: TranslatedProjects;
    descriptionHtml: string;
}

export default function ProjectDescription({
    translation,
    descriptionHtml,
}: ProjectDescriptionProps) {
    return (
        <section>
            <p className="text-[11px] uppercase tracking-widest font-semibold text-muted-foreground">
                {translation.descriptionLabel}
            </p>
            <div
                className="mt-3 text-sm text-muted-foreground leading-relaxed space-y-3"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />
        </section>
    );
}
