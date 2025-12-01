'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import { loadExperienceContent } from '@/lib/content/client';
import {
  defaultExperienceContent,
  type ExperienceContent,
  type LanguageCode,
} from '@/lib/content/schema';

import ReactiveGridBackground from '@/components/background/ReactiveGridBackground';
import { useTheme } from '@/components/theme/ThemeProvider';
import ExperienceSectionHeader from './ExperienceSectionHeader';
import ExperienceList from './ExperienceList';
import ExperienceDetailCard from './ExperienceDetailCard';

export default function ExperienceSection() {
  const { i18n } = useTranslation();
  const language = i18n.language as LanguageCode;

  const [content, setContent] = useState<ExperienceContent>(defaultExperienceContent);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState<string>('');

  const { primaryRgb, theme } = useTheme();
  const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;
  const isDark = theme === 'dark';

  const translation = useMemo(() => {
    return content.translations[language] || content.translations['en'];
  }, [content.translations, language]);

  const experiences = useMemo(() => {
    return content.experiences.map((exp, index) => {
      const translated = translation.experiences?.[index];
      const achievements =
        Array.isArray(translated?.achievements) && translated.achievements.length > 0
          ? translated.achievements
          : exp.achievements;
      return {
        ...exp,
        role: translated?.role || exp.role,
        description: translated?.description || exp.description,
        achievements,
        period: translated?.period || exp.period,
      };
    });
  }, [content.experiences, translation]);

  const activeExperience = useMemo(() => {
    return experiences.find(exp => exp.company === activeId) ?? experiences[0];
  }, [activeId, experiences]);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const data = await loadExperienceContent();
        setContent(data);
      } catch (error) {
        console.error('Failed to load experience content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperience();
  }, []);

  useEffect(() => {
    if (experiences.length > 0 && !activeId) {
      setActiveId(experiences[0].company);
    }
  }, [experiences, activeId]);

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
            <p className="text-muted-foreground">Loading experience...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <style jsx global>{`
        .exp-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .exp-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .exp-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.3);
          border-radius: 3px;
        }
        .exp-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.5);
        }
      `}</style>

      <main className="relative w-screen h-screen overflow-hidden">
        <ReactiveGridBackground />

        <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden exp-scrollbar">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 pt-8 pb-24 md:pt-12 md:pb-12 lg:pt-16 lg:pb-16">
            <ExperienceSectionHeader
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
                <ExperienceList
                  experiences={experiences}
                  activeId={activeId}
                  onSelect={setActiveId}
                  primaryColor={primaryColor}
                  primaryRgb={primaryRgb}
                  isDark={isDark}
                  label={translation.detailHeading}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-7"
              >
                <AnimatePresence mode="wait">
                  {activeExperience && (
                    <ExperienceDetailCard
                      experience={activeExperience}
                      primaryColor={primaryColor}
                      primaryRgb={primaryRgb}
                      isDark={isDark}
                      detailHeading={translation.detailHeading}
                      highlightsHeading={translation.highlightsHeading}
                      stackHeading={translation.stackHeading}
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
