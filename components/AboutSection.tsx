'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactiveGridBackground from '@/components/Reactivegridbackground';
import { useTheme } from '@/components/ThemeProvider';
import { loadAboutContent } from '@/lib/content/client';
import {
  defaultAboutContent,
  type AboutContent,
  type LanguageCode as ContentLanguageCode,
} from '@/lib/content/schema';

type UiLanguageCode = 'PT' | 'EN' | 'ES' | 'FR';

interface AboutSectionProps {
  language?: UiLanguageCode | null;
}

export default function AboutSection({ language = 'EN' }: AboutSectionProps) {
  const { t } = useTranslation('common');
  const safeLang: UiLanguageCode = (language ?? 'EN') as UiLanguageCode;

  const [content, setContent] = useState<AboutContent>(defaultAboutContent);
  const { primaryRgb, theme } = useTheme();
  const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;

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

  const cmsLang = safeLang.toLowerCase() as ContentLanguageCode;
  const translation =
    cmsLang === 'pt'
      ? null
      : content.translations[cmsLang as Exclude<ContentLanguageCode, 'pt'>];

  const title = content.title || t('about.heading');
  const summary = translation?.summary || content.summary || t('about.summary');
  const longDescription =
    translation?.longDescription || content.longDescription || t('about.summary');

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
    <main className="relative w-screen h-screen overflow-hidden">
      <ReactiveGridBackground />

      <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 py-12 md:py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 lg:mb-20"
          >
            <p className="text-[10px] uppercase tracking-[0.35em] text-muted-foreground-subtle mb-3">
              {t('about.language')}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight text-foreground mb-6">
              {title}
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-muted-foreground leading-relaxed font-light max-w-4xl">
              {summary}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 mb-16 lg:mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-6 lg:space-y-8"
            >
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span
                    className="h-0.5 w-12 rounded-full"
                    style={{
                      background: `linear-gradient(to right, ${primaryColor}, hsl(var(--secondary)))`,
                    }}
                  />
                  <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">
                    {t('about.myStory')}
                  </p>
                </div>

                <div
                  className="rounded-2xl border border-border-subtle p-6 lg:p-8 relative overflow-hidden backdrop-blur-md"
                  style={{
                    background: theme === 'dark'
                      ? 'rgba(20, 20, 25, 0.7)'
                      : 'rgba(255, 255, 255, 0.5)',
                    boxShadow: `0 8px 32px rgba(0,0,0,${theme === 'dark' ? 0.3 : 0.1})`,
                  }}
                >
                  <div
                    className="absolute top-0 left-0 w-1 h-full"
                    style={{
                      background: `linear-gradient(to bottom, ${primaryColor}, hsl(var(--secondary)))`,
                    }}
                  />
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                    {longDescription}
                  </p>
                </div>
              </div>

              {highlights.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span
                      className="h-0.5 w-12 rounded-full"
                      style={{
                        background: `linear-gradient(to right, ${primaryColor}, hsl(var(--secondary)))`,
                      }}
                    />
                    <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">
                      {t('about.highlights')}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {highlights.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 + idx * 0.05 }}
                        className="group rounded-xl border border-border-subtle p-4 relative overflow-hidden transition-all duration-500 hover:border-border backdrop-blur-sm"
                        style={{
                          background: theme === 'dark'
                            ? 'rgba(20, 20, 25, 0.5)'
                            : 'rgba(255, 255, 255, 0.3)',
                        }}
                      >
                        <div
                          className="absolute left-0 top-0 h-full w-1 transition-all duration-500 group-hover:w-1.5"
                          style={{
                            background: `linear-gradient(to bottom, ${primaryColor}, hsl(var(--secondary)))`,
                          }}
                        />
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                          style={{
                            background: `radial-gradient(circle at left center, rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},0.05), transparent 70%)`,
                          }}
                        />
                        <div className="relative flex items-center gap-3">
                          <div
                            className="shrink-0 w-1.5 h-1.5 rounded-full transition-all duration-500 group-hover:scale-150"
                            style={{
                              backgroundColor: primaryColor,
                              boxShadow: `0 0 8px ${primaryColor}`,
                            }}
                          />
                          <span className="text-sm sm:text-base text-foreground leading-relaxed">
                            {item}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:sticky lg:top-8 h-fit"
            >
              <div className="flex items-center gap-3 mb-5">
                <span
                  className="h-0.5 w-12 rounded-full"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor}, hsl(var(--secondary)))`,
                  }}
                />
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">
                  {t('about.videoPitch')}
                </p>
              </div>

              <div
                className="w-full aspect-9/16 max-w-[420px] mx-auto lg:mx-0 rounded-3xl border border-border-subtle overflow-hidden relative backdrop-blur-md"
                style={{
                  background: theme === 'dark'
                    ? `linear-gradient(135deg, rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},0.15), rgba(10,10,15,0.8))`
                    : `linear-gradient(135deg, rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},0.1), rgba(255,255,255,0.8))`,
                  boxShadow: `0 25px 70px rgba(0,0,0,${theme === 'dark' ? 0.5 : 0.15})`,
                }}
              >
                {videoUrl ? (
                  <video
                    src={videoUrl}
                    poster={profileImage || undefined}
                    controls
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-8 text-center">
                    <div>
                      <div
                        className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${primaryColor}, hsl(var(--secondary)))`,
                          opacity: 0.15
                        }}
                      >
                        <div className="w-0 h-0 border-l-12 border-l-current border-t-8 border-t-transparent border-b-8 border-b-transparent ml-1 opacity-50" />
                      </div>
                      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-2">
                        {t('about.videoPlaceholder.title')}
                      </p>
                      <p className="text-[11px] text-muted-foreground-subtle leading-relaxed">
                        {t('about.videoPlaceholder.description')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {softSkills.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-6 lg:mb-8">
                <span
                  className="h-0.5 w-12 rounded-full"
                  style={{
                    background: `linear-gradient(to right, ${primaryColor}, hsl(var(--secondary)))`,
                  }}
                />
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">
                  {t('about.skills')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
                {softSkills.map((skill, idx) => (
                  <motion.div
                    key={skill.name + skill.description}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + idx * 0.08 }}
                    className="group rounded-2xl border border-border-subtle p-6 relative overflow-hidden transition-all duration-500 hover:border-border backdrop-blur-sm"
                    style={{
                      background: theme === 'dark'
                        ? 'rgba(20, 20, 25, 0.5)'
                        : 'rgba(255, 255, 255, 0.3)',
                      boxShadow: `0 8px 32px rgba(0,0,0,${theme === 'dark' ? 0.3 : 0.1})`,
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: `radial-gradient(circle at top left, rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},0.08), transparent 60%)`,
                      }}
                    />
                    <div className="relative">
                      <p className="text-base font-medium text-foreground mb-2">
                        {skill.name}
                      </p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {skill.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}