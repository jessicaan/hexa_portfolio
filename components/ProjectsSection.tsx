'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactiveGridBackground from '@/components/Reactivegridbackground';
import type { IconType } from 'react-icons';
import { SiNextdotjs, SiTypescript, SiFramer, SiReact, SiTailwindcss, SiGreensock } from 'react-icons/si';

type LanguageCode = 'PT' | 'EN' | 'ES' | 'FR';

interface ProjectsSectionProps {
  language?: LanguageCode;
}

interface Project {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  role: string;
  techs: string[];
}

const techIconMap: Record<string, IconType> = {
  'Next.js': SiNextdotjs,
  TypeScript: SiTypescript,
  GSAP: SiGreensock,
  'Framer Motion': SiFramer,
  React: SiReact,
  'Tailwind CSS': SiTailwindcss,
};

const projects: Project[] = [
  {
    id: 'immersive-portfolio',
    name: 'Immersive Portfolio',
    shortDescription: 'Navegação em rede hexagonal com transições cinematográficas.',
    longDescription:
      'Uma experiência de portfólio pensada como um playground interativo, unindo animações, microinterações e storytelling visual para apresentar seus projetos de forma memorável.',
    role: 'Product / Frontend',
    techs: ['Next.js', 'TypeScript', 'GSAP', 'Framer Motion'],
  },
  {
    id: 'creative-dashboard',
    name: 'Creative Dashboard',
    shortDescription: 'Painel com foco em microinterações e feedback visual.',
    longDescription:
      'Interface de dashboard com ênfase em estados, feedback instantâneo e sensação de fluidez, usando animações suaves e hierarquia visual clara para dados complexos.',
    role: 'UI / Frontend',
    techs: ['React', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    id: 'storytelling-landing',
    name: 'Storytelling Landing',
    shortDescription: 'Landing page narrativa com foco em scroll e ritmo.',
    longDescription:
      'Uma landing que se comporta como um pequeno filme interativo, usando seções coreografadas, transições entre blocos e elementos reativos ao movimento do usuário.',
    role: 'Experience Design',
    techs: ['Next.js', 'GSAP', 'Design System'],
  },
  {
    id: 'experimental-lab',
    name: 'Experimental Lab',
    shortDescription: 'Coleção de experimentos visuais e interativos.',
    longDescription:
      'Um espaço de experimentação para testar novas ideias de UI, animação e interação, antes de levá-las para produtos reais ou estudos de caso mais completos.',
    role: 'Exploration',
    techs: ['Canvas', 'Shaders', 'Prototyping'],
  },
];

const sectionCopy: Record<
  LanguageCode,
  {
    eyebrow: string;
    title: string;
    description: string;
    spotlightLabel: string;
    galleryLabel: string;
  }
> = {
  PT: {
    eyebrow: 'Galeria',
    title: 'Projetos em destaque',
    description:
      'Uma coleção de projetos pensados para explorar animação, narrativa e experiências digitais imersivas. Passe o mouse pelos cards para navegar pela galeria.',
    spotlightLabel: 'Projeto em foco',
    galleryLabel: 'Outros projetos da galeria',
  },
  EN: {
    eyebrow: 'Gallery',
    title: 'Featured projects',
    description:
      'A collection of projects designed to explore motion, storytelling and immersive digital experiences. Hover the cards to browse the gallery.',
    spotlightLabel: 'Project in focus',
    galleryLabel: 'Other projects in the gallery',
  },
  ES: {
    eyebrow: 'Galería',
    title: 'Proyectos destacados',
    description:
      'Una colección de proyectos pensados para explorar animación, narrativa y experiencias digitales inmersivas. Pasa el cursor sobre las tarjetas para navegar.',
    spotlightLabel: 'Proyecto en foco',
    galleryLabel: 'Otros proyectos de la galería',
  },
  FR: {
    eyebrow: 'Galerie',
    title: 'Projets en vedette',
    description:
      "Une collection de projets pensés pour explorer l'animation, la narration et les expériences numériques immersives. Survolez les cartes pour parcourir la galerie.",
    spotlightLabel: 'Projet en focus',
    galleryLabel: 'Autres projets de la galerie',
  },
};

export default function ProjectsSection({ language = 'EN' }: ProjectsSectionProps) {
  const [activeId, setActiveId] = useState<string>(projects[0]?.id);
  const activeProject = projects.find(p => p.id === activeId) ?? projects[0];
  const currentLanguage: LanguageCode = language ?? 'EN';
  const copy = sectionCopy[currentLanguage];

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <ReactiveGridBackground />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full h-full px-6 sm:px-10 gap-10 lg:gap-16">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl text-center lg:text-left text-white"
        >
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/50 mb-4">
            {copy.eyebrow} · Projects
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-5">
            {copy.title}
          </h2>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-6">
            {copy.description}
          </p>

          <span className="inline-flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#9b5cff]" />
            {copy.spotlightLabel}
          </span>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeProject.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-white/12 bg-white/5 bg-linear-to-b from-white/5 via-white/2 to-transparent shadow-[0_18px_60px_rgba(0,0,0,0.6)] backdrop-blur-md p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <h3 className="text-lg sm:text-xl font-medium">{activeProject.name}</h3>
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                  {activeProject.role}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white/70 mb-4">
                {activeProject.longDescription}
              </p>
              <div className="flex flex-wrap gap-2">
                {activeProject.techs.map(tech => {
                  const Icon = techIconMap[tech];
                  return (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full border border-white/15 bg-white/5 text-[10px] tracking-[0.12em] uppercase text-white/60 inline-flex items-center gap-1.5"
                    >
                      {Icon && <Icon className="w-3.5 h-3.5" />}
                      <span>{tech}</span>
                    </span>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-full max-w-xl"
        >
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/40 mb-3 text-center lg:text-left">
            {copy.galleryLabel}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {projects.map(project => {
              const isActive = project.id === activeId;

              return (
                <motion.button
                  key={project.id}
                  type="button"
                  onMouseEnter={() => setActiveId(project.id)}
                  onFocus={() => setActiveId(project.id)}
                  onClick={() => setActiveId(project.id)}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  className="relative group text-left"
                >
                  <motion.div
                    className="absolute -inset-0.5 rounded-2xl bg-linear-to-br from-[#9b5cff40] via-transparent to-[#5cd9ff40] opacity-0 group-hover:opacity-100"
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                  />

                  <div className="relative rounded-2xl border border-white/10 bg-[#04040a]/80 backdrop-blur-md px-4 py-4 sm:px-4 sm:py-4 shadow-[0_10px_40px_rgba(0,0,0,0.75)] overflow-hidden">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1">
                        <h4 className="text-sm sm:text-base font-medium text-white mb-1">
                          {project.name}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-white/60">
                          {project.shortDescription}
                        </p>
                      </div>
                      <motion.span
                        className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-white/40"
                        animate={{
                          opacity: isActive ? 1 : 0.4,
                          y: isActive ? 0 : 2,
                        }}
                      >
                        {isActive ? 'AGORA' : 'VER'}
                      </motion.span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {project.techs.slice(0, 3).map(tech => {
                        const IconSmall = techIconMap[tech];
                        return (
                          <span
                            key={tech}
                            className="px-2 py-0.5 rounded-full bg-white/5 text-[9px] tracking-[0.15em] uppercase text-white/50 inline-flex items-center gap-1"
                          >
                            {IconSmall && <IconSmall className="w-3 h-3" />}
                            <span>{tech}</span>
                          </span>
                        );
                      })}
                    </div>

                    <motion.div
                      className="absolute inset-px rounded-2xl border border-[#9b5cff] pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isActive ? 0.35 : 0 }}
                      transition={{ duration: 0.25 }}
                    />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.section>
      </div>
    </main>
  );
}
