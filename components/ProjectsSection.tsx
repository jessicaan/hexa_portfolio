'use client';

import { useMemo } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import type { LanguageCode, ProjectImage, ProjectsContent } from '@/lib/content/schema';
import ProjectCard, { ProjectWithTranslations } from '@/components/ProjectCard';

const i18n: Record<LanguageCode, {
  eyebrow: string;
  title: string;
  empty: string;
}> = {
  pt: {
    eyebrow: 'Portfolio',
    title: 'Projetos Criativos',
    empty: 'Nenhum projeto cadastrado no momento. Volte em breve!',
  },
  en: {
    eyebrow: 'Portfolio',
    title: 'Creative Projects',
    empty: 'No projects listed at the moment. Check back soon!',
  },
  es: {
    eyebrow: 'Portafolio',
    title: 'Proyectos Creativos',
    empty: 'No hay proyectos listados por el momento. ¡Vuelve pronto!',
  },
  fr: {
    eyebrow: 'Portfolio',
    title: 'Projets créatifs',
    empty: 'Aucun projet répertorié pour le moment. Revenez bientôt !',
  },
};

interface ProjectsSectionProps {
  content: ProjectsContent;
  language: LanguageCode;
}

export default function ProjectsSection({ content, language }: ProjectsSectionProps) {
  const t = i18n[language] || i18n.pt;
  const { primaryRgb } = useTheme();
  const accent = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;

  const translationLanguage = language === 'pt' ? null : (language as keyof ProjectsContent['translations']);
  const translation = translationLanguage ? content.translations[translationLanguage] : null;

  const projects = useMemo<ProjectWithTranslations[]>(() => {
    const sorted = [...content.projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return sorted.map((p, i): ProjectWithTranslations => {
      const tr = translation?.projects?.[i];
      const baseImages = Array.isArray(p.images) ? p.images : [];
      const translatedImages = tr?.images;
      const mergedImages = baseImages.map((img, imgIndex) => ({
        ...img,
        description: translatedImages?.[imgIndex]?.description || img.description || '',
      })) as ProjectImage[];
      return {
        ...p,
        _title: tr?.title || p.title,
        _short: tr?.shortDescription || p.shortDescription || '',
        _desc: tr?.description || p.description,
        _highlights: tr?.highlights || p.highlights || [],
        _images: mergedImages,
      };
    });
  }, [content.projects, translation]);

  if (projects.length === 0) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gray-950 px-4">
        <div className="text-center">
          <p className="text-muted-foreground">{t.empty}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-gray-950 py-24 sm:py-32">
        <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{
                background: `radial-gradient(circle at 80% 20%, ${accent}10, transparent 40%)`
            }}
        />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <span className="text-base font-semibold leading-7" style={{ color: accent }}>
            {t.eyebrow}
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.title}
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            {content.summary}
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} language={language} />
          ))}
        </div>
      </div>
    </section>
  );
}
