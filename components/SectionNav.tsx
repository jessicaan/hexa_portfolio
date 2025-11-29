'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { useTranslation } from 'react-i18next';
import { useTheme } from './ThemeProvider';

gsap.registerPlugin(ScrambleTextPlugin);

interface NavItem {
    id: string;
    label: string;
}

interface SectionNavProps {
    items: NavItem[];
    activeId: string;
    onNavigate: (id: string) => void;
    visible?: boolean;
}

const navLabels: Record<string, Record<string, string>> = {
    en: {
        home: 'Home',
        about: 'About',
        experience: 'Experience',
        education: 'Education',
        projects: 'Projects',
        personal: 'Personal',
        contact: 'Contact',
    },
    pt: {
        home: 'Início',
        about: 'Sobre',
        experience: 'Experiência',
        education: 'Formação',
        projects: 'Projetos',
        personal: 'Pessoal',
        contact: 'Contato',
    },
    es: {
        home: 'Inicio',
        about: 'Sobre mí',
        experience: 'Experiencia',
        education: 'Educación',
        projects: 'Proyectos',
        personal: 'Personal',
        contact: 'Contacto',
    },
    fr: {
        home: 'Accueil',
        about: 'À propos',
        experience: 'Expérience',
        education: 'Formation',
        projects: 'Projets',
        personal: 'Personnel',
        contact: 'Contact',
    },
};

export default function SectionNav({ items, activeId, onNavigate, visible = true }: SectionNavProps) {
    const { i18n } = useTranslation();
    const language = i18n.language || 'en';
    const labels = navLabels[language] || navLabels.en;

    const labelRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
    const prevActiveRef = useRef(activeId);
    const { primaryRgb } = useTheme();

    const [isMobile, setIsMobile] = useState(false);

    const activeIndex = items.findIndex(n => n.id === activeId);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (prevActiveRef.current !== activeId) {
            const labelEl = labelRefs.current.get(activeId);
            if (labelEl) {
                const label = labels[activeId] || items.find(n => n.id === activeId)?.label || activeId;
                gsap.to(labelEl, {
                    duration: 0.5,
                    scrambleText: {
                        text: label,
                        chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                        revealDelay: 0.2,
                        speed: 0.5,
                    },
                    ease: 'none',
                });
            }
            prevActiveRef.current = activeId;
        }
    }, [activeId, items, labels]);

    const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;
    const primaryColorSoft = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.2)`;

    if (isMobile) {
        return (
            <AnimatePresence>
                {visible && (
                    <motion.nav
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.5 }}
                        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2"
                    >
                        {items.map((item, index) => {
                            const isActive = item.id === activeId;
                            const isPast = index < activeIndex;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => onNavigate(item.id)}
                                    className="group relative p-1"
                                >
                                    <motion.div
                                        className="w-2 h-2 rounded-full border-[1.5px] transition-colors duration-300"
                                        style={{
                                            borderColor: isActive || isPast ? primaryColor : 'hsl(var(--border-subtle))',
                                            backgroundColor: isActive
                                                ? primaryColor
                                                : isPast
                                                    ? primaryColorSoft
                                                    : 'transparent',
                                        }}
                                        animate={{
                                            scale: isActive ? 1.4 : 1,
                                        }}
                                        whileHover={{
                                            scale: 1.5,
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />

                                    {isActive && (
                                        <motion.div
                                            className="absolute inset-0 m-1 rounded-full"
                                            style={{ backgroundColor: primaryColor }}
                                            initial={{ scale: 1, opacity: 0.5 }}
                                            animate={{
                                                scale: [1, 2.5, 1],
                                                opacity: [0.5, 0, 0.5],
                                            }}
                                            transition={{
                                                duration: 2.5,
                                                repeat: Infinity,
                                                ease: 'easeInOut',
                                            }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </motion.nav>
                )}
            </AnimatePresence>
        );
    }

    return (
        <AnimatePresence>
            {visible && (
                <motion.nav
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.5 }}
                    className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col items-end text-muted-foreground-subtle"
                >
                    {items.map((item, index) => {
                        const isActive = item.id === activeId;
                        const isPast = index < activeIndex;
                        const isLast = index === items.length - 1;
                        const label = labels[item.id] || item.label;

                        return (
                            <div key={item.id} className="flex flex-col items-end">
                                <button
                                    onClick={() => onNavigate(item.id)}
                                    className="group flex items-center gap-3 py-3"
                                >
                                    <motion.span
                                        ref={el => {
                                            if (el) labelRefs.current.set(item.id, el);
                                        }}
                                        className="text-[10px] tracking-[0.25em] uppercase transition-colors duration-300"
                                        style={{
                                            color: isActive
                                                ? 'hsl(var(--foreground))'
                                                : isPast
                                                    ? primaryColor
                                                    : 'hsl(var(--muted-foreground-subtle))',
                                        }}
                                        animate={{
                                            opacity: isActive ? 1 : 0.3,
                                            x: isActive ? 0 : 8,
                                        }}
                                        whileHover={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {label}
                                    </motion.span>

                                    <div className="relative">
                                        <motion.div
                                            className="w-2.5 h-2.5 rounded-full border-[1.5px] transition-colors duration-300"
                                            style={{
                                                borderColor: isActive || isPast ? primaryColor : 'hsl(var(--border-subtle))',
                                                backgroundColor: isActive
                                                    ? primaryColor
                                                    : isPast
                                                        ? primaryColorSoft
                                                        : 'transparent',
                                            }}
                                            animate={{
                                                scale: isActive ? 1.3 : 1,
                                            }}
                                            whileHover={{
                                                scale: 1.4,
                                            }}
                                            transition={{ duration: 0.3 }}
                                        />

                                        {isActive && (
                                            <motion.div
                                                className="absolute inset-0 rounded-full"
                                                style={{ backgroundColor: primaryColor }}
                                                initial={{ scale: 1, opacity: 0.5 }}
                                                animate={{
                                                    scale: [1, 2.5, 1],
                                                    opacity: [0.5, 0, 0.5],
                                                }}
                                                transition={{
                                                    duration: 2.5,
                                                    repeat: Infinity,
                                                    ease: 'easeInOut',
                                                }}
                                            />
                                        )}
                                    </div>
                                </button>

                                {!isLast && (
                                    <div className="flex justify-end pr-1">
                                        <div
                                            className="w-px h-6 transition-colors duration-300"
                                            style={{
                                                backgroundColor:
                                                    index < activeIndex ? primaryColorSoft : 'hsl(var(--border-subtle))',
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </motion.nav>
            )}
        </AnimatePresence>
    );
}