import { HiArrowTopRightOnSquare } from 'react-icons/hi2';
import { SiGithub } from 'react-icons/si';
import type { TranslatedProjects } from '@/lib/content/schema';
import type { ProjectWithTranslations } from '../ProjectCard';

interface ProjectActionsProps {
    translation: TranslatedProjects;
    project: ProjectWithTranslations;
    primaryColor: string;
}

export default function ProjectActions({
    translation,
    project,
    primaryColor,
}: ProjectActionsProps) {
    if (!project.demoUrl && !project.repoUrl) {
        return null;
    }

    return (
        <section className="pt-2">
            <div className="flex flex-col gap-3 sm:flex-row">
                {project.demoUrl && (
                    <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20"
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
                        className="flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold bg-background border border-border-subtle text-foreground/80"
                    >
                        <SiGithub className="w-4 h-4" />
                        {translation.viewCode}
                    </a>
                )}
            </div>
        </section>
    );
}
