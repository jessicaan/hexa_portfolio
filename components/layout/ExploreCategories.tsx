'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { User, GraduationCap, Briefcase, Code, Star, Heart, Mail, Home } from 'lucide-react';
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
    { id: 'intro', label: t('sections.intro'), icon: Home },
    { id: 'about', label: t('sections.about'), icon: User },
    { id: 'education', label: t('sections.education'), icon: GraduationCap },
    { id: 'experience', label: t('sections.experience'), icon: Briefcase },
    { id: 'projects', label: t('sections.projects'), icon: Code },
    { id: 'skills', label: t('sections.skills'), icon: Star },
    { id: 'personal', label: t('sections.personal'), icon: Heart },
    { id: 'contact', label: t('sections.contact'), icon: Mail },
  ];

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
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
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
                        <Icon className="w-5 h-5" strokeWidth={1.5} />
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
                );
              })}
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