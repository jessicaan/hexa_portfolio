'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactiveGridBackground from '@/components/Reactivegridbackground';
import { useTheme } from '@/components/ThemeProvider';
import type { EducationContent, EducationItem } from '@/lib/content/schema';
import type { LanguageCode } from '@/app/i18n';

interface EducationSectionProps {
  language: LanguageCode;
  content: EducationContent;
}

const educationCopy: Record<LanguageCode, {
  eyebrow: string;
  title: string;
  description: string;
  listLabel: string;
  highlightsLabel: string;
}> = {
  pt: {
    eyebrow: 'Educacao & Cursos',
    title: 'Onde aprendi e continuo aprendendo',
    description: 'Um recorte da minha formacao e dos cursos que ajudam a construir minha forma de pensar produtos digitais.',
    listLabel: 'Formacao e trilha',
    highlightsLabel: 'O que marcou esse periodo',
  },
  en: {
    eyebrow: 'Education & Courses',
    title: 'Where I learned and keep learning',
    description: 'A snapshot of my education and courses that shape how I think about digital products.',
    listLabel: 'Education and learning path',
    highlightsLabel: 'What stood out',
  },
  es: {
    eyebrow: 'Educacion y cursos',
    title: 'Donde aprendi y sigo aprendiendo',
    description: 'Un recorte de mi formacion y de los cursos que influyen en como pienso productos digitales.',
    listLabel: 'Formacion y ruta de aprendizaje',
    highlightsLabel: 'Lo que destaco',
  },
  fr: {
    eyebrow: 'Education & cours',
    title: 'Ou jai appris et ou j apprends encore',
    description: 'Un apercu de ma formation et des cours qui influencent ma maniere de penser les produits numeriques.',
    listLabel: 'Parcours et etudes',
    highlightsLabel: 'Points forts',
  },
};

export default function EducationSection({ language, content }: EducationSectionProps) {
  // Ensure we always have copy, falling back to EN for unknown codes
  const copy = educationCopy[language] ?? educationCopy.en;
  const [activeIndex, setActiveIndex] = useState(0);
  const { primaryRgb, theme } = useTheme();
  const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;

  const translation =
    language === 'pt'
      ? null
      : content.translations[language as Exclude<LanguageCode, 'pt'>];

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

  const summary = translation?.summary || content.summary || copy.description;
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
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-muted-foreground-subtle mb-4">{copy.eyebrow}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">{copy.title}</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">{summary}</p>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle mb-3">{copy.listLabel}</p>
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
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground-subtle mb-2">{copy.listLabel}</p>
                <p className="text-sm sm:text-base text-foreground font-medium mb-1">{activeEducation.course}</p>
                <p className="text-[11px] sm:text-xs text-muted-foreground mb-3">{activeEducation.institution} - {activeEducation.period}</p>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">{activeEducation.description}</p>

                {activeEducation.highlights && activeEducation.highlights.length > 0 && (
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground-subtle mb-2">{copy.highlightsLabel}</p>
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
