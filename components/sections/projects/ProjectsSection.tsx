'use client';

import { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/theme/ThemeProvider';
import ReactiveGridBackground from '@/components/background/ReactiveGridBackground';
import { loadProjectsContent } from '@/lib/content/client';
import { defaultProjectsContent, type LanguageCode, type ProjectImage, type ProjectsContent } from '@/lib/content/schema';
import ProjectHexGallery from './ProjectHexGallery';
import ProjectDetailPanel, { STATUS_STYLES } from './ProjectDetailPanel';
import type { ProjectWithTranslations } from './ProjectCard';
import { useTranslation } from 'react-i18next';

interface ProjectsSectionProps { }

export default function ProjectsSection({ }: ProjectsSectionProps) {
  const { i18n } = useTranslation();
  const { primaryRgb } = useTheme();
  const language = i18n.language as LanguageCode;
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const [content, setContent] = useState<ProjectsContent>(defaultProjectsContent);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [shockwave, setShockwave] = useState<{ position: { x: number; y: number } } | null>(null);

  const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;
  const primaryGradient = `linear-gradient(135deg, rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.12), rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.3))`;
  const primaryGlow = `0 30px 60px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.22)`;

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

  const selectedIndex = useMemo(() => {
    return projects.findIndex((p) => p.id === selectedId);
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

  useEffect(() => {
    if (isMobile && mobileScrollRef.current && selectedIndex >= 0) {
      const container = mobileScrollRef.current;
      const buttons = container.querySelectorAll('[data-project-button]');
      const targetButton = buttons[selectedIndex] as HTMLElement;

      if (targetButton) {
        const containerRect = container.getBoundingClientRect();
        const buttonRect = targetButton.getBoundingClientRect();
        const scrollLeft = targetButton.offsetLeft - (containerRect.width / 2) + (buttonRect.width / 2);

        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex, isMobile]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleClosePanel = () => {
    setSelectedId(null);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    const currentIndex = projects.findIndex(p => p.id === selectedId);
    if (currentIndex === -1) return;

    let newIndex: number;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    }

    setSelectedId(projects[newIndex].id);
  };

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

      <div className="relative z-10 w-full h-full overflow-hidden flex flex-col">
        <div className="max-w-[1800px] w-full mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 pt-6 lg:pt-12 flex flex-col h-full">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 lg:mb-10 shrink-0"
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground mb-1 lg:mb-2">
              {translation.eyebrow}
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-semibold tracking-tight text-foreground">
              {translation.title}
            </h1>
            {content.summary && (
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed lg:hidden">
                {content.summary}
              </p>
            )}
            {content.summary && (
              <p className="hidden lg:block mt-3 text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {content.summary}
              </p>
            )}
          </motion.div>

          <div className="lg:hidden flex flex-col flex-1 min-h-0 gap-3">
            <div className="shrink-0 -mx-4 sm:-mx-6">
              <div
                ref={mobileScrollRef}
                className="overflow-x-auto scrollbar-none px-4 sm:px-6"
              >
                <div className="flex flex-nowrap gap-1.5 pb-2">
                  {projects.map((project, index) => {
                    const isSelected = selectedId === project.id;
                    const statusTone = STATUS_STYLES[project.status];

                    return (
                      <motion.button
                        key={project.id}
                        type="button"
                        data-project-button
                        onClick={() => handleSelect(project.id)}
                        layout
                        whileTap={{ scale: 0.97 }}
                        className="relative shrink-0 w-[180px] rounded-lg border border-border-subtle/60 bg-background/70 px-2.5 py-1.5 text-left transition-all duration-300"
                        style={{
                          background: isSelected ? primaryGradient : undefined,
                          borderColor: isSelected ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.4)` : undefined,
                          boxShadow: isSelected ? primaryGlow : undefined,
                        }}
                        aria-pressed={isSelected}
                      >
                        <div className="flex items-center justify-between gap-2.5">
                          <p className={`text-xs font-semibold ${isSelected ? 'text-foreground' : 'text-foreground/80'}`}>
                            {project._title}
                          </p>
                          <span className="text-[10px] font-semibold tracking-[0.35em] text-foreground/40">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[8px] uppercase tracking-[0.35em] text-muted-foreground">
                          {translation.typeLabels[project.type]}
                        </p>
                        <div
                          className="mt-1 text-[10px] text-muted-foreground leading-relaxed max-h-8 overflow-hidden"
                          dangerouslySetInnerHTML={{ __html: project._short || project._desc || '' }}
                        />
                        <span className={`mt-1 inline-flex items-center gap-1.5 text-[9px] font-medium ${statusTone.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusTone.dot} ${project.status === 'in-progress' ? 'animate-pulse' : ''}`} />
                          {translation.statusLabels[project.status]}
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-center gap-1 mt-1 px-4">
                {projects.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-300 ${index === selectedIndex
                      ? 'w-5'
                      : 'w-2 bg-muted-foreground/40'
                      }`}
                    style={{
                      backgroundColor: index === selectedIndex ? primaryColor : undefined
                    }}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {selectedId && selectedProject && (
                <motion.div
                  key={selectedId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="flex-1 min-h-0 pb-4"
                >
                  <ProjectDetailPanel
                    project={selectedProject}
                    onClose={handleClosePanel}
                    onNavigate={handleNavigate}
                    currentIndex={selectedIndex}
                    totalProjects={projects.length}
                    isMobile
                    translation={translation}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="hidden lg:grid lg:grid-cols-12 gap-8 xl:gap-12 flex-1 min-h-0 pb-12">
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
