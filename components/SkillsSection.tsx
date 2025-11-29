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
  SiNodedotjs,
  SiPrisma,
  SiSupabase,
  SiFirebase,
  SiPostgresql,
  SiMongodb,
  SiDocker,
  SiPython,
  SiVuedotjs,
  SiAngular,
  SiGraphql,
  SiRedis,
  SiAmazonwebservices,
  SiVercel,
  SiGithub,
  SiHtml5,
  SiCss3,
  SiSass,
} from 'react-icons/si';
import type { SkillsContent, LanguageCode } from '@/lib/content/schema';
import { loadSkillsContent } from '@/lib/content/client';
import { useTranslation } from 'react-i18next';

type SkillLevel = 1 | 2 | 3 | 4 | 5;

const skillIconMap: Record<string, IconType> = {
  typescript: SiTypescript,
  javascript: SiJavascript,
  react: SiReact,
  'next.js': SiNextdotjs,
  nextjs: SiNextdotjs,
  'tailwind css': SiTailwindcss,
  tailwindcss: SiTailwindcss,
  tailwind: SiTailwindcss,
  'framer motion': SiFramer,
  framer: SiFramer,
  gsap: SiGreensock,
  figma: SiFigma,
  git: SiGit,
  'node.js': SiNodedotjs,
  nodejs: SiNodedotjs,
  prisma: SiPrisma,
  supabase: SiSupabase,
  firebase: SiFirebase,
  postgresql: SiPostgresql,
  postgres: SiPostgresql,
  mongodb: SiMongodb,
  docker: SiDocker,
  python: SiPython,
  vue: SiVuedotjs,
  vuejs: SiVuedotjs,
  angular: SiAngular,
  graphql: SiGraphql,
  redis: SiRedis,
  aws: SiAmazonwebservices,
  vercel: SiVercel,
  github: SiGithub,
  html: SiHtml5,
  html5: SiHtml5,
  css: SiCss3,
  css3: SiCss3,
  sass: SiSass,
  scss: SiSass,
};

const getSkillIcon = (name: string): IconType | null => {
  const key = name.toLowerCase().trim();
  return skillIconMap[key] || skillIconMap[key.replace(/\s+/g, '')] || skillIconMap[key.replace(/\./g, '')] || null;
};

const levelWidths: Record<SkillLevel, string> = {
  1: '20%',
  2: '40%',
  3: '60%',
  4: '80%',
  5: '100%',
};

export default function SkillsSection() {
  const { i18n } = useTranslation();
  const language = i18n.language as LanguageCode;

  const [skillsContent, setSkillsContent] = useState<SkillsContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

  const { primaryRgb, theme } = useTheme();
  const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await loadSkillsContent();
        setSkillsContent(data);
      } catch (error) {
        console.error('Failed to load skills content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const translation = useMemo(() => {
    if (!skillsContent) return null;
    return skillsContent.translations[language] || skillsContent.translations['en'];
  }, [skillsContent, language]);

  const categories = useMemo(() => {
    if (!skillsContent?.categories) return [];

    return skillsContent.categories.map((category, idx) => {
      const translatedCategory = translation?.categories?.[idx];
      const skills = (category.skills || []).map((skill, skillIdx) => ({
        ...skill,
        name: translatedCategory?.skills?.[skillIdx]?.name || skill.name,
      }));

      return {
        ...category,
        name: translatedCategory?.name || category.name,
        skills,
      };
    });
  }, [skillsContent, translation]);

  const activeCategory = categories[activeCategoryIndex] || categories[0];

  if (loading) {
    return (
      <main className="relative w-screen h-screen overflow-hidden">
        <ReactiveGridBackground />
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <div
            className="rounded-2xl border border-border-subtle backdrop-blur-md p-8"
            style={{
              background: isDark ? 'rgba(20, 20, 25, 0.7)' : 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <p className="text-muted-foreground">Loading skills...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!categories.length) {
    return (
      <main className="relative w-screen h-screen overflow-hidden">
        <ReactiveGridBackground />
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <div
            className="rounded-2xl border border-border-subtle backdrop-blur-md p-8 text-center"
            style={{
              background: isDark ? 'rgba(20, 20, 25, 0.7)' : 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <p className="text-muted-foreground">No skills registered yet.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <style jsx global>{`
        .skills-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .skills-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .skills-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.3);
          border-radius: 3px;
        }
        .skills-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.5);
        }
      `}</style>

      <main className="relative w-screen h-screen overflow-hidden">
        <ReactiveGridBackground />

        <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden skills-scrollbar">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12 lg:py-16">
            <motion.header
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10 lg:mb-14"
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="h-px w-10"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor}, transparent)`,
                  }}
                />
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {translation?.eyebrow || 'Skills'}
                </p>
              </div>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-4"
                style={{ color: isDark ? '#fff' : 'var(--foreground)' }}
              >
                {translation?.title || 'Stack & Skills'}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                {translation?.description || ''}
              </p>
            </motion.header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-4"
              >
                <div
                  className="rounded-2xl border border-border-subtle backdrop-blur-md p-5"
                  style={{
                    background: isDark ? 'rgba(20, 20, 25, 0.7)' : 'rgba(255, 255, 255, 0.5)',
                    boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? 0.3 : 0.1})`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="w-1 h-4 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    />
                    <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
                      Categories
                    </p>
                  </div>

                  <div className="space-y-2">
                    {categories.map((category, index) => {
                      const isActive = index === activeCategoryIndex;

                      return (
                        <button
                          key={category.name}
                          onClick={() => setActiveCategoryIndex(index)}
                          onMouseEnter={() => setActiveCategoryIndex(index)}
                          className="w-full text-left group"
                        >
                          <div
                            className="relative rounded-xl border p-4 transition-all duration-300"
                            style={{
                              background: isActive
                                ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`
                                : isDark
                                  ? 'rgba(30, 30, 35, 0.5)'
                                  : 'rgba(255, 255, 255, 0.3)',
                              borderColor: isActive
                                ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.4)`
                                : 'var(--border-subtle)',
                            }}
                          >
                            <div
                              className="absolute left-0 top-0 h-full w-1 rounded-l-xl transition-all duration-300"
                              style={{
                                background: isActive
                                  ? `linear-gradient(to bottom, ${primaryColor}, hsl(var(--secondary)))`
                                  : 'transparent',
                              }}
                            />

                            <div className="pl-3">
                              <p
                                className="text-sm font-medium mb-1 transition-colors"
                                style={{ color: isActive ? primaryColor : 'var(--foreground)' }}
                              >
                                {category.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {category.skills.length} skills
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-6 pt-4 border-t border-border-subtle">
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
                      {translation?.legendTitle || 'Proficiency'}
                    </p>
                    <div className="space-y-2">
                      {([1, 2, 3, 4, 5] as SkillLevel[]).map(level => (
                        <div key={level} className="flex items-center gap-3">
                          <div
                            className="w-16 h-1.5 rounded-full overflow-hidden"
                            style={{
                              background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                            }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: levelWidths[level],
                                background: `linear-gradient(to right, ${primaryColor}, hsl(var(--secondary)))`,
                              }}
                            />
                          </div>
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            {translation?.levels?.[level] || `Level ${level}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-8"
              >
                <AnimatePresence mode="wait">
                  {activeCategory && (
                    <motion.div
                      key={activeCategory.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-2xl border border-border-subtle overflow-hidden backdrop-blur-md"
                      style={{
                        background: isDark ? 'rgba(20, 20, 25, 0.7)' : 'rgba(255, 255, 255, 0.5)',
                        boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? 0.3 : 0.1})`,
                      }}
                    >
                      <div
                        className="h-2 w-full"
                        style={{
                          background: `linear-gradient(to right, ${primaryColor}, hsl(var(--secondary)))`,
                        }}
                      />

                      <div className="p-6 lg:p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <span
                            className="h-px w-8"
                            style={{
                              background: `linear-gradient(to right, ${primaryColor}, transparent)`,
                            }}
                          />
                          <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
                            {activeCategory.name}
                          </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          {activeCategory.skills.map((skill, idx) => {
                            const Icon = getSkillIcon(skill.name);
                            const level = skill.level as SkillLevel;

                            return (
                              <motion.div
                                key={skill.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                className="group rounded-xl border border-border-subtle p-4 transition-all duration-300 hover:border-border"
                                style={{
                                  background: isDark
                                    ? 'rgba(30, 30, 35, 0.5)'
                                    : 'rgba(255, 255, 255, 0.3)',
                                }}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    {Icon && (
                                      <Icon
                                        className="w-5 h-5 transition-colors"
                                        style={{ color: primaryColor }}
                                      />
                                    )}
                                    <span className="text-sm font-medium text-foreground">
                                      {skill.name}
                                    </span>
                                  </div>
                                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                    {translation?.levels?.[level] || ''}
                                  </span>
                                </div>

                                <div
                                  className="w-full h-1.5 rounded-full overflow-hidden"
                                  style={{
                                    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                                  }}
                                >
                                  <motion.div
                                    className="h-full rounded-full"
                                    style={{
                                      background: `linear-gradient(to right, ${primaryColor}, hsl(var(--secondary)))`,
                                    }}
                                    initial={{ width: 0 }}
                                    animate={{ width: levelWidths[level] }}
                                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                                  />
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}