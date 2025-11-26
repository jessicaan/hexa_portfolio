'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactiveGridBackground from '@/components/Reactivegridbackground';
import { useTheme } from '@/components/ThemeProvider';

type LanguageCode = 'PT' | 'EN' | 'ES' | 'FR';

interface ExperienceSectionProps {
  language?: LanguageCode;
}

type ExperienceTab = 'freelance' | 'contractor';

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location?: string;
  description: string;
  highlights: string[];
  stack: string[];
}

const freelanceExperiences: ExperienceItem[] = [
  {
    id: 'freelance-creative-sites',
    role: 'Freelance Frontend Developer',
    company: 'Creative websites & portfolios',
    period: '2021 – Present',
    location: 'Remote',
    description:
      'Designing and building immersive portfolios, landing pages and product sites with a strong focus on motion, storytelling and microinteractions.',
    highlights: [
      'Led end-to-end delivery of custom interfaces, from wireframes to production code.',
      'Explored creative uses of animation to guide attention and explain product value.',
      'Worked closely with clients to translate abstract ideas into concrete experiences.',
    ],
    stack: ['Next.js', 'TypeScript', 'Framer Motion', 'GSAP', 'Tailwind CSS'],
  },
  {
    id: 'freelance-product-experiments',
    role: 'Freelance Product Developer',
    company: 'Digital products & experiments',
    period: '2020 – Present',
    location: 'Remote',
    description:
      'Prototyping product ideas, interactive dashboards and internal tools with a strong UX and UI point of view.',
    highlights: [
      'Turned Figma explorations into high-fidelity interactive prototypes quickly.',
      'Balanced visual polish with performance and maintainable component architecture.',
      'Iterated in short cycles based on feedback from real users and stakeholders.',
    ],
    stack: ['React', 'Next.js', 'TypeScript', 'Design Systems'],
  },
  {
    id: 'freelance-marketing-experiences',
    role: 'Freelance Interaction Developer',
    company: 'Marketing & campaign experiences',
    period: '2022 – 2024',
    location: 'Hybrid',
    description:
      'Developing interactive pages for campaigns and launches, focusing on smooth motion, scroll-based storytelling and delightful micro details.',
    highlights: [
      'Created scroll-driven narratives to reveal product stories progressively.',
      'Implemented subtle motion cues to connect sections and transitions.',
      'Collaborated with designers to bring motion specs to life in the browser.',
    ],
    stack: ['Next.js', 'GSAP', 'Framer Motion', 'Tailwind CSS'],
  },
];

const contractorExperiences: ExperienceItem[] = [
  {
    id: 'contractor-product-team',
    role: 'Frontend Developer (Contract)',
    company: 'Product teams & startups',
    period: '2021 – 2023',
    location: 'Remote',
    description:
      'Supporting product teams as a contractor, helping to maintain and evolve existing frontends while introducing motion and UX improvements.',
    highlights: [
      'Refined existing flows with better states, loading feedback and error handling.',
      'Introduced animation and microinteractions without compromising performance.',
      'Collaborated with designers and backend engineers in agile environments.',
    ],
    stack: ['React', 'TypeScript', 'Design Systems'],
  },
  {
    id: 'contractor-agencies',
    role: 'Frontend Engineer (Contract)',
    company: 'Agencies & studios',
    period: '2019 – 2021',
    location: 'Hybrid',
    description:
      'Working with agencies to deliver interfaces for campaigns, internal tools and branded experiences.',
    highlights: [
      'Translated creative concepts into stable, reusable components.',
      'Worked on tight timelines while maintaining a clean codebase.',
      'Helped teams adopt modern frontend tooling and workflows.',
    ],
    stack: ['JavaScript', 'React', 'CSS', 'Git'],
  },
];

const experiencesByTab: Record<ExperienceTab, ExperienceItem[]> = {
  freelance: freelanceExperiences,
  contractor: contractorExperiences,
};

const experienceCopy: Record<
  LanguageCode,
  {
    eyebrow: string;
    title: string;
    description: string;
    freelanceLabel: string;
    contractorLabel: string;
    detailHeading: string;
    highlightsHeading: string;
    stackHeading: string;
  }
> = {
  PT: {
    eyebrow: 'Experiência profissional',
    title: 'Freelancer como forma principal de trabalho',
    description:
      'Grande parte da minha trajetória como desenvolvedor acontece em projetos freelance, colaborando com pessoas e equipes diferentes para criar experiências digitais singulares.',
    freelanceLabel: 'Freelance',
    contractorLabel: 'Contratos / Empresas',
    detailHeading: 'Projeto em foco',
    highlightsHeading: 'O que fiz nesse projeto',
    stackHeading: 'Stack e ferramentas',
  },
  EN: {
    eyebrow: 'Professional experience',
    title: 'Freelance first, with contractor collaborations',
    description:
      'Most of my work as a developer happens in freelance projects, with some contractor roles supporting product teams and agencies along the way.',
    freelanceLabel: 'Freelance',
    contractorLabel: 'Contractor',
    detailHeading: 'Project in focus',
    highlightsHeading: 'What I worked on',
    stackHeading: 'Stack & tools',
  },
  ES: {
    eyebrow: 'Experiencia profesional',
    title: 'Freelance como formato principal de trabajo',
    description:
      'La mayor parte de mi trayectoria como desarrollador ocurre en proyectos freelance, colaborando con equipos y clientes distintos para crear experiencias digitales.',
    freelanceLabel: 'Freelance',
    contractorLabel: 'Contratos / Empresas',
    detailHeading: 'Proyecto en foco',
    highlightsHeading: 'Lo que hice en este proyecto',
    stackHeading: 'Stack y herramientas',
  },
  FR: {
    eyebrow: 'Expérience professionnelle',
    title: 'Freelance en priorité, contrats en soutien',
    description:
      'Une grande partie de mon parcours se fait en freelance, avec des missions en contrat pour accompagner des équipes produit et des agences.',
    freelanceLabel: 'Freelance',
    contractorLabel: 'Contrat',
    detailHeading: 'Projet en focus',
    highlightsHeading: "Ce sur quoi j'ai travaillé",
    stackHeading: 'Stack et outils',
  },
};

export default function ExperienceSection({ language = 'EN' }: ExperienceSectionProps) {
  const [activeTab, setActiveTab] = useState<ExperienceTab>('freelance');
  const initialId = freelanceExperiences[0]?.id ?? '';
  const [activeId, setActiveId] = useState<string>(initialId);

  const currentLanguage: LanguageCode = language ?? 'EN';
  const copy = experienceCopy[currentLanguage];

  const { primaryRgb, theme } = useTheme();
  const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;

  const currentList = experiencesByTab[activeTab];
  const fallback = currentList[0] || freelanceExperiences[0];

  const activeExperience =
    currentList.find(exp => exp.id === activeId) ??
    freelanceExperiences.find(exp => exp.id === activeId) ??
    fallback;

  const handleTabChange = (tab: ExperienceTab) => {
    setActiveTab(tab);
    const list = experiencesByTab[tab];
    if (list[0]) {
      setActiveId(list[0].id);
    }
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
            {(['freelance', 'contractor'] as ExperienceTab[]).map(tab => {
              const isActive = tab === activeTab;
              const label =
                tab === 'freelance' ? copy.freelanceLabel : copy.contractorLabel;

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
                  <span className="relative z-10">{label}</span>
                </button>
              );
            })}
          </div>

          <p className="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-muted-foreground-subtle mb-2">
            {copy.detailHeading}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeTab}-${activeExperience.id}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-border-subtle bg-surface-soft backdrop-blur-md p-5 sm:p-6"
              style={{
                boxShadow: `0 18px 60px rgba(0,0,0,${theme === 'dark' ? 0.6 : 0.15})`,
              }}
            >
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

              {activeExperience.highlights.length > 0 && (
                <div className="mb-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground-subtle mb-2">
                    {copy.highlightsHeading}
                  </p>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-muted-foreground">
                    {activeExperience.highlights.map(item => (
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

              {activeExperience.stack.length > 0 && (
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground-subtle mb-2">
                    {copy.stackHeading}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {activeExperience.stack.map(tech => (
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
            </motion.div>
          </AnimatePresence>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-full max-w-xl"
        >
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle mb-3 text-center lg:text-left">
            {activeTab === 'freelance'
              ? currentLanguage === 'PT'
                ? 'Projetos e clientes freelance'
                : currentLanguage === 'ES'
                  ? 'Proyectos y clientes freelance'
                  : currentLanguage === 'FR'
                    ? 'Projets et clients freelance'
                    : 'Freelance projects and clients'
              : currentLanguage === 'PT'
                ? 'Contratos e empresas'
                : currentLanguage === 'ES'
                  ? 'Contratos y empresas'
                  : currentLanguage === 'FR'
                    ? 'Contrats et entreprises'
                    : 'Contracts and teams'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 sm:gap-5 max-h-[60vh] overflow-y-auto pr-1">
            {currentList.map(experience => {
              const isActive = experience.id === activeExperience.id;

              return (
                <motion.button
                  key={experience.id}
                  type="button"
                  onMouseEnter={() => setActiveId(experience.id)}
                  onFocus={() => setActiveId(experience.id)}
                  onClick={() => setActiveId(experience.id)}
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
                      {experience.stack.slice(0, 3).map(tech => (
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