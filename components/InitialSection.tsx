'use client';

import HexaNode from '@/components/HexaNode';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { useRef, useEffect, useState, useCallback } from 'react';
import type { ReactElement } from 'react';
import ReactiveGridBackground from '@/components/Reactivegridbackground';

gsap.registerPlugin(ScrambleTextPlugin);

type LanguageCode = 'PT' | 'EN' | 'ES' | 'FR';

interface Language {
  code: LanguageCode;
  country: string;
  name: string;
  greeting: string;
  description: string;
  tip: string;
  explore: string;
}

interface InitialSectionProps {
  onLanguageSelect?: (code: LanguageCode) => void;
}

const languages: Language[] = [
  {
    code: 'EN',
    country: 'US',
    name: 'English',
    greeting: 'Hello,',
    description: 'Select the language for a truly immersive experience',
    tip: 'Click the node lines to see the magic happening',
    explore: 'EXPLORE'
  },
  {
    code: 'PT',
    country: 'BR',
    name: 'Português',
    greeting: 'Olá,',
    description: 'Selecione o idioma para uma experiência imersiva',
    tip: 'Clique nas linhas do nó para ver a mágica acontecer',
    explore: 'EXPLORAR'
  },
  {
    code: 'ES',
    country: 'ES',
    name: 'Español',
    greeting: 'Hola,',
    description: 'Selecciona el idioma para una experiencia inmersiva',
    tip: 'Haz clic en las líneas del nodo para ver la magia',
    explore: 'EXPLORAR'
  },
  {
    code: 'FR',
    country: 'FR',
    name: 'Français',
    greeting: 'Bonjour,',
    description: 'Sélectionnez la langue pour une expérience immersive',
    tip: 'Cliquez sur les lignes du nœud pour voir la magie',
    explore: 'EXPLORER'
  },
];

const flagPaths: Record<string, ReactElement> = {
  BR: (
    <g>
      <rect width="100%" height="100%" fill="#009739" />
      <polygon points="50,8 95,50 50,92 5,50" fill="#FEDD00" />
      <circle cx="50" cy="50" r="20" fill="#012169" />
      <path d="M30,50 Q50,35 70,50 Q50,42 30,50" fill="#fff" />
    </g>
  ),
  US: (
    <g>
      <rect width="100%" height="100%" fill="#B22234" />
      {[0, 2, 4, 6, 8, 10, 12].map(i => (
        <rect key={i} y={i * 7.69} width="100%" height="7.69" fill={i % 2 === 0 ? '#B22234' : '#fff'} />
      ))}
      <rect width="40%" height="53.85%" fill="#3C3B6E" />
      {Array.from({ length: 30 }).map((_, i) => {
        const row = Math.floor(i / 6);
        const col = i % 6;
        const offset = row % 2 === 0 ? 0 : 3;
        return (
          <circle
            key={i}
            cx={4 + (col * 6.5) + offset}
            cy={4 + row * 5.4}
            r="1.5"
            fill="#fff"
          />
        );
      })}
    </g>
  ),
  ES: (
    <g>
      <rect width="100%" height="25%" fill="#AA151B" />
      <rect y="25%" width="100%" height="50%" fill="#F1BF00" />
      <rect y="75%" width="100%" height="25%" fill="#AA151B" />
    </g>
  ),
  FR: (
    <g>
      <rect width="33.33%" height="100%" fill="#002395" />
      <rect x="33.33%" width="33.33%" height="100%" fill="#fff" />
      <rect x="66.66%" width="33.34%" height="100%" fill="#ED2939" />
    </g>
  ),
};

function StylizedFlag({ country, isHovered }: { country: string; isHovered: boolean }) {
  return (
    <div className="relative w-16 h-16 sm:w-20 sm:h-20">
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0"
        animate={{
          opacity: isHovered ? 0.6 : 0,
          scale: isHovered ? 1.3 : 1,
        }}
        transition={{ duration: 0.4 }}
        style={{
          background: 'radial-gradient(circle, rgba(155,92,255,0.4) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full rounded-2xl overflow-hidden"
        style={{
          filter: isHovered
            ? 'drop-shadow(0 0 30px rgba(155,92,255,0.5))'
            : 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))',
        }}
        animate={{
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <defs>
          <clipPath id={`clip-${country}`}>
            <rect width="100" height="100" rx="16" />
          </clipPath>
          <linearGradient id={`shine-${country}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
          </linearGradient>
        </defs>

        <g clipPath={`url(#clip-${country})`}>
          {flagPaths[country]}
          <rect
            width="100%"
            height="100%"
            fill={`url(#shine-${country})`}
            style={{ mixBlendMode: 'overlay' }}
          />
        </g>

        <rect
          width="100"
          height="100"
          rx="16"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
      </motion.svg>

      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          boxShadow: isHovered
            ? 'inset 0 0 30px rgba(155,92,255,0.3)'
            : 'inset 0 0 0px transparent',
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}

export default function InitialSection({ onLanguageSelect }: InitialSectionProps) {
  const [shockwave, setShockwave] = useState<{ position: { x: number; y: number } } | null>(null);
  const [activeGreeting, setActiveGreeting] = useState(0);
  const [hoveredLang, setHoveredLang] = useState<number | null>(null);
  const [selectedLang, setSelectedLang] = useState<number | null>(null);
  const [showTip, setShowTip] = useState(false);

  const greetingRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const tipRef = useRef<HTMLParagraphElement>(null);
  const exploreRef = useRef<HTMLButtonElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showExplore, setShowExplore] = useState(false);

  const handleLineClick = useCallback((_lineIndex: number, clickPosition: { x: number; y: number }) => {
    setShockwave({ position: clickPosition });
    setTimeout(() => setShockwave(null), 50);
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.5 });

    if (greetingRef.current) {
      gsap.set(greetingRef.current, { opacity: 1 });

      tl.to(
        greetingRef.current,
        {
          duration: 1.2,
          scrambleText: {
            text: languages[0].greeting,
            chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            revealDelay: 0.5,
            speed: 0.3,
          },
          ease: 'none',
        },
        0
      );
    }

    lineRefs.current.forEach((ref, index) => {
      if (ref) {
        gsap.set(ref, { scaleX: 0, opacity: 0 });
        tl.to(
          ref,
          {
            scaleX: 1,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
          },
          0.8 + index * 0.15
        );
      }
    });

    if (descriptionRef.current) {
      gsap.set(descriptionRef.current, { opacity: 1 });
      tl.to(
        descriptionRef.current,
        {
          duration: 1.5,
          scrambleText: {
            text: languages[0].description,
            chars: 'abcdefghijklmnopqrstuvwxyz ',
            revealDelay: 0.4,
            speed: 0.4,
          },
          ease: 'none',
        },
        1.2
      );
    }

    tl.call(() => setShowTip(true), [], 3.8);
    tl.call(() => setShowExplore(true), [], 4.8);
  }, []);

  useEffect(() => {
    if (!showTip || !tipRef.current) return;

    gsap.fromTo(
      tipRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.3,
        onComplete: () => {
          if (tipRef.current) {
            gsap.to(tipRef.current, {
              duration: 1.2,
              scrambleText: {
                text: languages[activeGreeting].tip,
                chars: 'abcdefghijklmnopqrstuvwxyz ',
                revealDelay: 0.3,
                speed: 0.4,
              },
              ease: 'none',
            });
          }
        },
      }
    );
  }, [showTip]);

  useEffect(() => {
    if (!showExplore || !exploreRef.current) return;

    gsap.fromTo(
      exploreRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        onComplete: () => {
          if (exploreRef.current) {
            gsap.to(exploreRef.current, {
              duration: 0.8,
              scrambleText: {
                text: languages[activeGreeting].explore,
                chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                revealDelay: 0.2,
                speed: 0.5,
              },
              ease: 'none',
            });
          }
        },
      }
    );
  }, [showExplore]);

  const handleHover = useCallback((index: number) => {
    setHoveredLang(index);
    setActiveGreeting(index);

    if (greetingRef.current) {
      gsap.to(greetingRef.current, {
        duration: 0.5,
        scrambleText: {
          text: languages[index].greeting,
          chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
          revealDelay: 0.15,
          speed: 0.6,
        },
        ease: 'none',
      });
    }

    if (descriptionRef.current) {
      gsap.to(descriptionRef.current, {
        duration: 0.5,
        scrambleText: {
          text: languages[index].description,
          chars: 'abcdefghijklmnopqrstuvwxyz ',
          revealDelay: 0.15,
          speed: 0.6,
        },
        ease: 'none',
      });
    }

    if (tipRef.current && showTip) {
      gsap.to(tipRef.current, {
        duration: 0.5,
        scrambleText: {
          text: languages[index].tip,
          chars: 'abcdefghijklmnopqrstuvwxyz ',
          revealDelay: 0.15,
          speed: 0.6,
        },
        ease: 'none',
      });
    }

    if (exploreRef.current && showExplore) {
      gsap.to(exploreRef.current, {
        duration: 0.5,
        scrambleText: {
          text: languages[index].explore,
          chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
          revealDelay: 0.15,
          speed: 0.6,
        },
        ease: 'none',
      });
    }
  }, [showTip, showExplore]);

  const handleSelect = useCallback((index: number) => {
    setSelectedLang(index);
    const lang = languages[index];
    onLanguageSelect?.(lang.code);
  }, [onLanguageSelect]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 2.8 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 120,
        damping: 14,
      },
    },
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <ReactiveGridBackground shockwave={shockwave} />

      <motion.div
        initial={{ scale: 1.3, opacity: 0, filter: 'blur(30px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full"
      >
        <HexaNode size={75} color="#9b5cffc8" glowColor="#8b5cf688" onLineClick={handleLineClick}>
          <div className="text-white font-['Geist'] pointer-events-auto flex flex-col items-center justify-center">

            <div className="relative mb-8 sm:mb-10">
              <motion.div
                className="absolute -inset-20 opacity-30"
                animate={{
                  background: [
                    'radial-gradient(circle at 50% 50%, rgba(155,92,255,0.15) 0%, transparent 50%)',
                    'radial-gradient(circle at 50% 50%, rgba(155,92,255,0.25) 0%, transparent 60%)',
                    'radial-gradient(circle at 50% 50%, rgba(155,92,255,0.15) 0%, transparent 50%)',
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div
                ref={el => { lineRefs.current[0] = el; }}
                className="absolute -top-6 left-1/2 -translate-x-1/2 w-24 h-px bg-linear-to-r from-transparent via-white/30 to-transparent origin-center"
              />

              <div
                ref={greetingRef}
                className="text-6xl sm:text-7xl md:text-8xl font-extralight tracking-tight text-center select-none"
                style={{
                  background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  textShadow: '0 0 80px rgba(155,92,255,0.3)',
                }}
              >
                {languages[0].greeting}
              </div>

              <div
                ref={el => { lineRefs.current[1] = el; }}
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-36 h-px bg-linear-to-r from-transparent via-white/20 to-transparent origin-center"
              />
            </div>

            <motion.p
              ref={descriptionRef}
              className="text-[10px] sm:text-xs tracking-[0.25em] uppercase text-white/50 mb-10 sm:mb-12 text-center max-w-xs sm:max-w-sm"
            >
              {languages[0].description}
            </motion.p>

            <motion.div
              className="flex items-center gap-5 sm:gap-8 md:gap-10 mb-10"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {languages.map((lang, index) => (
                <motion.div
                  key={lang.code}
                  variants={itemVariants}
                  className="group flex flex-col items-center cursor-pointer"
                  onMouseEnter={() => handleHover(index)}
                  onMouseLeave={() => setHoveredLang(null)}
                  onClick={() => handleSelect(index)}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative">
                    <StylizedFlag
                      country={lang.country}
                      isHovered={hoveredLang === index || activeGreeting === index}
                    />

                    <AnimatePresence>
                      {selectedLang === index && (
                        <motion.div
                          className="absolute -inset-2 rounded-3xl border-2 border-[#9b5cff]"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.div
                    className="mt-4 flex flex-col items-center gap-0.5"
                    animate={{
                      opacity: hoveredLang === index || activeGreeting === index ? 1 : 0.4,
                      y: hoveredLang === index ? -3 : 0,
                    }}
                    transition={{ duration: 0.25 }}
                  >
                    <span className="text-[10px] tracking-[0.3em] font-medium">
                      {lang.code}
                    </span>
                    <span className="text-[8px] tracking-[0.15em] text-white/40 font-light">
                      {lang.name}
                    </span>
                  </motion.div>

                  <motion.div
                    className="mt-2 w-5 h-px bg-[#9b5cff]"
                    initial={{ scaleX: 0 }}
                    animate={{
                      scaleX: hoveredLang === index || activeGreeting === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="flex items-center gap-2 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.8, duration: 0.8 }}
            >
              {languages.map((_, index) => (
                <motion.div
                  key={index}
                  className="w-1 h-1 rounded-full cursor-pointer"
                  animate={{
                    backgroundColor: activeGreeting === index ? '#9b5cff' : 'rgba(255,255,255,0.2)',
                    scale: activeGreeting === index ? 1.4 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleHover(index)}
                />
              ))}
            </motion.div>

            <AnimatePresence>
              {showTip && (
                <motion.p
                  ref={tipRef}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-[9px] sm:text-[10px] tracking-[0.2em] text-white/30 text-center max-w-xs"
                >
                  {languages[0].tip}
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showExplore && (
                <motion.button
                  ref={exploreRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.5 }}
                  className="mt-8 px-8 py-3 bg-transparent border border-[#9b5cff40] text-white/70 text-xs tracking-[0.3em] rounded-sm hover:border-[#9b5cff] hover:text-white hover:bg-[#9b5cff10] transition-all duration-300"
                  onClick={() => {
                    const index = selectedLang ?? activeGreeting;
                    const lang = languages[index];
                    onLanguageSelect?.(lang.code);
                  }}
                >
                  {languages[0].explore}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </HexaNode>
      </motion.div>
    </main>
  );
}
