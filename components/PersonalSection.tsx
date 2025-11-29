'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import ReactiveGridBackground from '@/components/Reactivegridbackground';
import { useTheme } from '@/components/ThemeProvider';
import { loadPersonalContent } from '@/lib/content/client';
import { defaultPersonalContent, type PersonalContent, type Trait, type HobbyCard, type LanguageCode } from '@/lib/content/schema';
import { useTranslation } from 'react-i18next';

interface PersonalSectionProps {}

export default function PersonalSection({}: PersonalSectionProps) {
  const { i18n } = useTranslation();
  const language = i18n.language as LanguageCode;

  const [content, setContent] = useState<PersonalContent>(defaultPersonalContent);
  const [loading, setLoading] = useState(true);

  // Moved useTheme and translation to the top
  const { primaryRgb, theme } = useTheme();
  const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;

  const translation = useMemo(() => {
    return content.translations[language] || content.translations['en'];
  }, [content.translations, language]);

  useEffect(() => {
    const fetchPersonal = async () => {
      try {
        const data = await loadPersonalContent();
        setContent(data);
      } catch (error) {
        console.error("Failed to load personal content:", error);
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
        <div className="relative z-10 flex items-center justify-center w-full h-full px-6 text-center">
          <p className="text-muted-foreground">Loading personal information...</p>
        </div>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="relative w-screen h-screen overflow-hidden">
        <ReactiveGridBackground />
        <div className="relative z-10 flex items-center justify-center w-full h-full px-6 text-center">
          <p className="text-muted-foreground">Failed to load personal data.</p>
        </div>
      </main>
    );
  }

  const size = 260;
  const center = size / 2;
  const maxRadius = 90;

  const getPoint = (value: number, index: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const radius = maxRadius * value;
    return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
  };

  const polygonPoints = content.traits.map((trait, index) => getPoint(trait.value, index, content.traits.length)).join(' ');

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <ReactiveGridBackground />
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full h-full px-6 sm:px-10 gap-10 lg:gap-16">
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl text-center lg:text-left text-foreground">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-muted-foreground-subtle mb-4">{translation.eyebrow}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-5">{translation.title}</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">{translation.description}</p>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-muted-foreground-subtle mb-3">{translation.hobbiesLabel}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {content.hobbyCards.map((card: HobbyCard, idx: number) => {
              const translatedHobby = translation.translatedHobbies?.[idx];
              return (
                <div key={card.id} className="rounded-2xl border border-border-subtle bg-surface-soft px-4 py-4" style={{ boxShadow: `0 10px 30px rgba(0,0,0,${theme === 'dark' ? 0.6 : 0.15})` }}>
                  <p className="text-xs sm:text-sm text-foreground font-medium mb-1">{translatedHobby?.title || card.title}</p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground">{translatedHobby?.description || card.description}</p>
                </div>
              );
            })}
          </div>
        </motion.section>
        <motion.section initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="w-full max-w-xl">
          <div className="rounded-3xl border border-border-subtle bg-surface-soft backdrop-blur-md px-4 py-4 sm:px-6 sm:py-6 flex flex-col md:flex-row gap-6 items-center" style={{ boxShadow: `0 18px 60px rgba(0,0,0,${theme === 'dark' ? 0.6 : 0.15})` }}>
            <svg viewBox={`0 0 ${size} ${size}`} className="w-52 h-52 sm:w-60 sm:h-60">
              <defs><radialGradient id="trait-fill" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={primaryColor} stopOpacity="0.35" /><stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.05" /></radialGradient></defs>
              {[0.35, 0.7, 1].map((level, idx) => (<polygon key={level} points={content.traits.map((_, i) => getPoint(level, i, content.traits.length)).join(' ')} fill="none" stroke={theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'} strokeWidth={idx === 2 ? 1.2 : 0.6} />))}
              {content.traits.map((_, index) => { const angle = (Math.PI * 2 * index) / content.traits.length - Math.PI / 2; return (<line key={index} x1={center} y1={center} x2={center + maxRadius * Math.cos(angle)} y2={center + maxRadius * Math.sin(angle)} stroke={theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'} strokeWidth={0.6} />); })}
              <polygon points={polygonPoints} fill="url(#trait-fill)" stroke={primaryColor} strokeWidth={1.5} />
              {content.traits.map((trait, index) => { const [xStr, yStr] = getPoint(trait.value, index, content.traits.length).split(','); return (<circle key={trait.id} cx={parseFloat(xStr)} cy={parseFloat(yStr)} r={3} fill={primaryColor} stroke={theme === 'dark' ? '#ffffff' : '#1a1a1a'} strokeWidth={1} />); })}
              {content.traits.map((trait, index) => { const angle = (Math.PI * 2 * index) / content.traits.length - Math.PI / 2; return (<text key={trait.id} x={center + (maxRadius + 18) * Math.cos(angle)} y={center + (maxRadius + 18) * Math.sin(angle)} textAnchor="middle" dominantBaseline="middle" fill={theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'} fontSize="9" style={{ letterSpacing: '0.08em' }}>{translation.translatedTraits[index]?.label.toUpperCase() || trait.label.toUpperCase()}</text>); })}
            </svg>
            <div className="flex-1 space-y-3 text-xs sm:text-sm text-muted-foreground">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground-subtle">{translation.howToReadGraphTitle}</p>
              <p>{translation.howToReadGraphDescription}</p>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
