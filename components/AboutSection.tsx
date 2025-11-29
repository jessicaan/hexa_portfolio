'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import ReactiveGridBackground from '@/components/Reactivegridbackground';
import { useTheme } from '@/components/ThemeProvider';
import { loadAboutContent } from '@/lib/content/client';
import {
  defaultAboutContent,
  type AboutContent,
  type LanguageCode as ContentLanguageCode,
} from '@/lib/content/schema';

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
  const summary = translation?.summary || content.summary;
  const longDescription = translation?.longDescription || content.longDescription;

  const softSkills = useMemo(() => {
    const source =
      translation?.softSkills && translation.softSkills.length > 0
        ? translation.softSkills
        : content.softSkills;

    return (source ?? []).map((skill, idx) => ({
      name: content.softSkills[idx]?.name || `Soft skill ${idx + 1}`,
      description: skill?.description ?? content.softSkills[idx]?.description ?? '',
    }));
  }, [content.softSkills, translation]);

  const highlights = useMemo(() => {
    if (translation?.highlights && translation.highlights.length > 0) {
      return translation.highlights;
    }
    return content.highlights ?? [];
  }, [content.highlights, translation]);

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
                  {translation.heading}
                </p>
              </div>
              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-4"
                style={{ color: isDark ? '#fff' : 'var(--foreground)' }}
              >
                {title}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                {summary}
              </p>
            </motion.header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-5 flex flex-col gap-6"
              >
                <div
                  className="rounded-2xl border border-border-subtle overflow-hidden backdrop-blur-md"
                  style={{
                    background: isDark ? 'rgba(20, 20, 25, 0.7)' : 'rgba(255, 255, 255, 0.5)',
                    boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? 0.3 : 0.1})`,
                  }}
                >
                  <div
                    className="relative aspect-9/16 max-h-[420px] w-full"
                    style={{ backgroundColor: primaryColorBg }}
                  >
                    {videoUrl ? (
                      <video
                        src={videoUrl}
                        poster={profileImage || undefined}
                        controls
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : profileImage ? (
                      <Image
                        src={profileImage}
                        alt={title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center p-6">
                          <div
                            className="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: primaryColorBg }}
                          >
                            <div
                              className="w-0 h-0 border-l-10 border-l-current border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"
                              style={{ color: primaryColor, opacity: 0.6 }}
                            />
                          </div>
                          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                            {translation.videoPlaceholderTitle}
                          </p>
                          <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
                            {translation.videoPlaceholderDescription}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-5 border-t border-border-subtle">
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
                        {translation.videoPitch}
                      </p>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed">
                      {translation.videoPlaceholderDescription}
                    </p>
                  </div>
                </div>

                {softSkills.length > 0 && (
                  <div
                    className="rounded-2xl border border-border-subtle p-5 backdrop-blur-md"
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
                        {translation.skillsText}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {softSkills.map((skill, idx) => (
                        <motion.div
                          key={skill.name + idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.2 + idx * 0.05 }}
                          className="group p-3 rounded-xl bg-background/50 border border-border-subtle hover:border-border transition-all"
                        >
                          <div className="flex items-start gap-2">
                            <span
                              className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: primaryColor }}
                            />
                            <div>
                              <p className="text-sm font-medium text-foreground mb-0.5">
                                {skill.name}
                              </p>
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {skill.description}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-7 flex flex-col"
              >
                <div
                  className="rounded-2xl border border-border-subtle overflow-hidden backdrop-blur-md flex-1 flex flex-col"
                  style={{
                    background: isDark ? 'rgba(20, 20, 25, 0.7)' : 'rgba(255, 255, 255, 0.5)',
                    boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? 0.3 : 0.1})`,
                  }}
                >
                  <div className="p-6 lg:p-8 flex-1 overflow-y-auto about-scrollbar">
                    <div className="flex items-center gap-3 mb-5">
                      <span
                        className="h-px w-8"
                        style={{
                          background: `linear-gradient(to right, ${primaryColor}, transparent)`,
                        }}
                      />
                      <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
                        {translation.myStory}
                      </p>
                    </div>

                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div
                        className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line"
                        style={{ lineHeight: '1.8' }}
                      >
                        {longDescription}
                      </div>
                    </div>

                    {highlights.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-border-subtle">
                        <div className="flex items-center gap-2 mb-4">
                          <span
                            className="w-1 h-4 rounded-full"
                            style={{ backgroundColor: primaryColor }}
                          />
                          <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
                            {translation.highlightsText}
                          </p>
                        </div>

                        <ul className="grid gap-3 sm:grid-cols-2">
                          {highlights.map((item, idx) => (
                            <motion.li
                              key={idx}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.3 + idx * 0.04 }}
                              className="flex items-start gap-2 text-sm p-3 rounded-lg bg-muted/30 border border-border-subtle"
                            >
                              <span
                                className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: primaryColor }}
                              />
                              <span className="text-foreground/90">{item}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="p-5 border-t border-border-subtle bg-muted/20">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-2 h-2 rounded-full animate-pulse"
                          style={{
                            backgroundColor: '#10b981',
                            boxShadow: '0 0 8px #10b981',
                          }}
                        />
                        <span className="text-xs text-muted-foreground">
                          Available for new opportunities
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href="#contact"
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                          style={{
                            background: `linear-gradient(135deg, ${primaryColor}, ${primaryColor}dd)`,
                          }}
                        >
                          Get in Touch
                        </a>
                      </div>
                    </div>
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