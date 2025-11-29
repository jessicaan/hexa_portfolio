'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
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
  HiArrowTopRightOnSquare,
  HiBuildingOffice2,
  HiCalendarDays,
  HiChevronDown,
  HiCodeBracket,
  HiSparkles,
  HiPhoto,
  HiDocumentText,
} from 'react-icons/hi2';
import { useTheme } from '@/components/theme/ThemeProvider';
import type { ProjectImage, ProjectItem, ProjectStatus, ProjectType, LanguageCode } from '@/lib/content/schema';

const i18n: Record<LanguageCode, {
  viewLive: string;
  viewCode: string;
  viewCaseStudy: string;
  technologies: string;
  highlights: string;
  client: string;
  period: string;
  readMore: string;
  readLess: string;
  status: Record<ProjectStatus, string>;
  type: Record<ProjectType, string>;
}> = {
  pt: {
    viewLive: 'Ver projeto',
    viewCode: 'Ver código',
    viewCaseStudy: 'Estudo de caso',
    technologies: 'Tecnologias',
    highlights: 'Destaques',
    client: 'Cliente',
    period: 'Período',
    readMore: 'Leia mais',
    readLess: 'Mostrar menos',
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
    viewLive: 'View live',
    viewCode: 'Source code',
    viewCaseStudy: 'Case study',
    technologies: 'Technologies',
    highlights: 'Highlights',
    client: 'Client',
    period: 'Period',
    readMore: 'Read more',
    readLess: 'Show less',
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
    viewLive: 'Ver en vivo',
    viewCode: 'Ver código',
    viewCaseStudy: 'Ver caso de estudio',
    technologies: 'Tecnologías',
    highlights: 'Destacados',
    client: 'Cliente',
    period: 'Período',
    readMore: 'Leer más',
    readLess: 'Mostrar menos',
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
    viewLive: 'Voir en ligne',
    viewCode: 'Code source',
    viewCaseStudy: "Voir l'étude de cas",
    technologies: 'Technologies',
    highlights: 'Points forts',
    client: 'Client',
    period: 'Période',
    readMore: 'Lire la suite',
    readLess: 'Moins',
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

const TECH_MAP: Record<string, { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string }> = {
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

export type ProjectWithTranslations = ProjectItem & {
  _title: string;
  _short: string;
  _desc: string;
  _highlights: string[];
  _images?: ProjectImage[];
};

interface ProjectCardProps {
  project: ProjectWithTranslations;
  language: LanguageCode;
}

export default function ProjectCard({ project, language }: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { primaryRgb } = useTheme();
  const accent = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;
  const t = i18n[language] || i18n.pt;

  const techs = project.technologies?.length ? project.technologies : project.tags || [];
  const galleryCount = project._images?.length ?? project.images?.length ?? 0;
  const hasDetails = project._desc || (project._highlights && project._highlights.length > 0);

  return (
    <motion.div
      layout
      className="relative flex flex-col rounded-2xl border border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden"
      style={{ '--accent-color': accent } as React.CSSProperties}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (project.order ?? 0) * 0.05 }}
    >
      <div className="relative aspect-video w-full overflow-hidden">
        {project.thumbnail ? (
          <Image
            src={project.thumbnail}
            alt={project._title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-white/5">
            <HiCodeBracket className="h-12 w-12 text-(--accent-color) opacity-50" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        {galleryCount > 0 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
            <HiPhoto className="h-4 w-4" />
            <span>{galleryCount + 1}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex-1">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h3 className="text-2xl font-bold tracking-tight text-white">{project._title}</h3>
            {project.featured && (
              <div className="shrink-0">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-(--accent-color)/10 px-3 py-1 text-xs font-medium text-(--accent-color)">
                  <HiSparkles className="h-3.5 w-3.5" />
                  Featured
                </span>
              </div>
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80">
              {t.type[project.type]}
            </span>
            <StatusBadge status={project.status} label={t.status[project.status]} />
          </div>

          <p className="mt-4 text-base leading-relaxed text-white/60">{project._short}</p>
        </div>

        <AnimatePresence>
          {isExpanded && hasDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="prose prose-invert prose-sm mt-6 text-white/60">
                <p>{project._desc}</p>
                {project._highlights && project._highlights.length > 0 && (
                  <>
                    <h4 className="mt-4 text-sm font-semibold text-white/80">{t.highlights}</h4>
                    <ul>
                      {project._highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 space-y-6">
          {(project.client || project.startDate) && (
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60">
              {project.client && (
                <div className="flex items-center gap-2">
                  <HiBuildingOffice2 className="h-4 w-4 text-(--accent-color)" />
                  <span>
                    {t.client}: <span className="font-medium text-white/80">{project.client}</span>
                  </span>
                </div>
              )}
              {(project.startDate || project.endDate) && (
                <div className="flex items-center gap-2">
                  <HiCalendarDays className="h-4 w-4 text-(--accent-color)" />
                  <span>
                    {t.period}: <span className="font-medium text-white/80">
                      {project.startDate} {project.endDate ? `- ${project.endDate}` : ''}
                    </span>
                  </span>
                </div>
              )}
            </div>
          )}

          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {project.metrics.map((metric, i) => (
                <div key={i} className="rounded-lg bg-white/5 p-3 text-center">
                  <p className="text-xl font-bold text-(--accent-color)">{metric.value}</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/50">{metric.label}</p>
                </div>
              ))}
            </div>
          )}

          {techs.length > 0 && (
            <div>
              <h4 className="mb-3 text-sm font-semibold text-white/80">{t.technologies}</h4>
              <div className="flex flex-wrap gap-2">
                {techs.map((tech) => (
                  <TechBadge key={tech} name={tech} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-(--accent-color) px-5 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.03]"
            >
              <HiArrowTopRightOnSquare className="h-4 w-4" />
              {t.viewLive}
            </a>
          )}
          <div className="flex flex-1 gap-4">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                <SiGithub className="h-4 w-4" />
                {t.viewCode}
              </a>
            )}
            {project.caseStudyUrl && (
              <a
                href={project.caseStudyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                <HiDocumentText className="h-4 w-4" />
                {t.viewCaseStudy}
              </a>
            )}
          </div>
        </div>

        {hasDetails && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="group flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white/60 transition-colors hover:text-white"
            >
              <span>{isExpanded ? t.readLess : t.readMore}</span>
              <HiChevronDown
                className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
              />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TechBadge({ name }: { name: string }) {
  const key = name.toLowerCase().trim();
  const tech = TECH_MAP[key];
  const Icon = tech?.icon;
  const color = tech?.color || '#888';

  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/70">
      {Icon && <Icon className="h-3.5 w-3.5" style={{ color }} />}
      <span>{name}</span>
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
    <span className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`h-2 w-2 rounded-full ${s.dot} ${status === 'in-progress' ? 'animate-pulse' : ''}`} />
      <span>{label}</span>
    </span>
  );
}