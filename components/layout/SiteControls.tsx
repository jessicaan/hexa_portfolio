'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/theme/ThemeProvider';
import { FiMoon, FiSun, FiChevronDown, FiSettings } from 'react-icons/fi';
import { HiOutlineSparkles } from 'react-icons/hi2';
import { useTranslation } from 'react-i18next';

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

export default function CornerControls() {
  const { theme, toggleTheme, colorPreset, setColorPreset, presets } = useTheme();
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setIsColorMenuOpen(false);
      setIsExpanded(false);
    }
  }, []);

  useEffect(() => {
    if (isColorMenuOpen || isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isColorMenuOpen, isExpanded, handleClickOutside]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && (isColorMenuOpen || isExpanded)) {
        setIsColorMenuOpen(false);
        setIsExpanded(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isColorMenuOpen, isExpanded]);

  return (
    <>
      <div className="hidden md:block fixed top-6 right-6 z-50" ref={menuRef}>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="backdrop-blur-xl bg-surface/80 border border-border-subtle rounded-2xl p-3 shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
        >
          <div className="flex flex-col gap-2">
            <div className="relative">
              <motion.button
                type="button"
                onClick={() => setIsColorMenuOpen(!isColorMenuOpen)}
                className="flex items-center gap-2 h-10 px-3 rounded-xl border border-border-subtle bg-surface-soft text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300 w-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="w-5 h-5 rounded-full shadow-sm"
                  style={{ backgroundColor: hslToHex(colorPreset.primary) }}
                />
                <span className="text-[10px] tracking-wider uppercase flex-1 text-left">
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
                          {t('siteControls.accentColor')}
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
                                  layoutId="active-color-ring-desktop"
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

            <div className="h-px bg-border-subtle" />

            <motion.button
              type="button"
              onClick={toggleTheme}
              aria-label={isDark ? t('siteControls.switchToLight') : t('siteControls.switchToDark')}
              className="flex h-10 items-center justify-center gap-2 px-3 rounded-xl border border-border-subtle bg-surface-soft text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <FiSun className="h-4 w-4" />
                    <span className="text-[10px] tracking-wider uppercase">{t('siteControls.light')}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-2"
                  >
                    <FiMoon className="h-4 w-4" />
                    <span className="text-[10px] tracking-wider uppercase">{t('siteControls.dark')}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.div>
      </div>

      <div className="md:hidden fixed bottom-6 right-6 z-50" ref={menuRef}>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 backdrop-blur-xl bg-surface/95 border border-border-subtle rounded-2xl p-3 shadow-[0_8px_30px_rgba(0,0,0,0.3)] min-w-[200px]"
            >
              <motion.button
                type="button"
                onClick={() => {
                  toggleTheme();
                  setIsExpanded(false);
                }}
                className="flex w-full items-center gap-3 h-12 px-4 rounded-xl border border-border-subtle bg-surface-soft text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all duration-300"
                whileTap={{ scale: 0.98 }}
              >
                {isDark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
                <span className="text-xs tracking-wider uppercase flex-1 text-left">
                  {isDark ? t('siteControls.light') : t('siteControls.dark')}
                </span>
              </motion.button>

              <div className="h-px bg-border-subtle my-3" />

              <div className="p-2">
                <p className="text-[9px] tracking-wider uppercase text-muted-foreground-subtle mb-3 px-1">
                  {t('siteControls.accentColor')}
                </p>
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
                          setIsExpanded(false);
                        }}
                        className="relative group"
                        whileTap={{ scale: 0.9 }}
                      >
                        <div
                          className="w-full aspect-square rounded-lg transition-all duration-200"
                          style={{
                            backgroundColor: hexColor,
                            boxShadow: isActive ? `0 0 16px ${hexColor}60` : 'none',
                          }}
                        />
                        {isActive && (
                          <motion.div
                            layoutId="active-color-ring-mobile"
                            className="absolute -inset-0.5 rounded-lg border-2 border-foreground"
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center w-14 h-14 rounded-full backdrop-blur-xl bg-surface/90 border border-border-subtle shadow-[0_8px_30px_rgba(0,0,0,0.2)] text-muted-foreground hover:text-foreground transition-colors duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="w-2 h-2 rounded-full absolute top-2 right-2"
            style={{ backgroundColor: hslToHex(colorPreset.primary) }}
          />
          <FiSettings className="h-5 w-5" />
        </motion.button>
      </div>
    </>
  );
}