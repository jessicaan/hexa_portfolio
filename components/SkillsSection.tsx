'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactiveGridBackground from '@/components/Reactivegridbackground';
import type { IconType } from 'react-icons';
import {
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiFramer,
  SiGreensock,
  SiFigma,
  SiGit,
} from 'react-icons/si';

type LanguageCode = 'PT' | 'EN' | 'ES' | 'FR';

interface SkillsSectionProps {
  language?: LanguageCode;
}

type SkillLevel = 'advanced' | 'comfortable' | 'exploring';

interface SkillItem {
  name: string;
  level: SkillLevel;
  iconKey?: string;
}

interface SkillCategory {
  id: string;
  label: string;
  emphasis: string;
  description: string;
  skills: SkillItem[];
}

const skillIconMap: Record<string, IconType> = {
  TypeScript: SiTypescript,
  JavaScript: SiJavascript,
  React: SiReact,
  'Next.js': SiNextdotjs,
  'Tailwind CSS': SiTailwindcss,
  'Framer Motion': SiFramer,
  GSAP: SiGreensock,
  Figma: SiFigma,
  Git: SiGit,
};

const skillCategories: SkillCategory[] = [
  {
    id: 'frontend-craft',
    label: 'Frontend Craft',
    emphasis: 'Interfaces vivas e performáticas',
    description:
      'Construo interfaces focadas em sensação de fluidez, leitura confortável e respostas rápidas — do esqueleto de layout até as microinterações.',
    skills: [
      { name: 'TypeScript', level: 'advanced', iconKey: 'TypeScript' },
      { name: 'React', level: 'advanced', iconKey: 'React' },
      { name: 'Next.js', level: 'advanced', iconKey: 'Next.js' },
      { name: 'JavaScript', level: 'advanced', iconKey: 'JavaScript' },
    ],
  },
  {
    id: 'design-systems',
    label: 'Design Systems',
    emphasis: 'Coerência visual e semântica',
    description:
      'Trabalho com componentes reutilizáveis, tokens, hierarquia visual e acessibilidade para que cada tela pareça parte do mesmo universo.',
    skills: [
      { name: 'Tailwind CSS', level: 'advanced', iconKey: 'Tailwind CSS' },
      { name: 'Design tokens', level: 'comfortable' },
      { name: 'Component libraries', level: 'comfortable' },
      { name: 'A11y mindset', level: 'comfortable' },
    ],
  },
  {
    id: 'motion',
    label: 'Motion & Interactions',
    emphasis: 'Experiências que respondem ao usuário',
    description:
      'Uso animações para guiar atenção, explicar mudanças de estado e dar personalidade às interfaces, sem perder performance.',
    skills: [
      { name: 'Framer Motion', level: 'advanced', iconKey: 'Framer Motion' },
      { name: 'GSAP', level: 'advanced', iconKey: 'GSAP' },
      { name: 'Microinteractions', level: 'comfortable' },
      { name: 'Scroll storytelling', level: 'comfortable' },
    ],
  },
  {
    id: 'product',
    label: 'Product & Collaboration',
    emphasis: 'Do rascunho ao lançamento',
    description:
      'Gosto de participar de todo o ciclo: entender problema, prototipar, validar com pessoas reais e evoluir o produto em ciclos curtos.',
    skills: [
      { name: 'Figma', level: 'comfortable', iconKey: 'Figma' },
      { name: 'Prototipação rápida', level: 'comfortable' },
      { name: 'Git workflow', level: 'comfortable', iconKey: 'Git' },
      { name: 'Code reviews', level: 'comfortable' },
    ],
  },
];

const levelVisual: Record<SkillLevel, string> = {
  advanced: '100%',
  comfortable: '70%',
  exploring: '45%',
};

const skillsCopy: Record<
  LanguageCode,
  {
    eyebrow: string;
    title: string;
    description: string;
    legendTitle: string;
    levels: Record<SkillLevel, string>;
  }
> = {
  PT: {
    eyebrow: 'Skills',
    title: 'Pilha, craft e forma de pensar',
    description:
      'Mais do que listar tecnologias, aqui está como eu gosto de projetar e construir experiências digitais — da base técnica ao cuidado visual.',
    legendTitle: 'Nível de familiaridade',
    levels: {
      advanced: 'Avançado',
      comfortable: 'Confortável',
      exploring: 'Explorando',
    },
  },
  EN: {
    eyebrow: 'Skills',
    title: 'Stack, craft and mindset',
    description:
      'More than a list of technologies, this is how I like to design and build digital experiences — from technical foundation to visual polish.',
    legendTitle: 'Level of familiarity',
    levels: {
      advanced: 'Advanced',
      comfortable: 'Comfortable',
      exploring: 'Exploring',
    },
  },
  ES: {
    eyebrow: 'Skills',
    title: 'Stack, craft y forma de pensar',
    description:
      'Más que una lista de tecnologías, es cómo me gusta diseñar y construir experiencias digitales, de la base técnica al cuidado visual.',
    legendTitle: 'Nivel de familiaridad',
    levels: {
      advanced: 'Avanzado',
      comfortable: 'Cómodo',
      exploring: 'Explorando',
    },
  },
  FR: {
    eyebrow: 'Compétences',
    title: 'Stack, craft et manière de penser',
    description:
      'Plus qu’une liste de technologies, voici ma façon de concevoir et construire des expériences numériques, du socle technique au soin visuel.',
    legendTitle: 'Niveau de familiarité',
    levels: {
      advanced: 'Avancé',
      comfortable: 'À l’aise',
      exploring: 'En exploration',
    },
  },
};

export default function SkillsSection({ language = 'EN' }: SkillsSectionProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(skillCategories[0]?.id);
  const activeCategory =
    skillCategories.find(category => category.id === activeCategoryId) ?? skillCategories[0];

  const currentLanguage: LanguageCode = language ?? 'EN';
  const copy = skillsCopy[currentLanguage];

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
            {copy.eyebrow} · Stack
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-5">
            {copy.title}
          </h2>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-6">
            {copy.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            {activeCategory.skills.slice(0, 4).map(skill => {
              const Icon = skill.iconKey ? skillIconMap[skill.iconKey] : undefined;
              return (
                <span
                  key={skill.name}
                  className="px-3 py-1 rounded-full border border-white/15 bg-white/5 text-[10px] tracking-[0.18em] uppercase text-white/60 inline-flex items-center gap-1.5"
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{skill.name}</span>
                </span>
              );
            })}
          </div>

          <div className="mt-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/40 mb-2">
              {copy.legendTitle}
            </p>
            <div className="flex flex-wrap gap-3 text-[10px] text-white/50">
              {(['advanced', 'comfortable', 'exploring'] as SkillLevel[]).map(level => (
                <div key={level} className="flex items-center gap-2">
                  <div className="w-10 h-[3px] rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-[#9b5cff] to-[#5cd9ff]"
                      style={{ width: levelVisual[level] }}
                    />
                  </div>
                  <span className="tracking-[0.18em] uppercase">{copy.levels[level]}</span>
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-6 rounded-3xl border border-white/10 bg-white/5 shadow-[0_18px_60px_rgba(0,0,0,0.6)] backdrop-blur-md p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/40 mb-1">
                    {activeCategory.label}
                  </p>
                  <p className="text-sm sm:text-base text-white font-medium">
                    {activeCategory.emphasis}
                  </p>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-4">
                {activeCategory.description}
              </p>

              <div className="space-y-3">
                {activeCategory.skills.map(skill => {
                  const Icon = skill.iconKey ? skillIconMap[skill.iconKey] : undefined;
                  return (
                    <div
                      key={skill.name}
                      className="flex items-center justify-between gap-3 text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="w-4 h-4 text-[#9b5cff]" />}
                        <span className="text-white/90">{skill.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-[3px] rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full bg-linear-to-r from-[#9b5cff] to-[#5cd9ff]"
                            style={{ width: levelVisual[skill.level] }}
                          />
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-white/50">
                          {copy.levels[skill.level]}
                        </span>
                      </div>
                    </div>
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
            {currentLanguage === 'PT'
              ? 'Áreas de foco'
              : currentLanguage === 'ES'
              ? 'Áreas de foco'
              : currentLanguage === 'FR'
              ? "Axes d'attention"
              : 'Focus areas'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {skillCategories.map(category => {
              const isActive = category.id === activeCategoryId;

              return (
                <motion.button
                  key={category.id}
                  type="button"
                  onMouseEnter={() => setActiveCategoryId(category.id)}
                  onFocus={() => setActiveCategoryId(category.id)}
                  onClick={() => setActiveCategoryId(category.id)}
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
                        <p className="text-[11px] uppercase tracking-[0.28em] text-white/40 mb-1">
                          {category.label}
                        </p>
                        <p className="text-[11px] sm:text-xs text-white/60">
                          {category.emphasis}
                        </p>
                      </div>
                      <motion.span
                        className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-white/40"
                        animate={{
                          opacity: isActive ? 1 : 0.4,
                          y: isActive ? 0 : 2,
                        }}
                      >
                        {isActive
                          ? currentLanguage === 'PT'
                            ? 'AGORA'
                            : currentLanguage === 'ES'
                            ? 'AHORA'
                            : currentLanguage === 'FR'
                            ? 'ICI'
                            : 'NOW'
                          : currentLanguage === 'PT'
                          ? 'VER'
                          : currentLanguage === 'ES'
                          ? 'VER'
                          : currentLanguage === 'FR'
                          ? 'VOIR'
                          : 'VIEW'}
                      </motion.span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {category.skills.slice(0, 3).map(skill => {
                        const Icon = skill.iconKey ? skillIconMap[skill.iconKey] : undefined;
                        return (
                          <span
                            key={skill.name}
                            className="px-2 py-0.5 rounded-full bg-white/5 text-[9px] tracking-[0.15em] uppercase text-white/50 inline-flex items-center gap-1"
                          >
                            {Icon && <Icon className="w-3 h-3" />}
                            <span>{skill.name}</span>
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

