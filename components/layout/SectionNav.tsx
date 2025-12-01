'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';

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

export default function SectionNav({
    items,
    activeId,
    onNavigate,
    visible = true,
}: SectionNavProps) {
    const { t } = useTranslation();

    const labelRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
    const prevActiveRef = useRef(activeId);
    const { primaryRgb, theme } = useTheme();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const activeIndex = items.findIndex((n) => n.id === activeId);
    const isDark = theme === 'dark';

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
                const translatedLabel = t(`sections.${activeId}`);
                gsap.to(labelEl, {
                    duration: 0.5,
                    scrambleText: {
                        text: translatedLabel,
                        chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                        revealDelay: 0.2,
                        speed: 0.5,
                    },
                    ease: 'none',
                });
            }
            prevActiveRef.current = activeId;
        }
    }, [activeId, items, t]);

    const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;
    const primaryColorSoft = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.2)`;

    if (isMobile) {
        if (!visible) {
            return null;
        }

        const activeItem = items.find((item) => item.id === activeId);
        const activeLabel = activeItem
            ? t(`sections.${activeItem.id}`, { defaultValue: activeItem.label })
            : '';

        return (
            <>
                <AnimatePresence>
                    <motion.button
                        aria-label={isMenuOpen ? t('closeMenu') : t('openMenu')}
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full border border-border-subtle backdrop-blur-xl transition-all duration-300"
                        style={{
                            background: isDark
                                ? 'rgba(15, 15, 20, 0.85)'
                                : 'rgba(255, 255, 255, 0.85)',
                            boxShadow: `0 8px 32px rgba(0, 0, 0, ${isDark ? 0.4 : 0.15}), 0 0 0 1px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`,
                            padding: isMenuOpen ? '14px' : '14px 20px 14px 14px',
                        }}
                    >
                        <div
                            className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                            style={{
                                background: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.15)`,
                            }}
                        >
                            <motion.div
                                className="relative w-4 h-4 flex flex-col justify-center items-center"
                                animate={{ rotate: isMenuOpen ? 180 : 0 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                            >
                                <motion.span
                                    className="absolute w-4 h-0.5 rounded-full"
                                    style={{ backgroundColor: primaryColor }}
                                    animate={{
                                        rotate: isMenuOpen ? 45 : 0,
                                        y: isMenuOpen ? 0 : -4,
                                    }}
                                    transition={{ duration: 0.2 }}
                                />
                                <motion.span
                                    className="absolute w-4 h-0.5 rounded-full"
                                    style={{ backgroundColor: primaryColor }}
                                    animate={{
                                        opacity: isMenuOpen ? 0 : 1,
                                        scaleX: isMenuOpen ? 0 : 1,
                                    }}
                                    transition={{ duration: 0.2 }}
                                />
                                <motion.span
                                    className="absolute w-4 h-0.5 rounded-full"
                                    style={{ backgroundColor: primaryColor }}
                                    animate={{
                                        rotate: isMenuOpen ? -45 : 0,
                                        y: isMenuOpen ? 0 : 4,
                                    }}
                                    transition={{ duration: 0.2 }}
                                />
                            </motion.div>
                        </div>

                        <AnimatePresence mode="wait">
                            {!isMenuOpen && (
                                <motion.span
                                    key="label"
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: 'auto' }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-xs font-semibold uppercase tracking-widest overflow-hidden whitespace-nowrap"
                                    style={{ color: 'var(--foreground)' }}
                                >
                                    {activeLabel}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </AnimatePresence>

                <AnimatePresence>
                    {isMenuOpen && (
                        <>
                            <motion.div
                                className="fixed inset-0 z-40"
                                style={{
                                    background: isDark
                                        ? 'rgba(0, 0, 0, 0.6)'
                                        : 'rgba(0, 0, 0, 0.3)',
                                    backdropFilter: 'blur(8px)',
                                }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                onClick={() => setIsMenuOpen(false)}
                            />

                            <motion.div
                                className="fixed bottom-24 right-6 z-50 w-64"
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                            >
                                <div
                                    className="rounded-3xl border border-border-subtle backdrop-blur-xl overflow-hidden"
                                    style={{
                                        background: isDark
                                            ? 'rgba(15, 15, 20, 0.9)'
                                            : 'rgba(255, 255, 255, 0.9)',
                                        boxShadow: `0 24px 48px rgba(0, 0, 0, ${isDark ? 0.5 : 0.2})`,
                                    }}
                                >
                                    <div className="px-5 py-4 border-b border-border-subtle">
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                                            {t('sections.navigation')}
                                        </p>
                                    </div>

                                    <div className="p-2 max-h-[60vh] overflow-y-auto">
                                        {items.map((item, index) => {
                                            const isActive = item.id === activeId;
                                            const label = t(`sections.${item.id}`, {
                                                defaultValue: item.label,
                                            });

                                            return (
                                                <motion.button
                                                    key={item.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.03 }}
                                                    onClick={() => {
                                                        onNavigate(item.id);
                                                        setIsMenuOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 active:scale-[0.98]"
                                                    style={{
                                                        background: isActive
                                                            ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.12)`
                                                            : 'transparent',
                                                    }}
                                                >
                                                    <div className="relative">
                                                        <motion.div
                                                            className="w-2.5 h-2.5 rounded-full"
                                                            style={{
                                                                backgroundColor: isActive
                                                                    ? primaryColor
                                                                    : isDark
                                                                        ? 'rgba(255, 255, 255, 0.2)'
                                                                        : 'rgba(0, 0, 0, 0.15)',
                                                            }}
                                                            animate={{
                                                                scale: isActive ? 1 : 0.8,
                                                            }}
                                                            transition={{ duration: 0.2 }}
                                                        />
                                                        {isActive && (
                                                            <motion.div
                                                                className="absolute inset-0 rounded-full"
                                                                style={{ backgroundColor: primaryColor }}
                                                                initial={{ scale: 1, opacity: 0.4 }}
                                                                animate={{
                                                                    scale: [1, 2, 1],
                                                                    opacity: [0.4, 0, 0.4],
                                                                }}
                                                                transition={{
                                                                    duration: 2,
                                                                    repeat: Infinity,
                                                                    ease: 'easeInOut',
                                                                }}
                                                            />
                                                        )}
                                                    </div>

                                                    <span
                                                        className="flex-1 text-left text-sm font-medium tracking-wide transition-colors duration-200"
                                                        style={{
                                                            color: isActive
                                                                ? 'var(--foreground)'
                                                                : 'var(--muted-foreground)',
                                                        }}
                                                    >
                                                        {label}
                                                    </span>

                                                    {isActive && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="w-1.5 h-1.5 rounded-full"
                                                            style={{ backgroundColor: primaryColor }}
                                                        />
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                    </div>

                                    <div
                                        className="h-1 w-full"
                                        style={{
                                            background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
                                            opacity: 0.3,
                                        }}
                                    />
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </>
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
                        const label = item.label;

                        return (
                            <div key={item.id} className="flex flex-col items-end">
                                <button
                                    onClick={() => onNavigate(item.id)}
                                    className="group flex items-center gap-3 py-3"
                                >
                                    <motion.span
                                        ref={(el) => {
                                            if (el) labelRefs.current.set(item.id, el);
                                        }}
                                        className="text-xs font-bold tracking-[0.25em] uppercase transition-colors duration-300"
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
                                                borderColor:
                                                    isActive || isPast
                                                        ? primaryColor
                                                        : 'hsl(var(--border-subtle))',
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
                                                    duration: 1.5,
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
                                                    index < activeIndex
                                                        ? primaryColorSoft
                                                        : 'hsl(var(--border-subtle))',
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