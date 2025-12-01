'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/theme/ThemeProvider';
import ReactiveGridBackground from '@/components/background/ReactiveGridBackground';
import { loadProjectsContent } from '@/lib/content/client';
import { defaultProjectsContent, type LanguageCode, type ProjectImage, type ProjectsContent } from '@/lib/content/schema';
import ProjectHexGallery from './ProjectHexGallery';
import ProjectDetailPanel from './ProjectDetailPanel';
import type { ProjectWithTranslations } from './ProjectCard';
import { useTranslation } from 'react-i18next';


interface ProjectsSectionProps { }

export default function ProjectsSection({ }: ProjectsSectionProps) {
  const { i18n } = useTranslation();
  const { primaryRgb } = useTheme();
  const language = i18n.language as LanguageCode;

  const [content, setContent] = useState<ProjectsContent>(defaultProjectsContent);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [shockwave, setShockwave] = useState<{ position: { x: number; y: number } } | null>(null);

  const translation = useMemo(() => {
    return content.translations[language] || content.translations['en'];
  }, [content.translations, language]);

  const projects = useMemo<ProjectWithTranslations[]>(() => {
    const sorted = [...content.projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return sorted.map((p): ProjectWithTranslations => {
      const tr = translation?.projects?.find(t => t.id === p.id);
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
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  const handleShockwave = useCallback((position: { x: number; y: number }) => {
    setShockwave({ position });
  }, []);

  useEffect(() => {
    if (shockwave) {
      setTimeout(() => setShockwave(null), 50);
    }
  }, [shockwave]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await loadProjectsContent();
        setContent(data);
      } catch (error) {
        console.error("Failed to load projects content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (projects.length > 0 && !selectedId) {
      setSelectedId(projects[0].id);
    }
  }, [projects, selectedId]);

  if (loading) {
    return (
      <main className="relative w-screen h-screen overflow-hidden">
        <ReactiveGridBackground />
        <div className="relative z-10 flex items-center justify-center w-full h-full px-6 text-center">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="relative w-screen h-screen overflow-hidden">
        <ReactiveGridBackground />
        <div className="relative z-10 flex items-center justify-center w-full h-full px-6 text-center">
          <p className="text-muted-foreground">Failed to load projects data.</p>
        </div>
      </main>
    );
  }

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
          <p className="text-muted-foreground">{translation.empty}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <ReactiveGridBackground shockwave={shockwave} />

      <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden lg:overflow-hidden">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 pt-8 pb-24 lg:pt-12 lg:pb-12 h-full flex flex-col">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 lg:mb-10 shrink-0"
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-2">
              {translation.eyebrow}
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground">
              {translation.title}
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
                        boxShadow: isSelected ? `0 0 20px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.3)` : undefined,
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
                    onClose={handleClosePanel}
                    isMobile
                    translation={translation}
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
                translation={translation}
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
                    onClose={handleClosePanel}
                    translation={translation}
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
