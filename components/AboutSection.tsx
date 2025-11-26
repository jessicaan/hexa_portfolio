'use client';

import { motion } from 'framer-motion';
import ReactiveGridBackground from '@/components/Reactivegridbackground';
import { useTheme } from '@/components/ThemeProvider';

type LanguageCode = 'PT' | 'EN' | 'ES' | 'FR';

interface AboutSectionProps {
  language?: LanguageCode | null;
}

const languageLabels: Record<LanguageCode, string> = {
  PT: 'Português',
  EN: 'English',
  ES: 'Español',
  FR: 'Français',
};

const introCopy: Record<LanguageCode, { heading: string; body: string }> = {
  PT: {
    heading: 'Sobre mim',
    body:
      'Sou um desenvolvedor focado em criar experiências digitais imersivas, unindo animação, microinterações e interfaces cuidadosas para contar boas histórias em qualquer idioma.',
  },
  EN: {
    heading: 'About me',
    body:
      'I am a developer focused on crafting immersive digital experiences, combining motion, microinteractions and thoughtful interfaces to tell stories in any language.',
  },
  ES: {
    heading: 'Sobre mí',
    body:
      'Soy un desarrollador enfocado en crear experiencias digitales inmersivas, combinando animación, microinteracciones e interfaces cuidadas para contar buenas historias en cualquier idioma.',
  },
  FR: {
    heading: 'À propos de moi',
    body:
      "Je suis un développeur concentré sur la création d'expériences numériques immersives, mêlant animation, microinteractions et interfaces soignées pour raconter de belles histoires dans toutes les langues.",
  },
};

export default function AboutSection({ language = 'EN' }: AboutSectionProps) {
  const safeLang: LanguageCode = (language ?? 'EN') as LanguageCode;
  const label = languageLabels[safeLang];
  const copy = introCopy[safeLang];

  const { primaryRgb, theme } = useTheme();

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <ReactiveGridBackground />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full h-full px-6 sm:px-10 gap-10 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl text-center md:text-left text-foreground"
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-muted-foreground-subtle mb-4">
            {label} · About
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            {copy.heading}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {copy.body}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="w-60 sm:w-[260px] md:w-[300px] aspect-9/16 rounded-3xl border border-border-subtle overflow-hidden"
          style={{
            background: theme === 'dark'
              ? `linear-gradient(to bottom, rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},0.1), rgba(10,10,15,0.95))`
              : `linear-gradient(to bottom, rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},0.1), rgba(255,255,255,0.95))`,
            boxShadow: `0 18px 60px rgba(0,0,0,${theme === 'dark' ? 0.55 : 0.15})`,
          }}
        >
          <div className="w-full h-full backdrop-blur-md flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-center px-4">
              <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-3">
                {label}
              </span>
              <span className="text-[11px] sm:text-xs text-muted-foreground">
                Espaço reservado para o seu vídeo vertical (9:16) em {label}. Basta trocar este
                bloco por um elemento &lt;video&gt; específico para cada idioma.
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}