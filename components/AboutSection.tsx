'use client';

import { motion } from 'framer-motion';
import ReactiveGridBackground from '@/components/Reactivegridbackground';

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
    body: 'Sou um desenvolvedor focado em criar experiências digitais imersivas, unindo animação, microinterações e interfaces cuidadosas para contar boas histórias em qualquer idioma.',
  },
  EN: {
    heading: 'About me',
    body: 'I am a developer focused on crafting immersive digital experiences, combining motion, micro‑interactions and thoughtful interfaces to tell stories in any language.',
  },
  ES: {
    heading: 'Sobre mí',
    body: 'Soy un desarrollador enfocado en crear experiencias digitales inmersivas, combinando animación, microinteracciones e interfaces cuidadas para contar buenas historias en cualquier idioma.',
  },
  FR: {
    heading: 'À propos de moi',
    body: 'Je suis un développeur concentré sur la création d’expériences numériques immersives, mêlant animation, micro‑interactions et interfaces soignées pour raconter de belles histoires dans toutes les langues.',
  },
};

export default function AboutSection({ language = 'EN' }: AboutSectionProps) {
  const label = languageLabels[language];
  const copy = introCopy[language];

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <ReactiveGridBackground />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full h-full px-6 sm:px-10 gap-10 md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl text-center md:text-left text-white"
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-white/50 mb-4">
            {label} · About
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-6">
            {copy.heading}
          </h1>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed">
            {copy.body}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="w-[240px] sm:w-[260px] md:w-[300px] aspect-[9/16] rounded-3xl border border-white/12 bg-white/5 bg-gradient-to-b from-white/5 via-white/2 to-transparent shadow-[0_18px_60px_rgba(0,0,0,0.55)] backdrop-blur-md flex items-center justify-center overflow-hidden"
        >
          {/* Substitua este bloco pelo elemento <video> de cada idioma */}
          <div className="flex flex-col items-center justify-center text-center px-4">
            <span className="text-xs uppercase tracking-[0.25em] text-white/60 mb-3">
              {label}
            </span>
            <span className="text-[11px] sm:text-xs text-white/70">
              Espaço reservado para o seu vídeo vertical (9:16) em {label}. Basta trocar este bloco
              por um elemento <code>&lt;video&gt;</code> específico para cada idioma.
            </span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
