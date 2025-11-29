'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactiveGridBackground from '@/components/Reactivegridbackground';
import { useTheme } from '@/components/ThemeProvider';
import { loadEducationContent } from '@/lib/content/client';
import { defaultEducationContent, type EducationContent, type EducationItem, type LanguageCode } from '@/lib/content/schema';
import { useTranslation } from 'react-i18next';

interface EducationSectionProps {}

export default function EducationSection({}: EducationSectionProps) {
  const { i18n } = useTranslation();
  const language = i18n.language as LanguageCode;

  const [content, setContent] = useState<EducationContent>(defaultEducationContent);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0); // Moved
  const { primaryRgb, theme } = useTheme();          // Moved
  const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`; // Moved

  const translation = useMemo(() => {
    return content.translations[language] || content.translations['en'];
  }, [content.translations, language]);

  const education = useMemo(() => {
    const baseList = content.education?.length
      ? content.education
      : translation?.education ?? [];

    return baseList.map((item, idx) => {
      const translated = translation?.education?.[idx];
      const highlights = (translated?.highlights && translated.highlights.length > 0)
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
        console.error("Failed to load education content:", error);
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
        <div className="relative z-10 flex items-center justify-center w-full h-full px-6 text-center">
          <p className="text-muted-foreground">Loading education information...</p>
        </div>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="relative w-screen h-screen overflow-hidden">
        <ReactiveGridBackground />
        <div className="relative z-10 flex items-center justify-center w-full h-full px-6 text-center">
          <p className="text-muted-foreground">Failed to load education data.</p>
        </div>
      </main>
    );
  }

  const summary = translation?.summary || content.summary;
  const activeEducation = education[activeIndex] ?? education[0];

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
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-muted-foreground-subtle mb-4">{translation.eyebrow}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">{translation.title}</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">{translation.summary}</p>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle mb-3">{translation.listLabel}</p>
          <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1">
            {education.map((entry, index) => (
              <motion.button
                key={`${entry.institution}-${entry.course}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
                whileHover={{ x: 4 }}
                className="w-full text-left"
              >
                <div
                  className={`flex gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                    activeIndex === index
                      ? 'border-primary/60 bg-primary/10'
                      : 'border-border-subtle bg-surface-soft hover:border-primary/40'
                  }`}
                >
                  <div className="mt-1">
                    <div className="w-1 h-8 rounded-full" style={{ background: `linear-gradient(to bottom, ${primaryColor}, hsl(var(--secondary)))` }} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground-subtle mb-1">{entry.period}</p>
                    <p className="text-sm sm:text-base text-foreground font-medium">{entry.course}</p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">{entry.institution}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-full max-w-xl"
        >
          <AnimatePresence mode="wait">
            {activeEducation && (
              <motion.div
                key={`${activeEducation.course}-${activeEducation.institution}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="rounded-3xl border border-border-subtle bg-surface-soft backdrop-blur-md p-5 sm:p-6"
                style={{ boxShadow: `0 18px 60px rgba(0,0,0,${theme === 'dark' ? 0.6 : 0.15})` }}
              >
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground-subtle mb-2">{translation.listLabel}</p>
                <p className="text-sm sm:text-base text-foreground font-medium mb-1">{activeEducation.course}</p>
                <p className="text-[11px] sm:text-xs text-muted-foreground mb-3">{activeEducation.institution} - {activeEducation.period}</p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">{activeEducation.description}</p>

                {activeEducation.highlights && activeEducation.highlights.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground-subtle mb-2">{translation.highlightsLabel}</p>
                    <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground">
                      {activeEducation.highlights.map(highlight => (
                        <li key={highlight} className="flex gap-2">
                          <span
                            className="mt-[5px] h-[3px] w-3 rounded-full"
                            style={{ background: `linear-gradient(to right, ${primaryColor}, hsl(var(--secondary)))` }}
                          />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </div>
    </main>
  );
}
