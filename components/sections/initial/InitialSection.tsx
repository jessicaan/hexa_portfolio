'use client';

import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import HexaNode from '../../hexagrid/HexaNode';
import ReactiveGridBackground from '../../background/ReactiveGridBackground';
import { useTheme } from '../../theme/ThemeProvider';
import { loadInitialContent } from '@/lib/content/client';
import {
  defaultInitialContent,
  type InitialSectionContent,
  type LanguageCode as ContentLanguageCode,
} from '@/lib/content/schema';

import LanguageSelector from './LanguageSelector';
import { languageMeta } from './constants';
import { InitialSectionProps, Language } from './types';
import { useIntroAnimation } from './useIntroAnimation';

gsap.registerPlugin(ScrambleTextPlugin);

export default function InitialSection({ onLanguageSelect, onExplore }: InitialSectionProps) {
  const [content, setContent] = useState<InitialSectionContent>(defaultInitialContent);
  const [shockwave, setShockwave] = useState<{ position: { x: number; y: number } } | null>(null);
  const [displayLanguageIndex, setDisplayLanguageIndex] = useState(0);
  const [currentSelectedLanguageIndex, setCurrentSelectedLanguageIndex] = useState<number | null>(null);
  const [hoveredLang, setHoveredLang] = useState<number | null>(null);

  const [showTip, setShowTip] = useState(false);
  const [showExplore, setShowExplore] = useState(false);


  const roleRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const tipRef = useRef<HTMLParagraphElement>(null);
  const exploreRef = useRef<HTMLButtonElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { primaryRgb, theme } = useTheme();

  useEffect(() => {
    let active = true;
    loadInitialContent()
      .then(data => { if (active) setContent(data); })
      .catch(err => console.error(err));
    return () => { active = false; };
  }, []);

  const languages = useMemo<Language[]>(() => {
    const available = new Set(
      (content.languagesAvailable?.length ? content.languagesAvailable : ['pt']).map(c => c.toLowerCase())
    );

    const mapped = languageMeta
      .filter(meta => available.has(meta.code.toLowerCase()))
      .map(meta => {
        const contentCode = meta.code.toLowerCase() as ContentLanguageCode;
        const translation = contentCode === 'pt' ? null : content.translations?.[contentCode as Exclude<ContentLanguageCode, 'pt'>];
        return {
          code: meta.code,
          country: meta.country,
          name: meta.name,
          role: meta.role, // Mapeando o Role
          greeting: translation?.headline || content.headline || meta.fallbackGreeting,
          description: translation?.subheadline || content.subheadline || meta.fallbackDescription,
          tip: translation?.description || content.description || meta.tip,
          explore: meta.explore,
        };
      });

    return mapped.length ? mapped : [languageMeta[0] as unknown as Language];
  }, [content]);

  const activeLanguage = useMemo(() => languages[displayLanguageIndex] ?? languages[0], [languages, displayLanguageIndex]);

  useEffect(() => {
    setDisplayLanguageIndex(0);
    setCurrentSelectedLanguageIndex(null);
  }, [languages.length]);

  const handleLineClick = useCallback((_: number, pos: { x: number; y: number }) => {
    setShockwave({ position: pos });
    setTimeout(() => setShockwave(null), 50);
  }, []);

  useIntroAnimation({
    languages,
    greetingRef,
    descriptionRef,
    lineRefs,
    onShowTip: () => setShowTip(true),
    onShowExplore: () => setShowExplore(true),
  });

  const animateText = useCallback((ref: React.RefObject<HTMLElement | null>, text: string, speed: number, chars: string) => {
    if (ref.current) {
      gsap.to(ref.current, {
        duration: 0.5,
        scrambleText: { text, chars, revealDelay: 0.1, speed },
        ease: 'none',
      });
    }
  }, []);

  const handleHover = useCallback((index: number | null) => {
    setHoveredLang(index);
    if (index !== null) {
      setDisplayLanguageIndex(index);
      const lang = languages[index];
      const roleText = lang.role ?? languageMeta.find((meta) => meta.code === lang.code)?.role ?? '';

      animateText(roleRef, roleText, 0.6, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_#');

      animateText(greetingRef, lang.greeting, 0.6, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
      animateText(descriptionRef, lang.description, 0.6, 'abcdefghijklmnopqrstuvwxyz ');
      if (showTip) animateText(tipRef, lang.tip, 0.6, 'abcdefghijklmnopqrstuvwxyz ');
      if (showExplore) animateText(exploreRef, lang.explore, 0.6, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    }
  }, [languages, showTip, showExplore, animateText]);

  useEffect(() => {
    if (showTip && tipRef.current && activeLanguage) {
      gsap.fromTo(tipRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      animateText(tipRef, activeLanguage.tip, 0.4, 'abcdefghijklmnopqrstuvwxyz ');
    }
  }, [showTip, activeLanguage, animateText]);

  useEffect(() => {
    if (showExplore && exploreRef.current && activeLanguage) {
      gsap.fromTo(exploreRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
      animateText(exploreRef, activeLanguage.explore, 0.5, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
    }
  }, [showExplore, activeLanguage, animateText]);

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <ReactiveGridBackground shockwave={shockwave} />

      <motion.div
        initial={{ scale: 1.3, opacity: 0, filter: 'blur(30px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full"
      >
        <HexaNode size={75} mobileSize={85} mobileStretch={1.35} onLineClick={handleLineClick}>
          <div className="text-foreground font-['Geist'] pointer-events-auto flex flex-col items-center justify-center px-4 sm:px-0">

            <div className="flex flex-col items-center mb-6 sm:mb-8 opacity-80 z-10">
              <div
                className="text-[8px] sm:text-[9px] tracking-[0.3em] font-light text-muted-foreground/60 uppercase mb-2"
              >
                Portfolio
              </div>


              <h2 className="text-sm sm:text-lg tracking-[0.35em] font-thin text-foreground mb-2 uppercase text-center">
                Jéssica Vieira
              </h2>

              <div
                ref={roleRef}
                className="text-[9px] sm:text-[10px] tracking-[0.25em] font-light text-primary uppercase"
                style={{ textShadow: `0 0 15px rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},0.6)` }}
              >
                {activeLanguage?.role ?? languageMeta[0].role}
              </div>
            </div>


            <div className="relative mb-4 sm:mb-8 md:mb-10">
              <motion.div
                className="absolute -inset-20 opacity-30"
                animate={{
                  background: [
                    `radial-gradient(circle at 50% 50%, rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},0.15) 0%, transparent 50%)`,
                    `radial-gradient(circle at 50% 50%, rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},0.25) 0%, transparent 60%)`,
                    `radial-gradient(circle at 50% 50%, rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},0.15) 0%, transparent 50%)`,
                  ],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />

              <div
                ref={el => { lineRefs.current[0] = el; }}
                className="absolute -top-3 sm:-top-6 left-1/2 -translate-x-1/2 w-16 sm:w-24 h-px origin-center"
                style={{ background: `linear-gradient(to right, transparent, rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},0.3), transparent)` }}
              />

              <div
                ref={greetingRef}
                className="text-6xl sm:text-6xl md:text-7xl lg:text-8xl font-extralight tracking-tight text-center select-none"
                style={{
                  backgroundImage: theme === 'dark'
                    ? 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)'
                    : 'linear-gradient(180deg, #1a1a1a 0%, rgba(26,26,26,0.7) 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                  textShadow: `0 0 80px rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},0.3)`,
                }}
              >
                {activeLanguage?.greeting ?? languageMeta[0].fallbackGreeting}
              </div>

              <div
                ref={el => { lineRefs.current[1] = el; }}
                className="absolute -bottom-3 sm:-bottom-6 left-1/2 -translate-x-1/2 w-24 sm:w-36 h-px origin-center"
                style={{ background: `linear-gradient(to right, transparent, rgba(${primaryRgb.r},${primaryRgb.g},${primaryRgb.b},0.2), transparent)` }}
              />
            </div>

            <motion.p
              ref={descriptionRef}
              className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.2em] sm:tracking-[0.25em] uppercase text-muted-foreground-subtle mb-6 sm:mb-10 md:mb-12 text-center max-w-[280px] sm:max-w-xs md:max-w-sm"
            >
              {activeLanguage?.description ?? languageMeta[0].fallbackDescription}
            </motion.p>

            <LanguageSelector
              languages={languages}
              activeGreeting={displayLanguageIndex}
              hoveredLang={hoveredLang}
              selectedLang={currentSelectedLanguageIndex}
              primaryRgb={primaryRgb}
              onHover={handleHover}
              onSelect={(idx) => {
                setCurrentSelectedLanguageIndex(idx);
                setDisplayLanguageIndex(idx);
                onLanguageSelect?.(languages[idx].code);
              }}
            />

            <AnimatePresence>
              {showTip && activeLanguage && (
                <motion.p
                  ref={tipRef}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-[10px] sm:text-xs md:text-xs tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground-subtle text-center max-w-[260px] sm:max-w-xs"
                >
                  {activeLanguage.tip}
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showExplore && activeLanguage && (
                <motion.button
                  ref={exploreRef}
                  className="mt-4 sm:mt-8 px-6 sm:px-8 py-2.5 sm:py-3 bg-transparent border border-primary/30 text-muted-foreground text-xs sm:text-md tracking-[0.25em] sm:tracking-[0.3em] rounded-sm hover:border-primary hover:text-foreground hover:bg-primary/10 transition-all duration-100"
                  onClick={() => {
                    const index = currentSelectedLanguageIndex ?? displayLanguageIndex;
                    const lang = languages[index] ?? languages[0];
                    if (lang) onExplore?.(lang.code);
                  }}
                >
                  {activeLanguage.explore}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </HexaNode>
      </motion.div>
    </main>
  );
}
