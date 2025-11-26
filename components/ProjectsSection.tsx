'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import type { IconType } from 'react-icons';
import {
  SiNextdotjs,
  SiTypescript,
  SiFramer,
  SiReact,
  SiTailwindcss,
  SiGreensock,
  SiPrisma,
  SiSupabase,
  SiNodedotjs,
} from 'react-icons/si';
import { HiArrowRight, HiLink } from 'react-icons/hi2';
import { useTheme } from '@/components/ThemeProvider';

gsap.registerPlugin(ScrambleTextPlugin);

type LanguageCode = 'PT' | 'EN' | 'ES' | 'FR';

interface ProjectsSectionProps {
  language?: LanguageCode;
}

interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  role: string;
  year: string;
  techs: string[];
  link?: string;
}

const techIconMap: Record<string, IconType> = {
  'Next.js': SiNextdotjs,
  TypeScript: SiTypescript,
  GSAP: SiGreensock,
  'Framer Motion': SiFramer,
  React: SiReact,
  'Tailwind CSS': SiTailwindcss,
  Prisma: SiPrisma,
  Supabase: SiSupabase,
  'Node.js': SiNodedotjs,
};

const projects: Project[] = [
  {
    id: 'arkly',
    name: 'Arkly',
    tagline: 'Multi-tenant SaaS Platform',
    description: 'Master panel for creating and managing specialized vertical CRMs. Features role-based access control, internationalization, and sophisticated data relationships.',
    role: 'Full Stack Developer',
    year: '2024',
    techs: ['Next.js', 'TypeScript', 'Prisma', 'Supabase'],
  },
  {
    id: 'cleantrack',
    name: 'CleanTrack',
    tagline: 'Cleaning Service Management',
    description: 'Comprehensive platform with team management, scheduling systems, inspection workflows, and real-time messaging.',
    role: 'Full Stack Developer',
    year: '2024',
    techs: ['Next.js', 'TypeScript', 'Prisma', 'Tailwind CSS'],
  },
  {
    id: 'portfolio',
    name: 'This Portfolio',
    tagline: 'Immersive Experience',
    description: 'Hexagonal network navigation with cinematic transitions, reactive backgrounds, and multi-language support.',
    role: 'Design & Development',
    year: '2024',
    techs: ['Next.js', 'GSAP', 'Framer Motion', 'TypeScript'],
  },
  {
    id: 'realestate',
    name: 'Real Estate CRM',
    tagline: 'Construction Sales Platform',
    description: 'Property management system with sales tracking, unit inventory control, and comprehensive lead management.',
    role: 'Frontend Developer',
    year: '2023',
    techs: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
  },
];

const sectionCopy: Record<LanguageCode, {
  eyebrow: string;
  title: string;
  subtitle: string;
  viewProject: string;
  techStack: string;
}> = {
  PT: {
    eyebrow: 'Trabalhos',
    title: 'Projetos',
    subtitle: 'Uma seleção de trabalhos que representam minha jornada em criar experiências digitais.',
    viewProject: 'Ver projeto',
    techStack: 'Stack',
  },
  EN: {
    eyebrow: 'Work',
    title: 'Projects',
    subtitle: 'A selection of work that represents my journey in crafting digital experiences.',
    viewProject: 'View project',
    techStack: 'Stack',
  },
  ES: {
    eyebrow: 'Trabajos',
    title: 'Proyectos',
    subtitle: 'Una selección de trabajos que representan mi viaje en crear experiencias digitales.',
    viewProject: 'Ver proyecto',
    techStack: 'Stack',
  },
  FR: {
    eyebrow: 'Travaux',
    title: 'Projets',
    subtitle: "Une sélection de travaux qui représentent mon parcours dans la création d'expériences digitales.",
    viewProject: 'Voir le projet',
    techStack: 'Stack',
  },
};

function ProjectCard({
  project,
  isActive,
  onHover,
  index,
  copy,
  primaryColor
}: {
  project: Project;
  isActive: boolean;
  onHover: () => void;
  index: number;
  copy: typeof sectionCopy['EN'];
  primaryColor: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    x.set((e.clientX - centerX) * 0.05);
    y.set((e.clientY - centerY) * 0.05);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  useEffect(() => {
    if (isActive && nameRef.current) {
      gsap.fromTo(nameRef.current,
        { opacity: 0.7 },
        {
          opacity: 1,
          duration: 0.4,
          scrambleText: {
            text: project.name,
            chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            revealDelay: 0.2,
            speed: 0.5,
          },
        }
      );
    }
  }, [isActive, project.name]);

  return (
    <motion.div
      ref={cardRef}
      className="relative group cursor-pointer"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={onHover}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springX,
        y: springY,
      }}
    >
      <motion.div
        className="absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${primaryColor}30 0%, transparent 50%, ${primaryColor}20 100%)`,
        }}
      />

      <div className="relative rounded-2xl border border-border-subtle bg-surface-soft/80 backdrop-blur-sm overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: primaryColor }}
        />

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <motion.span
                className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground-subtle"
                animate={{ opacity: isActive ? 1 : 0.6 }}
              >
                {project.year} — {project.role}
              </motion.span>
              <h3
                ref={nameRef}
                className="text-2xl sm:text-3xl font-light tracking-tight text-foreground mt-1"
              >
                {project.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{project.tagline}</p>
            </div>

            <motion.div
              className="w-10 h-10 rounded-full border border-border-subtle flex items-center justify-center"
              animate={{
                borderColor: isActive ? primaryColor : 'hsl(var(--border-subtle))',
                scale: isActive ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                animate={{ x: isActive ? 2 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <HiArrowRight
                  className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors"
                />
              </motion.div>
            </motion.div>
          </div>

          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {project.description}
                </p>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[9px] tracking-[0.2em] uppercase text-muted-foreground-subtle">
                    {copy.techStack}
                  </span>
                  <div className="h-px flex-1 bg-border-subtle" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.techs.map(tech => {
                    const Icon = techIconMap[tech];
                    return (
                      <span
                        key={tech}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface text-[10px] tracking-[0.15em] uppercase text-muted-foreground border border-border-subtle"
                      >
                        {Icon && <Icon className="w-3.5 h-3.5" style={{ color: primaryColor }} />}
                        {tech}
                      </span>
                    );
                  })}
                </div>

                {project.link && (
                  <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-5 text-xs tracking-[0.15em] uppercase hover:text-foreground transition-colors"
                    style={{ color: primaryColor }}
                    whileHover={{ x: 4 }}
                  >
                    {copy.viewProject}
                    <HiLink className="w-3.5 h-3.5" />
                  </motion.a>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          className="absolute bottom-0 left-0 w-full h-px"
          style={{ backgroundColor: primaryColor }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isActive ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </motion.div>
  );
}

export default function ProjectsSection({ language = 'EN' }: ProjectsSectionProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const copy = sectionCopy[language];

  const { primaryRgb } = useTheme();
  const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;

  useEffect(() => {
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.2,
          delay: 0.3,
          scrambleText: {
            text: copy.title,
            chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            revealDelay: 0.4,
            speed: 0.3,
          },
        }
      );
    }
  }, [copy.title]);

  return (
    <div className="relative w-full min-h-screen py-16 sm:py-24 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 sm:mb-20"
        >
          <span className="text-[10px] tracking-[0.4em] uppercase text-muted-foreground-subtle">
            {copy.eyebrow}
          </span>

          <h2
            ref={titleRef}
            className="text-5xl sm:text-6xl md:text-7xl font-extralight tracking-tight text-foreground mt-3"
          >
            {copy.title}
          </h2>

          <div
            className="w-16 h-px mt-6"
            style={{ backgroundColor: `${primaryColor}66` }}
          />

          <p className="text-sm sm:text-base text-muted-foreground max-w-lg mt-6 leading-relaxed">
            {copy.subtitle}
          </p>
        </motion.header>

        <div className="space-y-4 sm:space-y-6">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              isActive={activeId === project.id}
              onHover={() => setActiveId(project.id)}
              index={index}
              copy={copy}
              primaryColor={primaryColor}
            />
          ))}
        </div>

        <motion.div
          className="flex justify-center gap-2 mt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {projects.map((project) => (
            <motion.button
              key={project.id}
              onClick={() => setActiveId(project.id)}
              className="w-2 h-2 rounded-full transition-colors"
              animate={{
                backgroundColor: activeId === project.id ? primaryColor : 'hsl(var(--muted-foreground-subtle))',
                scale: activeId === project.id ? 1.3 : 1,
              }}
              whileHover={{ scale: 1.4 }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}