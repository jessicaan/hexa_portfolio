'use client';

import HexaNode from '@/components/HexaNode';
import ReactCountryFlag from 'react-country-flag';
import { motion, Variants } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { useRef, useEffect, useState } from 'react';
import ReactiveGridBackground from '@/components/Reactivegridbackground';

gsap.registerPlugin(ScrambleTextPlugin);

export default function Home() {
  const [shockwave, setShockwave] = useState<{ position: { x: number; y: number } } | null>(null);

  const handleLineClick = (_lineIndex: number, clickPosition: { x: number; y: number }) => {
    setShockwave({ position: clickPosition });
    setTimeout(() => setShockwave(null), 50);
  };

  const languages = [
    { code: 'PT', country: 'BR' },
    { code: 'EN', country: 'US' },
    { code: 'ES', country: 'ES' },
    { code: 'FR', country: 'FR' },
  ];

  const greetings = ['Olá,', 'Hola,', 'Hello,', 'Salut!'];
  const colors = ['#FFD700', '#E8E8E8', '#C9B037', '#B8860B'];

  const greetingRefs = useRef<(HTMLDivElement | null)[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);

  const [hoverStyles, setHoverStyles] = useState<((React.CSSProperties & { '--mouse-x'?: string; '--mouse-y'?: string }) | null)[]>([]);
  const [scrambleComplete, setScrambleComplete] = useState(false);

  useEffect(() => {
    const timeline = gsap.timeline({ delay: 0.5 });

    greetingRefs.current.forEach((ref, index) => {
      if (ref) {
        const originalText = greetings[index];

        timeline.to(
          ref,
          {
            duration: 1.4,
            scrambleText: {
              text: originalText,
              chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
              revealDelay: 0.4,
              speed: 0.4,
            },
            ease: 'power2.out',
            onComplete: () => {
              if (ref) ref.textContent = originalText;
            },
          },
          index * 0.2
        );
      }
    });

    if (subtitleRef.current) {
      const originalSubtitle = 'Select your preferred language';

      timeline.to(
        subtitleRef.current,
        {
          duration: 1.4,
          scrambleText: {
            text: originalSubtitle,
            chars: 'abcdefghijklmnopqrstuvwxyz ',
            revealDelay: 0.3,
            speed: 0.5,
          },
          ease: 'power2.out',
          onComplete: () => {
            if (subtitleRef.current) {
              subtitleRef.current.textContent = originalSubtitle;
            }
            setScrambleComplete(true);
          },
        },
        greetings.length * 0.18
      );
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    if (!scrambleComplete) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newStyles = [...hoverStyles];
    newStyles[index] = {
      '--mouse-x': `${x}px`,
      '--mouse-y': `${y}px`,
      backgroundImage: `radial-gradient(circle 180px at var(--mouse-x) var(--mouse-y), ${colors[index]} 0%, rgba(255,255,255,0.5) 40%, transparent 100%)`,
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      color: 'transparent',
      transition: 'all .2s ease-out',
    };
    setHoverStyles(newStyles);
  };

  const handleMouseLeave = (index: number) => {
    const newStyles = [...hoverStyles];
    newStyles[index] = null;
    setHoverStyles(newStyles);
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.35, delayChildren: 1.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50, rotateX: -90, scale: 0.85 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 16,
        duration: 1.2,
      },
    },
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <ReactiveGridBackground
        shockwave={shockwave}
      />

      <motion.div
        initial={{ scale: 1.7, opacity: 0, filter: 'blur(30px)' }}
        animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
        transition={{
          duration: 2,
          ease: [0.25, 0.46, 0.45, 0.94],
        }}
        className="w-full h-full"
      >
        <HexaNode size={75} color="#9b5cffc8" glowColor="#8b5cf688" onLineClick={handleLineClick}>
          <div className="text-white font-['Geist'] pointer-events-auto px-8 py-6">

            <motion.div
              className="text-7xl text-center md:text-8xl font-extrabold mb-14 flex flex-col tracking-tight"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              style={{ perspective: '1000px' }}
            >
              {greetings.map((greeting, index) => (
                <motion.div
                  key={greeting}
                  ref={(el) => { greetingRefs.current[index] = el; }}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.12,
                    rotateX: 10,
                    transition: {
                      duration: 0.35,
                      ease: [0.34, 1.56, 0.64, 1]
                    }
                  }}
                  onMouseMove={(e) => handleMouseMove(e, index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                  className="select-none cursor-pointer mb-3"
                  style={{
                    ...(hoverStyles[index] ?? {
                      background: 'linear-gradient(135deg, #ffffff 0%, #dcdcdc 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }),
                    textShadow: '0 0 40px rgba(255,255,255,0.15)',
                  }}
                >
                  {greeting}
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.3 }}
              className="mb-16"
            >
              <p
                ref={subtitleRef}
                className="text-base font-light tracking-[0.28em] uppercase text-white/60 text-center"
              >
                Select your preferred language
              </p>

              <motion.div
                className="w-24 h-px bg-linear-to-r from-transparent via-white/40 to-transparent mx-auto mt-6"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 3 }}
              />
            </motion.div>

            <motion.div className="flex justify-center gap-12">
              {languages.map((lang, index) => (
                <motion.div
                  key={lang.code}
                  className="group flex flex-col items-center cursor-pointer"
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 2.8 + index * 0.15,
                    ease: [0.34, 1.56, 0.64, 1]
                  }}
                  whileHover={{
                    scale: 1.15,
                    y: -10,
                    rotateZ: 2,
                    transition: { duration: 0.4 }
                  }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-80 transition-all duration-500 bg-[radial-gradient(circle_at_50%_50%,rgba(155,92,255,0.35),transparent_70%)]" />

                    <ReactCountryFlag
                      countryCode={lang.country}
                      svg
                      style={{ width: '5.5em', height: '5.5em' }}
                      className="relative rounded-3xl border border-white/8 shadow-[0_8px_32px_rgba(0,0,0,0.45)] group-hover:shadow-[0_20px_60px_rgba(155,92,255,0.35)] transition-all duration-500"
                    />
                  </div>

                  <motion.span
                    className="mt-4 text-xs tracking-[0.25em] text-white/55 group-hover:text-white/95"
                    whileHover={{ letterSpacing: '0.35em' }}
                  >
                    {lang.code}
                  </motion.span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </HexaNode>
      </motion.div>
    </main>
  );
}