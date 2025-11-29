'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactiveGridBackground from '../background/ReactiveGridBackground';
import { useTheme } from '../theme/ThemeProvider';
import { loadEducationContent } from '@/lib/content/client';
import {
  defaultEducationContent,
  type EducationContent,
  type EducationItem,
  type LanguageCode,
} from '@/lib/content/schema';
import { useTranslation } from 'react-i18next';

export default function EducationSection() {
  const { i18n } = useTranslation();
  const language = i18n.language as LanguageCode;

  const [content, setContent] = useState<EducationContent>(defaultEducationContent);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const { primaryRgb, theme } = useTheme();
  const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;
  const isDark = theme === 'dark';

  const translation = useMemo(() => {
    return content.translations[language] || content.translations['en'];
  }, [content.translations, language]);

  const education = useMemo(() => {
    const baseList = content.education?.length
      ? content.education
      : translation?.education ?? [];

    return baseList.map((item, idx) => {
      const translated = translation?.education?.[idx];
      const highlights =
        translated?.highlights && translated.highlights.length > 0
          ? translated.highlights
          : item.highlights;

      return {
        institution: translated?.institution || item.institution,
        course: translated?.course || item.course,
        period: translated?.period || item.period,
        description: translated?.description || item.description,
        highlights: highlights ?? [],
      } as EducationItem;
    });
  }, [content.education, translation]);

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const data = await loadEducationContent();
        setContent(data);
      } catch (error) {
        console.error('Failed to load education content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEducation();
  }, []);

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
            <p className="text-muted-foreground">Loading education...</p>
          </div>
        </div>
      </main>
    );
  }

  const activeEducation = education[activeIndex] ?? education[0];

  return (
    <>
      <style jsx global>{`
        .edu-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .edu-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .edu-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.3);
          border-radius: 3px;
        }
        .edu-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.5);
        }
      `}</style>

      <main className="relative w-screen h-screen overflow-hidden">
        <ReactiveGridBackground />

        <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden edu-scrollbar">
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
                  {translation.eyebrow}
                </p>
              </div>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-4"
                style={{ color: isDark ? '#fff' : 'var(--foreground)' }}
              >
                {translation.title}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                {translation.summary}
              </p>
            </motion.header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-5"
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
                      {translation.listLabel}
                    </p>
                  </div>

                  <div className="space-y-3 max-h-[60vh] overflow-y-auto edu-scrollbar pr-1">
                    {education.map((entry, index) => {
                      const isActive = activeIndex === index;

                      return (
                        <motion.button
                          key={`${entry.institution}-${entry.course}-${index}`}
                          type="button"
                          onClick={() => setActiveIndex(index)}
                          onMouseEnter={() => setActiveIndex(index)}
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
                              boxShadow: isActive
                                ? `0 4px 20px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.15)`
                                : 'none',
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
                              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                                {entry.period}
                              </p>
                              <p
                                className="text-sm font-medium mb-0.5 transition-colors"
                                style={{ color: isActive ? primaryColor : 'var(--foreground)' }}
                              >
                                {entry.course}
                              </p>
                              <p className="text-xs text-muted-foreground">{entry.institution}</p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-7"
              >
                <AnimatePresence mode="wait">
                  {activeEducation && (
                    <motion.div
                      key={`${activeEducation.course}-${activeEducation.institution}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-2xl border border-border-subtle overflow-hidden backdrop-blur-md h-full"
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
                        <div className="flex items-center gap-3 mb-5">
                          <span
                            className="h-px w-8"
                            style={{
                              background: `linear-gradient(to right, ${primaryColor}, transparent)`,
                            }}
                          />
                          <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
                            {translation.listLabel}
                          </p>
                        </div>

                        <h2
                          className="text-xl sm:text-2xl font-semibold mb-2"
                          style={{ color: isDark ? '#fff' : 'var(--foreground)' }}
                        >
                          {activeEducation.course}
                        </h2>

                        <div className="flex flex-wrap items-center gap-3 mb-6">
                          <span className="text-sm text-muted-foreground">
                            {activeEducation.institution}
                          </span>
                          <span
                            className="px-2.5 py-1 rounded-md text-xs font-medium border border-border-subtle"
                            style={{
                              background: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`,
                              color: primaryColor,
                            }}
                          >
                            {activeEducation.period}
                          </span>
                        </div>

                        <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {activeEducation.description}
                          </p>
                        </div>

                        {activeEducation.highlights && activeEducation.highlights.length > 0 && (
                          <div className="pt-6 border-t border-border-subtle">
                            <div className="flex items-center gap-2 mb-4">
                              <span
                                className="w-1 h-4 rounded-full"
                                style={{ backgroundColor: primaryColor }}
                              />
                              <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
                                {translation.highlightsLabel}
                              </p>
                            </div>

                            <ul className="grid gap-3 sm:grid-cols-2">
                              {activeEducation.highlights.map((highlight, idx) => (
                                <motion.li
                                  key={idx}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                                  className="flex items-start gap-2 text-sm p-3 rounded-lg bg-muted/30 border border-border-subtle"
                                >
                                  <span
                                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{ backgroundColor: primaryColor }}
                                  />
                                  <span className="text-foreground/90">{highlight}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        )}
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