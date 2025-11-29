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
} from '@/lib/content/schema';
import { useTranslation } from 'react-i18next';

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

  const size = 280;
  const center = size / 2;
  const maxRadius = 100;

  const getPoint = (value: number, index: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const radius = maxRadius * value;
    return { x: center + radius * Math.cos(angle), y: center + radius * Math.sin(angle) };
  };

  const polygonPoints = content.traits
    .map((trait, index) => {
      const point = getPoint(trait.value, index, content.traits.length);
      return `${point.x},${point.y}`;
    })
    .join(' ');

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
                {translation.description}
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
                  className="rounded-2xl border border-border-subtle backdrop-blur-md p-6"
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
                      {translation.howToReadGraphTitle}
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    <svg viewBox={`0 0 ${size} ${size}`} className="w-64 h-64 sm:w-72 sm:h-72">
                      <defs>
                        <radialGradient id="trait-fill-personal" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor={primaryColor} stopOpacity="0.4" />
                          <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.05" />
                        </radialGradient>
                        <filter id="glow-personal" x="-50%" y="-50%" width="200%" height="200%">
                          <feGaussianBlur stdDeviation="3" result="blur" />
                          <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                          </feMerge>
                        </filter>
                      </defs>

                      {[0.33, 0.66, 1].map((level, idx) => (
                        <polygon
                          key={level}
                          points={content.traits
                            .map((_, i) => {
                              const point = getPoint(level, i, content.traits.length);
                              return `${point.x},${point.y}`;
                            })
                            .join(' ')}
                          fill="none"
                          stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
                          strokeWidth={idx === 2 ? 1 : 0.5}
                        />
                      ))}

                      {content.traits.map((_, index) => {
                        const angle = (Math.PI * 2 * index) / content.traits.length - Math.PI / 2;
                        return (
                          <line
                            key={index}
                            x1={center}
                            y1={center}
                            x2={center + maxRadius * Math.cos(angle)}
                            y2={center + maxRadius * Math.sin(angle)}
                            stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                            strokeWidth={0.5}
                          />
                        );
                      })}

                      <polygon
                        points={polygonPoints}
                        fill="url(#trait-fill-personal)"
                        stroke={primaryColor}
                        strokeWidth={2}
                        filter="url(#glow-personal)"
                      />

                      {content.traits.map((trait, index) => {
                        const point = getPoint(trait.value, index, content.traits.length);
                        return (
                          <g key={trait.id}>
                            <circle cx={point.x} cy={point.y} r={6} fill={primaryColor} opacity={0.2} />
                            <circle
                              cx={point.x}
                              cy={point.y}
                              r={3}
                              fill={primaryColor}
                              stroke={isDark ? '#1a1a1a' : '#fff'}
                              strokeWidth={1.5}
                            />
                          </g>
                        );
                      })}

                      {content.traits.map((trait, index) => {
                        const angle = (Math.PI * 2 * index) / content.traits.length - Math.PI / 2;
                        const labelRadius = maxRadius + 22;
                        const translatedLabel =
                          translation.translatedTraits?.[index]?.label || trait.label;

                        return (
                          <text
                            key={trait.id}
                            x={center + labelRadius * Math.cos(angle)}
                            y={center + labelRadius * Math.sin(angle)}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill={isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.5)'}
                            fontSize="8"
                            style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}
                          >
                            {translatedLabel}
                          </text>
                        );
                      })}
                    </svg>

                    <p className="text-xs text-muted-foreground text-center mt-4 max-w-xs leading-relaxed">
                      {translation.howToReadGraphDescription}
                    </p>
                  </div>
                </div>

                {content.values && content.values.length > 0 && (
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
                        Values
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {content.values.map((value, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border-subtle"
                          style={{
                            background: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`,
                          }}
                        >
                          {translation.values?.[idx] || value}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
                                <p className="text-sm font-medium text-foreground mb-1">
                                  {translatedHobby?.title || card.title}
                                </p>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {translatedHobby?.description || card.description}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
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

                    {content.socialLinks && content.socialLinks.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-border-subtle">
                        <div className="flex flex-wrap gap-2">
                          {content.socialLinks.map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 rounded-lg text-xs font-medium border border-border-subtle transition-all hover:border-border"
                              style={{
                                background: isDark
                                  ? 'rgba(30, 30, 35, 0.5)'
                                  : 'rgba(255, 255, 255, 0.5)',
                              }}
                            >
                              {link.platform}
                            </a>
                          ))}
                        </div>
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
