'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import Image from 'next/image';
import {
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiPrisma,
  SiSupabase,
  SiNodedotjs,
  SiFirebase,
  SiMongodb,
  SiPostgresql,
  SiDocker,
  SiGithub,
  SiVercel,
  SiFramer,
  SiGreensock,
  SiGraphql,
  SiRedis,
  SiStripe,
  SiPython,
  SiVuedotjs,
  SiAngular,
  SiFigma,
  SiAmazonwebservices,
} from 'react-icons/si';
import {
  HiArrowLongRight,
  HiArrowLongLeft,
  HiSparkles,
  HiRocketLaunch,
  HiCodeBracket,
  HiPhoto,
} from 'react-icons/hi2';
import { useTheme } from '@/components/ThemeProvider';
import type { LanguageCode, ProjectsContent, ProjectItem, ProjectStatus, ProjectType } from '@/lib/content/schema';

gsap.registerPlugin(ScrambleTextPlugin);

const TECH_MAP: Record<string, { icon: React.ComponentType<any>; color: string }> = {
  typescript: { icon: SiTypescript, color: '#3178c6' },
  javascript: { icon: SiJavascript, color: '#f7df1e' },
  react: { icon: SiReact, color: '#61dafb' },
  nextjs: { icon: SiNextdotjs, color: '#ffffff' },
  'next.js': { icon: SiNextdotjs, color: '#ffffff' },
  tailwindcss: { icon: SiTailwindcss, color: '#06b6d4' },
  'tailwind css': { icon: SiTailwindcss, color: '#06b6d4' },
  prisma: { icon: SiPrisma, color: '#5a67d8' },
  supabase: { icon: SiSupabase, color: '#3fcf8e' },
  nodejs: { icon: SiNodedotjs, color: '#339933' },
  'node.js': { icon: SiNodedotjs, color: '#339933' },
  firebase: { icon: SiFirebase, color: '#ffca28' },
  mongodb: { icon: SiMongodb, color: '#47a248' },
  postgresql: { icon: SiPostgresql, color: '#4169e1' },
  docker: { icon: SiDocker, color: '#2496ed' },
  github: { icon: SiGithub, color: '#ffffff' },
  vercel: { icon: SiVercel, color: '#ffffff' },
  framer: { icon: SiFramer, color: '#0055ff' },
  'framer motion': { icon: SiFramer, color: '#0055ff' },
  gsap: { icon: SiGreensock, color: '#88ce02' },
  graphql: { icon: SiGraphql, color: '#e10098' },
  redis: { icon: SiRedis, color: '#dc382d' },
  stripe: { icon: SiStripe, color: '#008cdd' },
  python: { icon: SiPython, color: '#3776ab' },
  vue: { icon: SiVuedotjs, color: '#4fc08d' },
  angular: { icon: SiAngular, color: '#dd0031' },
  figma: { icon: SiFigma, color: '#f24e1e' },
  aws: { icon: SiAmazonwebservices, color: '#ff9900' },
};

const i18n: Record<LanguageCode, {
  eyebrow: string;
  title: string;
  viewLive: string;
  viewCode: string;
  technologies: string;
  highlights: string;
  results: string;
  ongoing: string;
  featured: string;
  viewDetails: string;
  prev: string;
  next: string;
  status: Record<ProjectStatus, string>;
  type: Record<ProjectType, string>;
}> = {
  pt: {
    eyebrow: 'Portfolio',
    title: 'Projetos',
    viewLive: 'Ver projeto',
    viewCode: 'Ver código',
    technologies: 'Tecnologias',
    highlights: 'Destaques',
    results: 'Resultados',
    ongoing: 'Atual',
    featured: 'Destaque',
    viewDetails: 'Explorar projeto',
    prev: 'Anterior',
    next: 'Próximo',
    status: {
      completed: 'Concluído',
      'in-progress': 'Em desenvolvimento',
      archived: 'Arquivado',
      concept: 'Conceito',
    },
    type: {
      web: 'Web App',
      mobile: 'Mobile',
      desktop: 'Desktop',
      api: 'API',
      library: 'Biblioteca',
      saas: 'SaaS',
      ecommerce: 'E-commerce',
      portfolio: 'Portfolio',
      other: 'Outro',
    },
  },
  en: {
    eyebrow: 'Portfolio',
    title: 'Projects',
    viewLive: 'View live',
    viewCode: 'Source code',
    technologies: 'Technologies',
    highlights: 'Highlights',
    results: 'Results',
    ongoing: 'Ongoing',
    featured: 'Featured',
    viewDetails: 'Explore project',
    prev: 'Previous',
    next: 'Next',
    status: {
      completed: 'Completed',
      'in-progress': 'In development',
      archived: 'Archived',
      concept: 'Concept',
    },
    type: {
      web: 'Web App',
      mobile: 'Mobile',
      desktop: 'Desktop',
      api: 'API',
      library: 'Library',
      saas: 'SaaS',
      ecommerce: 'E-commerce',
      portfolio: 'Portfolio',
      other: 'Other',
    },
  },
  es: {
    eyebrow: 'Portafolio',
    title: 'Proyectos',
    viewLive: 'Ver en vivo',
    viewCode: 'Ver código',
    technologies: 'Tecnologías',
    highlights: 'Destacados',
    results: 'Resultados',
    ongoing: 'En curso',
    featured: 'Destacado',
    viewDetails: 'Explorar proyecto',
    prev: 'Anterior',
    next: 'Siguiente',
    status: {
      completed: 'Completado',
      'in-progress': 'En desarrollo',
      archived: 'Archivado',
      concept: 'Concepto',
    },
    type: {
      web: 'Web App',
      mobile: 'Móvil',
      desktop: 'Desktop',
      api: 'API',
      library: 'Biblioteca',
      saas: 'SaaS',
      ecommerce: 'E-commerce',
      portfolio: 'Portafolio',
      other: 'Otro',
    },
  },
  fr: {
    eyebrow: 'Portfolio',
    title: 'Projets',
    viewLive: 'Voir en ligne',
    viewCode: 'Code source',
    technologies: 'Technologies',
    highlights: 'Points forts',
    results: 'Résultats',
    ongoing: 'En cours',
    featured: 'Vedette',
    viewDetails: 'Explorer le projet',
    prev: 'Précédent',
    next: 'Suivant',
    status: {
      completed: 'Terminé',
      'in-progress': 'En développement',
      archived: 'Archivé',
      concept: 'Concept',
    },
    type: {
      web: 'App Web',
      mobile: 'Mobile',
      desktop: 'Desktop',
      api: 'API',
      library: 'Bibliothèque',
      saas: 'SaaS',
      ecommerce: 'E-commerce',
      portfolio: 'Portfolio',
      other: 'Autre',
    },
  },
};

type TranslatableLanguage = keyof ProjectsContent['translations'];
type ProjectWithTranslations = ProjectItem & {
  _title: string;
  _short: string;
  _desc: string;
  _highlights: string[];
};

interface ProjectsSectionProps {
  content: ProjectsContent;
  language: LanguageCode;
}

export default function ProjectsSection({ content, language }: ProjectsSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const projectTitleRef = useRef<HTMLHeadingElement>(null);

  const t = i18n[language] || i18n.pt;
  const { primaryRgb } = useTheme();
  const accent = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;

  const translationLanguage: TranslatableLanguage | null = language === 'pt' ? null : (language as TranslatableLanguage);
  const translation = translationLanguage ? content.translations[translationLanguage] : null;

  const projects = useMemo<ProjectWithTranslations[]>(() => {
    const sorted = [...content.projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return sorted.map((p, i): ProjectWithTranslations => {
      const tr = translation?.projects?.[i];
      return {
        ...p,
        _title: tr?.title || p.title,
        _short: tr?.shortDescription || p.shortDescription || '',
        _desc: tr?.description || p.description,
        _highlights: tr?.highlights || p.highlights || [],
      };
    });
  }, [content.projects, translation]);

  const currentProject = projects[activeIndex];

  const goTo = useCallback((index: number) => {
    if (isAnimating || index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setIsAnimating(true);
    setActiveIndex(index);
  }, [activeIndex, isAnimating]);

  const goNext = useCallback(() => {
    if (isAnimating) return;
    const next = activeIndex === projects.length - 1 ? 0 : activeIndex + 1;
    setDirection(1);
    setIsAnimating(true);
    setActiveIndex(next);
  }, [activeIndex, projects.length, isAnimating]);

  const goPrev = useCallback(() => {
    if (isAnimating) return;
    const prev = activeIndex === 0 ? projects.length - 1 : activeIndex - 1;
    setDirection(-1);
    setIsAnimating(true);
    setActiveIndex(prev);
  }, [activeIndex, projects.length, isAnimating]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goPrev]);

  useEffect(() => {
    if (projectTitleRef.current && currentProject) {
      gsap.fromTo(projectTitleRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          scrambleText: {
            text: currentProject._title,
            chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            revealDelay: 0.1,
            speed: 0.5,
          },
        }
      );
    }
  }, [activeIndex, currentProject?._title]);

  if (projects.length === 0 || !currentProject) {
    return (
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="text-center">
          <HiCodeBracket className="w-20 h-20 mx-auto text-white/10 mb-4" />
          <p className="text-muted-foreground">Nenhum projeto cadastrado</p>
        </div>
      </section>
    );
  }

  const techs = currentProject.technologies?.length
    ? currentProject.technologies
    : currentProject.tags || [];

  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      <AnimatePresence mode="sync">
        <motion.div
          key={`bg-${activeIndex}`}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {currentProject.thumbnail ? (
            <Image
              src={currentProject.thumbnail}
              alt=""
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(ellipse at center, ${accent}15 0%, transparent 70%)`
              }}
            />
          )}
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/95 to-black/60" />
          <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black/40" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 min-h-screen flex flex-col">
        <nav className="w-full px-4 sm:px-8 lg:px-12 pt-6 pb-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: accent }}>
                  {t.eyebrow}
                </span>
                <h2 className="text-xl sm:text-2xl font-light text-white">
                  {t.title}
                </h2>
              </div>
              <div className="flex items-center gap-3 text-white/40">
                <span className="text-2xl font-light" style={{ color: accent }}>
                  {String(activeIndex + 1).padStart(2, '0')}
                </span>
                <span className="text-sm">/</span>
                <span className="text-sm">
                  {String(projects.length).padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                {projects.map((project, idx) => (
                  <button
                    key={project.id || idx}
                    onClick={() => goTo(idx)}
                    className={`relative shrink-0 px-5 py-3 rounded-xl transition-all duration-300 ${idx === activeIndex
                      ? 'bg-white/15 backdrop-blur-sm'
                      : 'bg-white/5 hover:bg-white/10'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      {project.featured && (
                        <HiSparkles
                          className="w-3.5 h-3.5 shrink-0"
                          style={{ color: accent }}
                        />
                      )}
                      <span className={`text-sm font-medium whitespace-nowrap transition-colors ${idx === activeIndex ? 'text-white' : 'text-white/60'
                        }`}>
                        {project._title}
                      </span>
                    </div>
                    {idx === activeIndex && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full"
                        style={{ backgroundColor: accent }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
              <div className="absolute right-0 top-0 bottom-3 w-20 bg-linear-to-l from-black to-transparent pointer-events-none" />
            </div>
          </div>
        </nav>

        <div className="flex-1 flex items-center px-4 sm:px-8 lg:px-12 py-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
              <AnimatePresence mode="wait" onExitComplete={() => setIsAnimating(false)}>
                <motion.div
                  key={`content-${activeIndex}`}
                  className="lg:col-span-3 space-y-6"
                  initial={{ opacity: 0, x: direction * 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -60 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {currentProject.featured && (
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{ backgroundColor: accent, color: '#000' }}
                      >
                        <HiSparkles className="w-3 h-3" />
                        {t.featured}
                      </span>
                    )}
                    <span className="px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-white/10 text-white/80 backdrop-blur-sm">
                      {t.type[currentProject.type]}
                    </span>
                    <StatusBadge status={currentProject.status} label={t.status[currentProject.status]} />
                  </div>

                  <h3
                    ref={projectTitleRef}
                    className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-white leading-[1.1]"
                  >
                    {currentProject._title}
                  </h3>

                  <p className="text-base sm:text-lg text-white/50 leading-relaxed max-w-2xl">
                    {currentProject._short || currentProject._desc}
                  </p>

                  {currentProject.metrics && currentProject.metrics.length > 0 && (
                    <div className="flex flex-wrap gap-8 py-2">
                      {currentProject.metrics.slice(0, 3).map((metric, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="text-center"
                        >
                          <p className="text-3xl sm:text-4xl font-light" style={{ color: accent }}>
                            {metric.value}
                          </p>
                          <p className="text-[10px] text-white/40 uppercase tracking-wider mt-1">
                            {metric.label}
                          </p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {techs.length > 0 && (
                    <motion.div
                      className="flex flex-wrap gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      {techs.slice(0, 6).map((tech, i) => (
                        <TechBadge key={i} name={tech} />
                      ))}
                      {techs.length > 6 && (
                        <span className="px-3 py-1.5 rounded-full text-xs bg-white/5 text-white/40 border border-white/10">
                          +{techs.length - 6}
                        </span>
                      )}
                    </motion.div>
                  )}

                  <motion.div
                    className="flex flex-wrap items-center gap-4 pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    {currentProject.demoUrl && (
                      <a
                        href={currentProject.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-black transition-all hover:scale-105 hover:shadow-lg"
                        style={{
                          backgroundColor: accent,
                          boxShadow: `0 0 30px ${accent}40`
                        }}
                      >
                        <HiRocketLaunch className="w-4 h-4" />
                        {t.viewLive}
                        <HiArrowLongRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </a>
                    )}
                    {currentProject.repoUrl && (
                      <a
                        href={currentProject.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium border border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all"
                      >
                        <SiGithub className="w-4 h-4" />
                        {t.viewCode}
                      </a>
                    )}
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              <AnimatePresence mode="wait">
                <motion.div
                  key={`preview-${activeIndex}`}
                  className="lg:col-span-2 relative"
                  initial={{ opacity: 0, scale: 0.9, x: direction * 100 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: direction * -100 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl">
                    {currentProject.thumbnail ? (
                      <Image
                        src={currentProject.thumbnail}
                        alt={currentProject._title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="w-24 h-24 rounded-2xl flex items-center justify-center"
                          style={{ backgroundColor: `${accent}20` }}
                        >
                          <HiCodeBracket className="w-12 h-12" style={{ color: accent }} />
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

                    {currentProject.images && currentProject.images.length > 0 && (
                      <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs">
                        <HiPhoto className="w-4 h-4" />
                        <span>+{currentProject.images.length} imagens</span>
                      </div>
                    )}
                  </div>

                  <div
                    className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl -z-10"
                    style={{ backgroundColor: accent }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-8 lg:px-12 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <button
                onClick={goPrev}
                disabled={isAnimating}
                className="group flex items-center gap-3 text-white/50 hover:text-white transition-all disabled:opacity-30"
              >
                <span
                  className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center transition-all group-hover:border-white/40 group-hover:scale-110"
                  style={{
                    boxShadow: 'inset 0 0 20px rgba(255,255,255,0.05)'
                  }}
                >
                  <HiArrowLongLeft className="w-6 h-6" />
                </span>
                <span className="text-sm font-medium hidden sm:block">{t.prev}</span>
              </button>

              <div className="flex items-center gap-3">
                {projects.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => goTo(idx)}
                    className="group relative p-2"
                  >
                    <span
                      className={`block rounded-full transition-all duration-500 ${idx === activeIndex
                        ? 'w-10 h-2'
                        : 'w-2 h-2 group-hover:w-4'
                        }`}
                      style={{
                        backgroundColor: idx === activeIndex ? accent : 'rgba(255,255,255,0.25)',
                        boxShadow: idx === activeIndex ? `0 0 15px ${accent}` : 'none'
                      }}
                    />
                  </button>
                ))}
              </div>

              <button
                onClick={goNext}
                disabled={isAnimating}
                className="group flex items-center gap-3 text-white/50 hover:text-white transition-all disabled:opacity-30"
              >
                <span className="text-sm font-medium hidden sm:block">{t.next}</span>
                <span
                  className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center transition-all group-hover:border-white/40 group-hover:scale-110"
                  style={{
                    boxShadow: 'inset 0 0 20px rgba(255,255,255,0.05)'
                  }}
                >
                  <HiArrowLongRight className="w-6 h-6" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 h-1 z-20"
        style={{ backgroundColor: accent }}
        initial={{ width: '0%' }}
        animate={{ width: `${((activeIndex + 1) / projects.length) * 100}%` }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      />
    </section>
  );
}

function TechBadge({ name }: { name: string }) {
  const key = name.toLowerCase().trim();
  const tech = TECH_MAP[key];
  const Icon = tech?.icon;
  const color = tech?.color || '#888';

  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-xs text-white/70">
      {Icon && <Icon className="w-3.5 h-3.5" style={{ color }} />}
      {name}
    </span>
  );
}

function StatusBadge({ status, label }: { status: ProjectStatus; label: string }) {
  const styles: Record<ProjectStatus, { bg: string; text: string; dot: string }> = {
    completed: { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400' },
    'in-progress': { bg: 'bg-blue-500/15', text: 'text-blue-400', dot: 'bg-blue-400' },
    archived: { bg: 'bg-gray-500/15', text: 'text-gray-400', dot: 'bg-gray-400' },
    concept: { bg: 'bg-purple-500/15', text: 'text-purple-400', dot: 'bg-purple-400' },
  };
  const s = styles[status];

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-wider backdrop-blur-sm ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${status === 'in-progress' ? 'animate-pulse' : ''}`} />
      {label}
    </span>
  );
}
