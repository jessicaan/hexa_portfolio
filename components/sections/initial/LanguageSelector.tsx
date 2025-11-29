'use client';

import { motion, Variants, AnimatePresence } from 'framer-motion';
import StylizedFlag from './StylizedFlag';
import { LanguageSelectorProps } from './types';

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.8 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 120, damping: 14 },
    },
};

export default function LanguageSelector({
    languages,
    activeGreeting,
    hoveredLang,
    selectedLang,
    primaryRgb,
    onHover,
    onSelect,
}: LanguageSelectorProps) {
    const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;

    return (
        <>
            <motion.div
                className="flex items-center gap-3 sm:gap-5 md:gap-8 lg:gap-10 mb-6 sm:mb-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {languages.map((lang, index) => (
                    <motion.div
                        key={lang.code}
                        variants={itemVariants}
                        className="group flex flex-col items-center cursor-pointer"
                        onMouseEnter={() => onHover(index)}
                        onMouseLeave={() => onHover(null)}
                        onClick={() => onSelect(index)}
                        whileTap={{ scale: 0.95 }}
                    >
                        <div className="relative">
                            <StylizedFlag
                                country={lang.country}
                                isHovered={hoveredLang === index || activeGreeting === index}
                                primaryRgb={primaryRgb}
                            />

                            <AnimatePresence>
                                {selectedLang === index && (
                                    <motion.div
                                        className="absolute -inset-1.5 sm:-inset-2 rounded-2xl sm:rounded-3xl border-2"
                                        style={{ borderColor: primaryColor }}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                    />
                                )}
                            </AnimatePresence>
                        </div>

                        <motion.div
                            className="mt-2 sm:mt-4 flex flex-col items-center gap-1"
                            animate={{
                                opacity: hoveredLang === index || activeGreeting === index ? 1 : 0.4,
                                y: hoveredLang === index ? -3 : 0,
                            }}
                            transition={{ duration: 0.25 }}
                        >
                            <span className="text-[9px] sm:text-xs tracking-[0.3em] font-medium">
                                {lang.code}
                            </span>
                            <span className="text-[10px] sm:text-xs tracking-[0.15em] text-muted-foreground-subtle font-light">
                                {lang.name}
                            </span>
                        </motion.div>

                        <motion.div
                            className="mt-1.5 sm:mt-2 w-4 sm:w-5 h-px"
                            style={{ backgroundColor: primaryColor }}
                            initial={{ scaleX: 0 }}
                            animate={{
                                scaleX: hoveredLang === index || activeGreeting === index ? 1 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                className="flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 0.8 }}
            >
                {languages.map((_, index) => (
                    <motion.div
                        key={index}
                        className="w-1 h-1 rounded-full cursor-pointer"
                        animate={{
                            backgroundColor: activeGreeting === index ? primaryColor : 'rgba(255,255,255,0.2)',
                            scale: activeGreeting === index ? 1.4 : 1,
                        }}
                        transition={{ duration: 0.3 }}
                        onClick={() => onHover(index)}
                    />
                ))}
            </motion.div>
        </>
    );
}