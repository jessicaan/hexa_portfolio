'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactiveGridBackground from '@/components/Reactivegridbackground';
import { useTheme } from '@/components/ThemeProvider';
import type { ExperienceContent, ExperienceItem } from '@/lib/content/schema';
import type { LanguageCode } from '@/app/i18n';

type ExperienceTab = 'freelancer' | 'clt' | 'pj' | 'others';

interface ExperienceSectionProps {
    content: ExperienceContent;
    language: LanguageCode;
}

const getTranslatedContent = (content: ExperienceContent, lang: LanguageCode) => {
    if (lang === 'pt') {
        return {
            summary: content.summary,
            experiences: content.experiences,
        };
    }

    const translation = content.translations[lang];
    const summary = translation?.summary?.trim() ? translation.summary : content.summary;

    const experiences = content.experiences.map((baseExp, index) => {
        const translated = translation?.experiences?.[index];
        const achievements =
            Array.isArray(translated?.achievements) && translated.achievements.length > 0
                ? translated.achievements
                : baseExp.achievements;

        return {
            ...baseExp,
            role: translated?.role || baseExp.role,
            description: translated?.description || baseExp.description,
            achievements,
        };
    });

    return { summary, experiences };
};

export default function ExperienceSection({ content, language }: ExperienceSectionProps) {
    const [activeTab, setActiveTab] = useState<ExperienceTab>('freelancer');

    const { summary, experiences } = useMemo(
        () => getTranslatedContent(content, language),
        [content, language]
    );

    const initialId = useMemo(() => {
        const list = experiences.filter(exp => exp.contractType.toLowerCase() === activeTab);
        return list[0]?.company ?? experiences[0]?.company;
    }, [experiences, activeTab]);

    const [activeId, setActiveId] = useState<string>(initialId);

    const { primaryRgb, theme } = useTheme();
    const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;

    const filteredExperiences = useMemo(() => {
        return experiences.filter(exp => {
            const contract = exp.contractType.toLowerCase();
            if (activeTab === 'others') {
                return !['freelancer', 'clt', 'pj'].includes(contract);
            }
            return contract === activeTab;
        });
    }, [experiences, activeTab]);

    const activeExperience = useMemo(() => {
        return experiences.find(exp => exp.company === activeId) ?? filteredExperiences[0] ?? experiences[0];
    }, [activeId, filteredExperiences, experiences]);


    const handleTabChange = (tab: ExperienceTab) => {
        setActiveTab(tab);
        const list = experiences.filter(exp => exp.contractType.toLowerCase() === tab);
        if (list[0]) {
            setActiveId(list[0].company);
        } else if (experiences.length > 0) {
            setActiveId(experiences[0].company)
        }
    };

    const copy = {
        eyebrow: 'Experiência profissional',
        title: 'Minha trajetória',
        description: summary,
        tabs: {
            freelancer: 'Freelancer',
            pj: 'PJ',
            clt: 'CLT',
            others: 'Outros',
        },
        detailHeading: 'Detalhes',
        highlightsHeading: 'Destaques',
        stackHeading: 'Tecnologias',
    };

    return (
        <main className="relative w-screen h-screen overflow-hidden">
            <ReactiveGridBackground />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full h-full px-6 sm:px-10 gap-10 lg:gap-16">
                <motion.section
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-xl text-center lg:text-left text-foreground"
                >
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-muted-foreground-subtle mb-4">
                        {copy.eyebrow}
                    </p>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-5">
                        {copy.title}
                    </h2>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                        {copy.description}
                    </p>

                    <div className="inline-flex items-center rounded-full border border-border-subtle bg-surface-soft p-1 mb-5">
                        {(['freelancer', 'pj', 'clt', 'others'] as ExperienceTab[]).map(tab => {
                            const isActive = tab === activeTab;
                            return (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => handleTabChange(tab)}
                                    className={`relative px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] transition-colors duration-200 ${isActive ? 'text-foreground' : 'text-muted-foreground-subtle'
                                        }`}
                                >
                                    <motion.div
                                        className="absolute inset-0 rounded-full"
                                        style={{ backgroundColor: `${primaryColor}20` }}
                                        initial={false}
                                        animate={{ opacity: isActive ? 1 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    />
                                    <span className="relative z-10">{copy.tabs[tab]}</span>
                                </button>
                            );
                        })}
                    </div>

                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-muted-foreground-subtle mb-2">
                        {copy.detailHeading}
                    </p>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeExperience?.company}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.3 }}
                            className="rounded-3xl border border-border-subtle bg-surface-soft backdrop-blur-md p-5 sm:p-6"
                            style={{
                                boxShadow: `0 18px 60px rgba(0,0,0,${theme === 'dark' ? 0.6 : 0.15})`,
                            }}
                        >
                            {activeExperience ? (
                                <>
                                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                                        <div>
                                            <p className="text-sm sm:text-base text-foreground font-medium">
                                                {activeExperience.role}
                                            </p>
                                            <p className="text-[11px] sm:text-xs text-muted-foreground">
                                                {activeExperience.company}
                                                {activeExperience.location ? ` · ${activeExperience.location}` : ''}
                                            </p>
                                        </div>
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                                            {activeExperience.period}
                                        </span>
                                    </div>

                                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4">
                                        {activeExperience.description}
                                    </p>

                                    {activeExperience.achievements?.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground-subtle mb-2">
                                                {copy.highlightsHeading}
                                            </p>
                                            <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground">
                                                {activeExperience.achievements.map(item => (
                                                    <li key={item} className="flex gap-2">
                                                        <span
                                                            className="mt-[5px] h-[3px] w-3 rounded-full"
                                                            style={{
                                                                background: `linear-gradient(to right, ${primaryColor}, hsl(var(--secondary)))`,
                                                            }}
                                                        />
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {activeExperience.technologies?.length > 0 && (
                                        <div>
                                            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground-subtle mb-2">
                                                {copy.stackHeading}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {activeExperience.technologies.map(tech => (
                                                    <span
                                                        key={tech}
                                                        className="px-3 py-1 rounded-full border border-border-subtle bg-surface-soft text-[10px] tracking-[0.14em] uppercase text-muted-foreground"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className='text-sm text-muted-foreground'>Nenhuma experiência encontrada.</p>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.1 }}
                    className="w-full max-w-xl"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 sm:gap-5 max-h-[60vh] overflow-y-auto pr-1">
                        {filteredExperiences.map(experience => {
                            const isActive = experience.company === activeId;

                            return (
                                <motion.button
                                    key={experience.company}
                                    type="button"
                                    onMouseEnter={() => setActiveId(experience.company)}
                                    onFocus={() => setActiveId(experience.company)}
                                    onClick={() => setActiveId(experience.company)}
                                    whileHover={{ y: -4, scale: 1.01 }}
                                    transition={{ duration: 0.2 }}
                                    className="relative group text-left"
                                >
                                    <motion.div
                                        className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100"
                                        style={{
                                            background: `linear-gradient(to bottom right, ${primaryColor}40, transparent, hsl(var(--secondary) / 0.4))`,
                                        }}
                                        animate={{ opacity: isActive ? 1 : 0 }}
                                        transition={{ duration: 0.25 }}
                                    />

                                    <div
                                        className="relative rounded-2xl border border-border-subtle bg-surface-soft backdrop-blur-md px-4 py-4 sm:px-4 sm:py-4 overflow-hidden"
                                        style={{
                                            boxShadow: `0 10px 40px rgba(0,0,0,${theme === 'dark' ? 0.75 : 0.15})`,
                                        }}
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div className="flex-1">
                                                <p className="text-sm sm:text-base font-medium text-foreground mb-1">
                                                    {experience.role}
                                                </p>
                                                <p className="text-[11px] sm:text-xs text-muted-foreground">
                                                    {experience.company}
                                                </p>
                                            </div>
                                            <motion.span
                                                className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground-subtle"
                                                animate={{
                                                    opacity: isActive ? 1 : 0.4,
                                                    y: isActive ? 0 : 2,
                                                }}
                                            >
                                                {experience.period}
                                            </motion.span>
                                        </div>

                                        <p className="text-[11px] sm:text-xs text-muted-foreground mb-2 line-clamp-2">
                                            {experience.description}
                                        </p>

                                        <div className="flex flex-wrap gap-1.5 mt-1">
                                            {experience.technologies.slice(0, 3).map(tech => (
                                                <span
                                                    key={tech}
                                                    className="px-2 py-0.5 rounded-full bg-surface-soft text-[9px] tracking-[0.15em] uppercase text-muted-foreground-subtle"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>

                                        <motion.div
                                            className="absolute inset-px rounded-2xl border pointer-events-none"
                                            style={{ borderColor: primaryColor }}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: isActive ? 0.35 : 0 }}
                                            transition={{ duration: 0.25 }}
                                        />
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.section>
            </div>
        </main>
    );
}
