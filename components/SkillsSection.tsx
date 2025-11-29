'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactiveGridBackground from '@/components/Reactivegridbackground';
import { useTheme } from '@/components/ThemeProvider';
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
import type { SkillsContent, SkillCategory, LanguageCode } from '@/lib/content/schema';
import { loadSkillsContent } from '@/lib/content/client';
import { useTranslation } from 'react-i18next';

interface SkillsSectionProps {}

type SkillLevel = 1 | 2 | 3 | 4 | 5;

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

const levelVisual: Record<SkillLevel, string> = {
  1: '20%',
  2: '40%',
  3: '60%',
  4: '80%',
  5: '100%',
};

const skillsCopy: Record<
  LanguageCode,
  {
    eyebrow: string;
    title: string;
    description: string;
    legendTitle: string;
    levels: Record<SkillLevel, string>;
    nowText: string;
    viewText: string;
  }
> = {
  pt: {
    eyebrow: 'Skills',
    title: 'Pilha, craft e forma de pensar',
    description:
      'Mais do que listar tecnologias, aqui está como eu gosto de projetar e construir experiências digitais – da base técnica ao cuidado visual.',
    legendTitle: 'Nível de familiaridade',
    levels: {
      1: 'Iniciante',
      2: 'Intermediário',
      3: 'Avançado',
      4: 'Expert',
      5: 'Mestre',
    },
    nowText: 'Atual',
    viewText: 'Ver',
  },
  en: {
    eyebrow: 'Skills',
    title: 'Stack, craft and mindset',
    description:
      'More than a list of technologies, this is how I like to design and build digital experiences – from technical foundation to visual polish.',
    legendTitle: 'Level of familiarity',
    levels: {
      1: 'Beginner',
      2: 'Intermediate',
      3: 'Advanced',
      4: 'Expert',
      5: 'Master',
    },
    nowText: 'Current',
    viewText: 'View',
  },
  es: {
    eyebrow: 'Skills',
    title: 'Stack, craft y forma de pensar',
    description:
      'Más que una lista de tecnologías, es como me gusta diseñar y construir experiencias digitales, de la base técnica al cuidado visual.',
    legendTitle: 'Nivel de familiaridad',
    levels: {
      1: 'Principiante',
      2: 'Intermedio',
      3: 'Avanzado',
      4: 'Experto',
      5: 'Maestro',
    },
    nowText: 'Actual',
    viewText: 'Ver',
  },
  fr: {
    eyebrow: 'Compétences',
    title: 'Stack, craft et manière de penser',
    description:
      "Plus qu'une liste de technologies, voici ma façon de concevoir et construire des expériences numériques, du socle technique au soin visuel.",
    legendTitle: 'Niveau de familiaridade',
    levels: {
      1: 'Débutant',
      2: 'Intermédiaire',
      3: 'Avançado',
      4: 'Expert',
      5: 'Maître',
    },
    nowText: 'Actuel',
    viewText: 'Voir',
  },
};

export default function SkillsSection({}: SkillsSectionProps) {
  const { i18n } = useTranslation();
  const language = i18n.language as LanguageCode;

  const [skillsContent, setSkillsContent] = useState<SkillsContent | null>(null);
  const [loading, setLoading] = useState(true);

  // Moved these derivations/hooks to the top
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await loadSkillsContent();
        setSkillsContent(data);
      } catch (error) {
        console.error("Failed to load skills content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  if (loading) {
    return (
      <main className="relative w-screen h-screen overflow-hidden">
        <ReactiveGridBackground />
        <div className="relative z-10 flex items-center justify-center w-full h-full px-6 text-center">
          <p className="text-muted-foreground">Loading skills...</p>
        </div>
      </main>
    );
  }

  // If skillsContent is still null after loading, handle gracefully
  if (!skillsContent) {
    return (
      <main className="relative w-screen h-screen overflow-hidden">
        <ReactiveGridBackground />
        <div className="relative z-10 flex items-center justify-center w-full h-full px-6 text-center">
          <p className="text-muted-foreground">Failed to load skills data.</p>
        </div>
      </main>
    );
  }

  // Moved these derivations/hooks below the loading and error checks
  const normalizedCategories = useMemo(() => {
    return Array.isArray(skillsContent.categories)
      ? skillsContent.categories.map(category => ({
          ...category,
          skills: Array.isArray(category.skills) ? category.skills : [],
        }))
      : [];
  }, [skillsContent]);

  // Use normalizedCategories here for initial activeCategoryId, as it's guaranteed to be an array
  const [activeCategoryId, setActiveCategoryId] = useState<string>(normalizedCategories[0]?.name ?? '');

  const { primaryRgb, theme } = useTheme();
  const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;

  const translation = useMemo(() => {
    // Attempt to get translation from skillsContent for the current language
    const currentLangTranslation = skillsContent.translations[language];
    // Attempt to get translation from skillsContent for English as a fallback
    const englishTranslation = skillsContent.translations['en'];

    // Combine them, prioritizing current language, then English
    const combinedTranslation = {
      ...skillsCopy[language], // Start with skillsCopy for the current language as base defaults
      ...skillsCopy['en'], // Override with English skillsCopy if language-specific is missing
      ...(englishTranslation || {}), // Override with English from skillsContent if available
      ...(currentLangTranslation || {}), // Override with current language from skillsContent if available
    };

    return combinedTranslation;
  }, [skillsContent, language]);

  const categories = useMemo(() => {
    return normalizedCategories.map((c, i) => {
      const translated = translation?.categories?.[i];
      const baseSkills = Array.isArray(c.skills) ? c.skills : [];
      const translatedSkills = Array.isArray(translated?.skills) ? translated.skills : [];

      return {
        ...c,
        name: translated?.name || c.name,
        skills: baseSkills.map((s, j) => {
          const translatedSkill = translatedSkills?.[j];
          return {
            ...s,
            name: translatedSkill?.name || s.name,
          };
        }),
      };
    });
  }, [normalizedCategories, translation]);

  const activeCategory = useMemo(() => {
    return categories.find(category => category.name === activeCategoryId) ?? categories[0] ?? { name: '', skills: [] };
  }, [categories, activeCategoryId]);

  const summary = useMemo(() => {
    return translation?.summary || skillsContent.summary;
  }, [translation, skillsContent]);

  // If there's no data, render a friendly placeholder instead of crashing
  if (!categories.length) {
    return (
      <main className="relative w-screen h-screen overflow-hidden">
        <ReactiveGridBackground />
        <div className="relative z-10 flex items-center justify-center w-full h-full px-6 text-center">
          <p className="text-muted-foreground">Nenhuma skill cadastrada ainda.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <ReactiveGridBackground />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full h-full px-6 sm:px-10 gap-10 lg:gap-16">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl text-center lg:text-left text-foreground"
        >
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-muted-foreground-subtle mb-4">
            {translation.eyebrow} · Stack
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-5">
            {translation.title}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
            {translation.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            {activeCategory.skills.slice(0, 4).map(skill => {
              const Icon = skillIconMap[skill.name];
              return (
                <span
                  key={skill.name}
                  className="px-3 py-1 rounded-full border border-border-subtle bg-surface-soft text-[10px] tracking-[0.18em] uppercase text-muted-foreground inline-flex items-center gap-1.5"
                >
                  {Icon && <Icon className="w-3.5 h-3.5" />}
                  <span>{skill.name}</span>
                </span>
              );
            })}
          </div>

          <div className="mt-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground-subtle mb-2">
              {translation.legendTitle}
            </p>
            <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground-subtle">
              {([1, 2, 3, 4, 5] as SkillLevel[]).map(level => (
                <div key={level} className="flex items-center gap-2">
                  <div className="w-10 h-[3px] rounded-full bg-surface-soft overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: levelVisual[level],
                        background: `linear-gradient(to right, ${primaryColor}, hsl(var(--secondary)))`,
                      }}
                    />
                  </div>
                  <span className="tracking-[0.18em] uppercase">{translation.levels[level]}</span>
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-6 rounded-3xl border border-border-subtle bg-surface-soft backdrop-blur-md p-5 sm:p-6"
              style={{
                boxShadow: `0 18px 60px rgba(0,0,0,${theme === 'dark' ? 0.6 : 0.15})`,
              }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground-subtle mb-1">
                    {activeCategory.name}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {activeCategory.skills.map(skill => {
                  const Icon = skillIconMap[skill.name];
                  return (
                    <div
                      key={skill.name}
                      className="flex items-center justify-between gap-3 text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="w-4 h-4" style={{ color: primaryColor }} />}
                        <span className="text-foreground">{skill.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-[3px] rounded-full bg-surface-soft overflow-hidden">
                          <div
                            className="h-full"
                            style={{
                              width: levelVisual[skill.level as SkillLevel],
                              background: `linear-gradient(to right, ${primaryColor}, hsl(var(--secondary)))`,
                            }}
                          />
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground-subtle">
                          {translation.levels[skill.level as SkillLevel]}
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
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle mb-3 text-center lg:text-left">
            {translation.eyebrow} · Áreas de foco
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {categories.map(category => {
              const isActive = category.name === activeCategoryId;

              return (
                <motion.button
                  key={category.name}
                  type="button"
                  onMouseEnter={() => setActiveCategoryId(category.name)}
                  onFocus={() => setActiveCategoryId(category.name)}
                  onClick={() => setActiveCategoryId(category.name)}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  className="relative group text-left"
                >
                  <motion.div
                    className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100"
                    style={{
                      background: `linear-gradient(to bottom right, ${primaryColor}40, transparent, hsl(var(--secondary) / 0.4))`,
                    }}
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                  />

                  <div
                    className="relative rounded-2xl border border-border-subtle bg-surface-soft backdrop-blur-md px-4 py-4 sm:px-4 sm:py-4 overflow-hidden"
                    style={{
                      boxShadow: `0 10px 40px rgba(0,0,0,${theme === 'dark' ? 0.75 : 0.15})`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground-subtle mb-1">
                          {category.name}
                        </p>
                      </div>
                      <motion.span
                        className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground-subtle"
                        animate={{
                          opacity: isActive ? 1 : 0.4,
                          y: isActive ? 0 : 2,
                        }}
                      >
                        {isActive ? translation.nowText : translation.viewText}
                      </motion.span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {category.skills.slice(0, 3).map(skill => {
                        const Icon = skillIconMap[skill.name];
                        return (
                          <span
                            key={skill.name}
                            className="px-2 py-0.5 rounded-full bg-surface-soft text-[9px] tracking-[0.15em] uppercase text-muted-foreground-subtle inline-flex items-center gap-1"
                          >
                            {Icon && <Icon className="w-3 h-3" />}
                            <span>{skill.name}</span>
                          </span>
                        );
                      })}
                    </div>

                    <motion.div
                      className="absolute inset-px rounded-2xl border pointer-events-none"
                      style={{ borderColor: primaryColor }}
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
