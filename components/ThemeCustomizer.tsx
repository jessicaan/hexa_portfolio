'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiAdjustmentsHorizontal, HiXMark, HiSun, HiMoon } from 'react-icons/hi2';
import { useTheme } from './ThemeProvider';

function hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function parseHSL(hslString: string): { h: number; s: number; l: number } {
    const parts = hslString.split(' ').map(p => parseFloat(p));
    return { h: parts[0] || 0, s: parts[1] || 0, l: parts[2] || 0 };
}

export default function ThemeCustomizer() {
    const { theme, toggleTheme, colorPreset, setColorPreset, presets } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    return (
        <>
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 z-50 w-10 h-10 rounded-full bg-surface-soft border border-border-subtle flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <HiAdjustmentsHorizontal className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, x: -20, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -20, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="fixed bottom-20 left-6 z-50 w-72 rounded-2xl bg-surface border border-border-subtle shadow-card overflow-hidden"
                        >
                            <div className="p-4 border-b border-border-subtle flex items-center justify-between">
                                <span className="text-xs tracking-[0.2em] uppercase text-muted-foreground">
                                    Customize
                                </span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <HiXMark className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="p-4 space-y-5">
                                <div>
                                    <label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground-subtle mb-3 block">
                                        Mode
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => theme === 'dark' && toggleTheme()}
                                            className={`flex-1 py-2.5 rounded-lg border text-xs tracking-wider flex items-center justify-center gap-2 transition-colors ${theme === 'light'
                                                ? 'bg-primary/10 border-primary/50 text-foreground'
                                                : 'border-border-subtle text-muted-foreground hover:border-primary/30'
                                                }`}
                                        >
                                            <HiSun className="w-4 h-4" />
                                            Light
                                        </button>
                                        <button
                                            onClick={() => theme === 'light' && toggleTheme()}
                                            className={`flex-1 py-2.5 rounded-lg border text-xs tracking-wider flex items-center justify-center gap-2 transition-colors ${theme === 'dark'
                                                ? 'bg-primary/10 border-primary/50 text-foreground'
                                                : 'border-border-subtle text-muted-foreground hover:border-primary/30'
                                                }`}
                                        >
                                            <HiMoon className="w-4 h-4" />
                                            Dark
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] tracking-[0.2em] uppercase text-muted-foreground-subtle mb-3 block">
                                        Accent Color
                                    </label>
                                    <div className="grid grid-cols-6 gap-2">
                                    {presets.map((preset) => {
                                        const { h, s, l } = parseHSL(preset.primary);
                                        const hexColor = hslToHex(h, s, l);
                                        const isActive = preset.id === colorPreset.id;

                                        return (
                                            <motion.button
                                                key={preset.id}
                                                onClick={() => {
                                                    setColorPreset(preset);
                                                    setIsOpen(false);
                                                }}
                                                className="relative w-full aspect-square rounded-lg"
                                                style={{ backgroundColor: hexColor }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="active-color"
                                                        className="absolute inset-0 rounded-lg ring-2 ring-foreground ring-offset-2 ring-offset-surface"
                                                    />
                                                )}
                                            </motion.button>
                                        );
                                    })}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground-subtle mt-2 text-center">
                                        {colorPreset.name}
                                    </p>
                                </div>
                            </div>

                            <div className="px-4 py-3 bg-surface-soft border-t border-border-subtle">
                                <p className="text-[9px] text-muted-foreground-subtle text-center">
                                    Press ESC to close
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
