'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { FiMoon, FiSun, FiChevronDown } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';

function hslToHex(hslString: string): string {
  const parts = hslString.split(' ').map(v => parseFloat(v));
  const h = parts[0] || 0;
  const s = (parts[1] || 0) / 100;
  const l = (parts[2] || 0) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) { r = c; g = x; b = 0; }
  else if (h >= 60 && h < 120) { r = x; g = c; b = 0; }
  else if (h >= 120 && h < 180) { r = 0; g = c; b = x; }
  else if (h >= 180 && h < 240) { r = 0; g = x; b = c; }
  else if (h >= 240 && h < 300) { r = x; g = 0; b = c; }
  else if (h >= 300 && h < 360) { r = c; g = 0; b = x; }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export default function SiteHeader() {
  const { theme, toggleTheme, colorPreset, setColorPreset, presets } = useTheme();
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsColorMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isColorMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isColorMenuOpen, handleClickOutside]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isColorMenuOpen) {
        setIsColorMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isColorMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-surface/70 border-b border-border-subtle transition-colors duration-500">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="relative h-8 w-8 rounded-full overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 opacity-90"
              style={{
                background: `linear-gradient(135deg, hsl(${colorPreset.primary}) 0%, hsl(${colorPreset.secondary}) 100%)`,
              }}
            />
            <div className="absolute inset-0 bg-background/20" />
            <div className="absolute inset-0.5 rounded-full border border-white/20" />
          </motion.div>

          <div className="flex flex-col leading-tight">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground-subtle">
              Portfolio
            </span>
            <span className="text-xs text-foreground font-light">
              Frontend · Motion · Experiences
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em]">
          <div className="relative" ref={menuRef}>
            <motion.button
              type="button"
              onClick={() => setIsColorMenuOpen(!isColorMenuOpen)}
              className="flex items-center gap-2 h-9 px-3 rounded-full border border-border-subtle bg-surface-soft text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: hslToHex(colorPreset.primary) }}
              />
              <span className="hidden sm:inline text-[10px] tracking-wider">
                {colorPreset.name}
              </span>
              <motion.div
                animate={{ rotate: isColorMenuOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FiChevronDown className="w-3 h-3" />
              </motion.div>
            </motion.button>

            <AnimatePresence>
              {isColorMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-64 rounded-2xl border border-border-subtle bg-surface shadow-[0_20px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl overflow-hidden"
                >
                  <div className="p-4 border-b border-border-subtle">
                    <div className="flex items-center gap-2 text-muted-foreground-subtle">
                      <HiOutlineSparkles className="w-4 h-4" />
                      <span className="text-[10px] tracking-[0.2em] uppercase">
                        Accent Color
                      </span>
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="grid grid-cols-4 gap-2">
                      {presets.map((preset) => {
                        const isActive = preset.id === colorPreset.id;
                        const hexColor = hslToHex(preset.primary);

                        return (
                          <motion.button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              setColorPreset(preset);
                              setIsColorMenuOpen(false);
                            }}
                            className="relative group"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <div
                              className="w-full aspect-square rounded-xl transition-all duration-200"
                              style={{
                                backgroundColor: hexColor,
                                boxShadow: isActive
                                  ? `0 0 20px ${hexColor}60`
                                  : 'none',
                              }}
                            />
                            {isActive && (
                              <motion.div
                                layoutId="active-color-ring"
                                className="absolute -inset-1 rounded-xl border-2 border-foreground"
                                transition={{ duration: 0.2 }}
                              />
                            )}
                            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/20" />
                          </motion.button>
                        );
                      })}
                    </div>

                    <div className="mt-3 pt-3 border-t border-border-subtle">
                      <p className="text-center text-[9px] text-muted-foreground-subtle tracking-wider">
                        {colorPreset.name.toUpperCase()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle bg-surface-soft text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isDark ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiSun className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiMoon className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          <div className="hidden md:flex items-center gap-3">
            <div className="w-px h-5 bg-border-subtle" />
            <span className="px-3 py-1.5 rounded-full border border-border-subtle bg-surface-soft text-muted-foreground">
              Available for freelance
            </span>
            <span className="text-muted-foreground-subtle">
              Remote · Worldwide
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}