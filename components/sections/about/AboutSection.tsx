'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactiveGridBackground from '@/components/background/ReactiveGridBackground';
import { useTheme } from '../../theme/ThemeProvider';
import { loadAboutContent } from '@/lib/content/client';
import {
  defaultAboutContent,
  type AboutContent,
  type LanguageCode as ContentLanguageCode,
  type SoftSkill,
} from '@/lib/content/schema';
import AboutSectionHeader from './AboutSectionHeader';
import AboutMediaCard from './AboutMediaCard';
import AboutSoftSkillsGrid from './AboutSoftSkillsGrid';
import AboutStoryPanel from './AboutStoryPanel';

export default function AboutSection() {
  const { i18n } = useTranslation();
  const cmsLang = i18n.language as ContentLanguageCode;

  const [content, setContent] = useState<AboutContent>(defaultAboutContent);
  const { primaryRgb, theme } = useTheme();

  const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;
  const primaryColorBg = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`;
  const isDark = theme === 'dark';

  useEffect(() => {
    let active = true;

    loadAboutContent()
      .then(data => {
        if (!active) return;
        setContent(data);
      })
      .catch(error => {
        console.error('[content] Failed to load about section', error);
      });

    return () => {
      active = false;
    };
  }, []);

  const translation = content.translations[cmsLang] || content.translations['en'];

  const title = content.title || translation.heading;
  const summary = translation.summary;
  const longDescription = translation.longDescription;

  const softSkills = useMemo<SoftSkill[]>(() => {
    return translation.softSkills ?? [];
  }, [translation.softSkills]);

  const highlights = useMemo<string[]>(() => {
    return translation.highlights ?? [];
  }, [translation.highlights]);

  const videoUrl = content.videoPitchUrl;
  const profileImage = content.profileImage;

  return (
    <>
      <style jsx global>{`
        .about-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .about-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .about-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.3);
          border-radius: 3px;
        }
        .about-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.5);
        }
      `}</style>

      <main className="relative w-screen h-screen overflow-hidden">
        <ReactiveGridBackground />

        <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden about-scrollbar">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 pt-8 pb-24 md:pt-12 md:pb-12 lg:pt-12 lg:pb-12">

            <AboutSectionHeader
              eyebrowLabel={translation.heading}
              summary={summary}
              primaryColor={primaryColor}
              isDark={isDark}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-5 flex flex-col gap-6"
              >
                <AboutMediaCard
                  primaryColor={primaryColor}
                  primaryColorBg={primaryColorBg}
                  isDark={isDark}
                  videoUrl={videoUrl}
                  profileImage={profileImage}
                  videoHeading={translation.videoPitch}
                  videoDescription={translation.videoPlaceholderDescription}
                  placeholderLabel={translation.videoPlaceholderTitle}
                  title={title}
                />

                <AboutSoftSkillsGrid
                  skills={softSkills}
                  primaryColor={primaryColor}
                  isDark={isDark}
                  label={translation.skillsText}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-7 flex flex-col"
              >
                <AboutStoryPanel
                  longDescription={longDescription}
                  highlights={highlights as string[]}
                  primaryColor={primaryColor}
                  isDark={isDark}
                  storyLabel={translation.myStory}
                  highlightsLabel={translation.highlightsText}
                  scrollClassName="about-scrollbar"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
