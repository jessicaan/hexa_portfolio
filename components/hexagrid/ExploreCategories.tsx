'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';
import ReactiveGridBackground from '../background/ReactiveGridBackground';

interface ExploreCategoriesProps {
  onCategorySelect: (categoryId: string) => void;
  onClose: () => void;
}

const ExploreCategories: React.FC<ExploreCategoriesProps> = ({
  onCategorySelect,
  onClose,
}) => {
  const { t } = useTranslation();
  const { primaryRgb, theme } = useTheme();

  const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;
  const isDark = theme === 'dark';

  const categories = [
    { id: 'about', label: t('sections.about'), icon: 'person' },
    { id: 'education', label: t('sections.education'), icon: 'school' },
    { id: 'experience', label: t('sections.experience'), icon: 'work' },
    { id: 'projects', label: t('sections.projects'), icon: 'code' },
    { id: 'skills', label: t('sections.skills'), icon: 'stars' },
    { id: 'personal', label: t('sections.personal'), icon: 'heart' },
    { id: 'contact', label: t('sections.contact'), icon: 'mail' },
  ];

  const iconMap: Record<string, React.ReactNode> = {
    person: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21v-2a4 4 0 014-4h8a4 4 0 014 4v2" />
      </svg>
    ),
    school: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M12 3L1 9l11 6 9-4.91V17M5 13.18v4L12 21l7-3.82v-4" />
      </svg>
    ),
    work: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      </svg>
    ),
    code: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <polyline points="16,18 22,12 16,6" />
        <polyline points="8,6 2,12 8,18" />
      </svg>
    ),
    stars: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
      </svg>
    ),
    heart: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
    mail: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 6l-10 7L2 6" />
      </svg>
    ),
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-40 overflow-hidden"
    >
      <ReactiveGridBackground />

      <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden">
        <div className="min-h-full flex flex-col px-4 py-6 sm:px-6 sm:py-8 lg:px-12 lg:py-16">
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 sm:mb-10 lg:mb-14 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
              <span
                className="h-px w-8 sm:w-10"
                style={{
                  background: `linear-gradient(to left, ${primaryColor}, transparent)`,
                }}
              />
              <p className="text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-muted-foreground">
                {t('exploreCategories.eyebrow', 'Navigation')}
              </p>
              <span
                className="h-px w-8 sm:w-10"
                style={{
                  background: `linear-gradient(to right, ${primaryColor}, transparent)`,
                }}
              />
            </div>
            <h1
              className="text-2xl sm:text-3xl lg:text-5xl font-semibold tracking-tight mb-2 sm:mb-4"
              style={{ color: isDark ? '#fff' : 'var(--foreground)' }}
            >
              {t('exploreCategories.title')}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto px-2">
              {t('exploreCategories.description', 'Select a section to explore')}
            </p>
          </motion.header>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex-1 flex flex-col"
          >
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-[1200px] mx-auto w-full">
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  onClick={() => onCategorySelect(category.id)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="group relative"
                >
                  <div
                    className="relative rounded-2xl sm:rounded-2xl border backdrop-blur-md p-4 sm:p-5 lg:p-6 transition-all duration-300 flex flex-col items-center gap-3 sm:gap-4"
                    style={{
                      background: isDark
                        ? 'rgba(20, 20, 25, 0.2)'
                        : 'rgba(255, 255, 255, 0.6)',
                      borderColor: 'var(--border-subtle)',
                    }}
                    onTouchStart={(e) => {
                      const target = e.currentTarget;
                      target.style.background = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.15)`;
                      target.style.borderColor = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.5)`;
                    }}
                    onTouchEnd={(e) => {
                      const target = e.currentTarget;
                      target.style.background = isDark
                        ? 'rgba(20, 20, 25, 0.6)'
                        : 'rgba(255, 255, 255, 0.6)';
                      target.style.borderColor = 'var(--border-subtle)';
                    }}
                    onMouseEnter={(e) => {
                      const target = e.currentTarget;
                      target.style.background = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`;
                      target.style.borderColor = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.4)`;
                      target.style.boxShadow = `0 4px 24px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.15)`;
                    }}
                    onMouseLeave={(e) => {
                      const target = e.currentTarget;
                      target.style.background = isDark
                        ? 'rgba(20, 20, 25, 0.6)'
                        : 'rgba(255, 255, 255, 0.6)';
                      target.style.borderColor = 'var(--border-subtle)';
                      target.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center transition-all duration-300"
                      style={{
                        background: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.15)`,
                        color: primaryColor,
                      }}
                    >
                      {iconMap[category.icon]}
                    </div>

                    <p
                      className="text-xs sm:text-sm font-medium tracking-wide transition-colors duration-300 text-center"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {category.label}
                    </p>

                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 group-hover:w-1/2 group-active:w-1/2 rounded-full transition-all duration-300"
                      style={{ backgroundColor: primaryColor }}
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 sm:mt-8 flex justify-center pb-4"
          >
            <button
              onClick={onClose}
              className="group relative px-6 py-3 sm:px-8 sm:py-3.5 rounded-xl sm:rounded-2xl border border-border-subtle backdrop-blur-md transition-all duration-300 active:scale-95"
              style={{
                background: isDark ? 'rgba(20, 20, 25, 0.7)' : 'rgba(255, 255, 255, 0.6)',
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget;
                target.style.borderColor = `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.4)`;
                target.style.boxShadow = `0 4px 20px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.15)`;
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget;
                target.style.borderColor = 'var(--border-subtle)';
                target.style.boxShadow = 'none';
              }}
            >
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                {t('exploreCategories.close')}
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </motion.main>
  );
};

export default ExploreCategories;