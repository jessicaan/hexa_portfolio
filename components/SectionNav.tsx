'use client';

import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
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

export default function SectionNav({
    items,
    activeId,
    onNavigate,
    visible = true
}: SectionNavProps) {
    const labelRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
    const prevActiveRef = useRef(activeId);
    const { primaryRgb } = useTheme();

    const activeIndex = items.findIndex(n => n.id === activeId);

    useEffect(() => {
        if (prevActiveRef.current !== activeId) {
            const labelEl = labelRefs.current.get(activeId);
            if (labelEl) {
                const item = items.find(n => n.id === activeId);
                if (item) {
                    gsap.to(labelEl, {
                        duration: 0.5,
                        scrambleText: {
                            text: item.label,
                            chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
                            revealDelay: 0.2,
                            speed: 0.5,
                        },
                        ease: 'none',
                    });
                }
            }
            prevActiveRef.current = activeId;
        }
    }, [activeId, items]);

    const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;
    const primaryColorSoft = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.2)`;

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

                        return (
                            <div key={item.id} className="flex flex-col items-end">
                                <button
                                    onClick={() => onNavigate(item.id)}
                                    className="group flex items-center gap-3 py-3"
                                >
                                    <motion.span
                                        ref={el => { if (el) labelRefs.current.set(item.id, el); }}
                                        className="text-[10px] tracking-[0.25em] uppercase transition-colors duration-300"
                                        style={{
                                            color: isActive
                                                ? 'hsl(var(--foreground))'
                                                : isPast
                                                    ? primaryColor
                                                    : 'hsl(var(--muted-foreground-subtle))'
                                        }}
                                        animate={{
                                            opacity: isActive ? 1 : 0.3,
                                            x: isActive ? 0 : 8,
                                        }}
                                        whileHover={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {item.label}
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
                                                        : 'transparent'
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
                                                backgroundColor: index < activeIndex
                                                    ? primaryColorSoft
                                                    : 'hsl(var(--border-subtle))'
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