'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import ReactiveGridBackground from '../background/ReactiveGridBackground';
import { useTheme } from '../theme/ThemeProvider';
import { loadPersonalContent } from '@/lib/content/client';
import {
  defaultPersonalContent,
  type PersonalContent,
  type LanguageCode,
  type Trait,
} from '@/lib/content/schema';
import { useTranslation } from 'react-i18next';
import PersonalSectionHeader from './personal/PersonalSectionHeader';
import PersonalTraitsRadarChart from './personal/PersonalTraitsRadarChart';
import PersonalValuesBadges from './personal/PersonalValuesBadges';

export default function PersonalSection() {
  const { i18n } = useTranslation();
  const language = i18n.language as LanguageCode;

  const [content, setContent] = useState<PersonalContent>(defaultPersonalContent);
  const [loading, setLoading] = useState(true);

  const { primaryRgb, theme } = useTheme();
  const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;
  const isDark = theme === 'dark';

  const translation = useMemo(() => {
    return content.translations[language] || content.translations['en'];
  }, [content.translations, language]);

  useEffect(() => {
    const fetchPersonal = async () => {
      try {
        const data = await loadPersonalContent();
        setContent(data);
      } catch (error) {
        console.error('Failed to load personal content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPersonal();
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
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <style jsx global>{`
        .personal-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .personal-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .personal-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.3);
          border-radius: 3px;
        }
        .personal-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.5);
        }
      `}</style>

      <main className="relative w-screen h-screen overflow-hidden">
        <ReactiveGridBackground />

        <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden personal-scrollbar">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-12 lg:py-16">
            <PersonalSectionHeader
              primaryColor={primaryColor}
              eyebrow={translation.eyebrow}
              title={translation.title}
              description={translation.description}
              isDark={isDark}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-5 flex flex-col gap-6"
              >
                <PersonalTraitsRadarChart
                  contentTraits={content.traits}
                  translation={translation}
                  primaryColor={primaryColor}
                  primaryRgb={primaryRgb}
                  isDark={isDark}
                />


              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-7"
              >
                <div
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
                        {translation.hobbiesLabel}
                      </p>
                    </div>

                    <div className="grid gap-8 grid-cols-1">
                      <div className="grid gap-4 sm:grid-cols-2">
                        {content.hobbyCards.map((card, idx) => {
                          const translatedHobby = translation.translatedHobbies?.[idx];

                          return (
                            <motion.div
                              key={card.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.3 + idx * 0.08 }}
                              className="group rounded-xl border border-border-subtle p-4 transition-all duration-300 hover:border-border"
                              style={{
                                background: isDark
                                  ? 'rgba(30, 30, 35, 0.5)'
                                  : 'rgba(255, 255, 255, 0.3)',
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div
                                  className="w-1 h-8 rounded-full shrink-0 mt-0.5"
                                  style={{
                                    background: `linear-gradient(to bottom, ${primaryColor}, hsl(var(--secondary)))`,
                                  }}
                                />
                                <div>
                                  <p className="text-md font-medium text-foreground mb-1">
                                    {translatedHobby?.title || card.title}
                                  </p>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {translatedHobby?.description || card.description}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                      {content.values && content.values.length > 0 && (
                        <PersonalValuesBadges
                          values={content.values}
                          translatedValues={translation.values}
                          primaryColor={primaryColor}
                          primaryRgb={primaryRgb}
                          isDark={isDark}
                        />
                      )}

                    </div>

                    {content.bio && (
                      <div className="mt-8 pt-6 border-t border-border-subtle">
                        <div className="flex items-center gap-2 mb-4">
                          <span
                            className="w-1 h-4 rounded-full"
                            style={{ backgroundColor: primaryColor }}
                          />
                          <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
                            Bio
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {translation.bio || content.bio}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}