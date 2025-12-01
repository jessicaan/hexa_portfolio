'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactiveGridBackground from '@/components/background/ReactiveGridBackground';
import { useTheme } from '@/components/theme/ThemeProvider';
import { loadEducationContent } from '@/lib/content/client';
import {
  defaultEducationContent,
  type EducationContent,
  type EducationItem,
  type LanguageCode,
} from '@/lib/content/schema';
import { useTranslation } from 'react-i18next';
import EducationSectionHeader from './EducationSectionHeader';
import EducationList from './EducationList';
import EducationDetailCard from './EducationDetailCard';

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
            <EducationSectionHeader
              eyebrow={translation.eyebrow}
              title={translation.title}
              summary={translation.summary}
              primaryColor={primaryColor}
              isDark={isDark}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-5"
              >
                <EducationList
                  education={education}
                  activeIndex={activeIndex}
                  onSelect={setActiveIndex}
                  primaryColor={primaryColor}
                  primaryRgb={primaryRgb}
                  isDark={isDark}
                  label={translation.listLabel}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-7"
              >
                <AnimatePresence mode="wait">
                  {activeEducation && (
                    <EducationDetailCard
                      education={activeEducation}
                      primaryColor={primaryColor}
                      primaryRgb={primaryRgb}
                      isDark={isDark}
                      listLabel={translation.listLabel}
                      highlightsLabel={translation.highlightsLabel}
                    />
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
