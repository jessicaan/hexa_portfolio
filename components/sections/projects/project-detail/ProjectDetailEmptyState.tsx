import type { TranslatedProjects } from '@/lib/content/schema';

interface ProjectDetailEmptyStateProps {
    translation: TranslatedProjects;
    isDark: boolean;
}

export default function ProjectDetailEmptyState({
    translation,
    isDark,
}: ProjectDetailEmptyStateProps) {
    return (
        <div
            className="h-full flex items-center justify-center rounded-2xl border border-border-subtle backdrop-blur-md"
            style={{
                background: isDark
                    ? 'rgba(20, 20, 25, 0.7)'
                    : 'rgba(255, 255, 255, 0.5)',
                boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? 0.3 : 0.1})`,
            }}
        >
            <div className="text-center p-8">
                <p className="text-base font-medium text-foreground mb-2">
                    {translation.noProjectSelected}
                </p>
                <p className="text-sm text-muted-foreground">
                    {translation.selectProjectFromGallery}
                </p>
            </div>
        </div>
    );
}
