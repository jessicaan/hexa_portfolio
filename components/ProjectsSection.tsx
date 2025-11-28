'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import ReactiveGridBackground from '@/components/Reactivegridbackground';
import type { LanguageCode, ProjectImage, ProjectsContent } from '@/lib/content/schema';
import ProjectHexGallery from '@/components/ProjectHexGallery';
import ProjectDetailPanel from '@/components/ProjectDetailPanel';
import type { ProjectWithTranslations } from '@/components/ProjectCard';

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
  const { primaryRgb, theme } = useTheme();
  const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;
  const isDark = theme === 'dark';

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [shockwave, setShockwave] = useState<{ position: { x: number; y: number } } | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleShockwave = useCallback((position: { x: number; y: number }) => {
    setShockwave({ position });
  }, []);

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

  const selectedProject = useMemo(() => {
    return projects.find((p) => p.id === selectedId) || null;
  }, [projects, selectedId]);

  useEffect(() => {
    if (projects.length > 0 && !selectedId && !isMobile) {
      setSelectedId(projects[0].id);
    }
  }, [projects, selectedId, isMobile]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleClosePanel = () => {
    setSelectedId(null);
  };

  if (projects.length === 0) {
    return (
      <main className="relative w-screen h-screen overflow-hidden">
        <ReactiveGridBackground />
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <p className="text-muted-foreground">{t.empty}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <ReactiveGridBackground shockwave={shockwave} />

      <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden lg:overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 py-8 lg:py-12 h-full flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 lg:mb-10 shrink-0"
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-2">
              {t.eyebrow}
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
              {t.title}
            </h1>
            {content.summary && (
              <p className="mt-3 text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {content.summary}
              </p>
            )}
          </motion.div>

          <div className="lg:hidden flex-1 flex flex-col gap-6 min-h-0">
            <div className="shrink-0 overflow-x-auto pb-4">
              <div className="flex gap-4 px-1">
                {projects.map((project) => {
                  const techs = project.technologies?.length ? project.technologies : project.tags || [];
                  const isSelected = selectedId === project.id;

                  return (
                    <button
                      key={project.id}
                      onClick={() => handleSelect(project.id)}
                      className={`shrink-0 px-4 py-3 rounded-xl border transition-all ${isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border-subtle bg-background/50 hover:border-border'
                        }`}
                      style={{
                        boxShadow: isSelected ? `0 0 20px ${primaryColor}30` : undefined,
                      }}
                    >
                      <p className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                        {project._title}
                      </p>
                      {techs.length > 0 && (
                        <p className="text-[10px] text-muted-foreground mt-1 truncate max-w-[150px]">
                          {techs.slice(0, 2).join(' · ')}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {selectedId && selectedProject && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex-1 min-h-0"
                >
                  <ProjectDetailPanel
                    project={selectedProject}
                    language={language}
                    onClose={handleClosePanel}
                    isMobile
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden lg:grid lg:grid-cols-12 gap-8 xl:gap-12 flex-1 min-h-0">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-4 xl:col-span-3 h-full overflow-hidden"
            >
              <ProjectHexGallery
                projects={projects}
                selectedId={selectedId}
                onSelect={handleSelect}
                onShockwave={handleShockwave}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-8 xl:col-span-9 h-full overflow-hidden"
            >
              <AnimatePresence mode="wait">
                {selectedProject && (
                  <ProjectDetailPanel
                    key={selectedId || 'empty'}
                    project={selectedProject}
                    language={language}
                    onClose={handleClosePanel}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}