'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactiveGridBackground from '@/components/Reactivegridbackground';

type LanguageCode = 'PT' | 'EN' | 'ES' | 'FR';

interface EducationSectionProps {
  language?: LanguageCode;
}

interface EducationEntry {
  period: string;
  title: string;
  institution: string;
  description: string;
}

interface CourseItem {
  id: string;
  title: string;
  platform: string;
  focus: string;
  status: 'completed' | 'in-progress';
}

const educationTimeline: EducationEntry[] = [
  {
    period: '2020 · 2024',
    title: 'Formação em Desenvolvimento Frontend',
    institution: 'Estudos focados em web moderna',
    description:
      'Base sólida em HTML, CSS, JavaScript e frameworks modernos, com foco em criar interfaces robustas e responsivas.',
  },
  {
    period: '2022 · 2024',
    title: 'Especialização em Experiências Interativas',
    institution: 'Estudos independentes e projetos autorais',
    description:
      'Projeto de interfaces com animações, microinterações, motion design e narrativas guiadas pelo usuário.',
  },
  {
    period: 'Em andamento',
    title: 'Estudos contínuos em UX, UI e produto',
    institution: 'Cursos, leituras e experimentos pessoais',
    description:
      'Aprofundando decisões de design, arquitetura de informação e colaboração entre times de produto.',
  },
];

const courses: CourseItem[] = [
  {
    id: 'react-advanced',
    title: 'React Avançado e Patterns Modernos',
    platform: 'Online',
    focus: 'Arquitetura de componentes, estado, performance e boas práticas.',
    status: 'completed',
  },
  {
    id: 'nextjs-ux',
    title: 'Next.js para Experiências de Produto',
    platform: 'Online',
    focus: 'Server components, roteamento, performance e DX.',
    status: 'completed',
  },
  {
    id: 'motion-design',
    title: 'Motion Design para Interfaces',
    platform: 'Online',
    focus: 'Animações conscientes, microinterações e transições entre telas.',
    status: 'in-progress',
  },
  {
    id: 'design-systems',
    title: 'Design Systems na Prática',
    platform: 'Online',
    focus: 'Tokens, bibliotecas de componentes e governança visual.',
    status: 'in-progress',
  },
];

const educationCopy: Record<
  LanguageCode,
  {
    eyebrow: string;
    title: string;
    description: string;
    timelineLabel: string;
    coursesLabel: string;
    status: {
      completed: string;
      'in-progress': string;
    };
  }
> = {
  PT: {
    eyebrow: 'Educação & Cursos',
    title: 'Onde aprendi e continuo aprendendo',
    description:
      'Um recorte da minha formação e dos cursos que ajudam a construir minha forma de pensar produtos digitais.',
    timelineLabel: 'Formação e trilha de estudo',
    coursesLabel: 'Cursos e imersões recentes',
    status: {
      completed: 'Concluído',
      'in-progress': 'Em andamento',
    },
  },
  EN: {
    eyebrow: 'Education & Courses',
    title: 'Where I learned and keep learning',
    description:
      'A snapshot of my education and courses that shape how I think about digital products.',
    timelineLabel: 'Education and learning path',
    coursesLabel: 'Recent courses and immersions',
    status: {
      completed: 'Completed',
      'in-progress': 'In progress',
    },
  },
  ES: {
    eyebrow: 'Educación y cursos',
    title: 'Dónde aprendí y sigo aprendiendo',
    description:
      'Un recorte de mi formación y de los cursos que influyen en cómo pienso productos digitales.',
    timelineLabel: 'Formación y ruta de aprendizaje',
    coursesLabel: 'Cursos e inmersiones recientes',
    status: {
      completed: 'Completado',
      'in-progress': 'En progreso',
    },
  },
  FR: {
    eyebrow: 'Éducation & cours',
    title: "Là où j'ai appris et j'apprends encore",
    description:
      'Un aperçu de ma formation et des cours qui influencent ma manière de penser les produits numériques.',
    timelineLabel: "Parcours de formation et d'apprentissage",
    coursesLabel: 'Cours et immersions récentes',
    status: {
      completed: 'Terminé',
      'in-progress': 'En cours',
    },
  },
};

export default function EducationSection({ language = 'EN' }: EducationSectionProps) {
  const [activeCourseId, setActiveCourseId] = useState<string>(courses[0]?.id);
  const activeCourse = courses.find(course => course.id === activeCourseId) ?? courses[0];

  const currentLanguage: LanguageCode = language ?? 'EN';
  const copy = educationCopy[currentLanguage];

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <ReactiveGridBackground />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full h-full px-6 sm:px-10 gap-10 lg:gap-16">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl text-center lg:text-left text-white"
        >
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white/50 mb-4">
            {copy.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-5">
            {copy.title}
          </h2>
          <p className="text-sm sm:text-base text-white/70 leading-relaxed mb-6">
            {copy.description}
          </p>

          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/40 mb-3">
            {copy.timelineLabel}
          </p>

          <div className="space-y-4">
            {educationTimeline.map((entry, index) => (
              <motion.div
                key={entry.title}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex gap-3"
              >
                <div className="mt-1">
                  <div className="w-1 h-8 rounded-full bg-linear-to-b from-[#9b5cff] to-[#5cd9ff]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/40 mb-1">
                    {entry.period}
                  </p>
                  <p className="text-sm sm:text-base text-white font-medium">{entry.title}</p>
                  <p className="text-[11px] sm:text-xs text-white/60">{entry.institution}</p>
                  <p className="text-xs sm:text-sm text-white/70 mt-1">{entry.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-full max-w-xl"
        >
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/40 mb-3 text-center lg:text-left">
            {copy.coursesLabel}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-5">
            {courses.map(course => {
              const isActive = course.id === activeCourseId;
              const statusLabel = copy.status[course.status];

              return (
                <motion.button
                  key={course.id}
                  type="button"
                  onMouseEnter={() => setActiveCourseId(course.id)}
                  onFocus={() => setActiveCourseId(course.id)}
                  onClick={() => setActiveCourseId(course.id)}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ duration: 0.25 }}
                  className="relative group text-left"
                >
                  <motion.div
                    className="absolute -inset-0.5 rounded-2xl bg-linear-to-br from-[#9b5cff40] via-transparent to-[#5cd9ff40] opacity-0 group-hover:opacity-100"
                    animate={{ opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                  />

                  <div className="relative rounded-2xl border border-white/10 bg-[#04040a]/80 backdrop-blur-md px-4 py-4 sm:px-4 sm:py-4 shadow-[0_10px_40px_rgba(0,0,0,0.75)] overflow-hidden">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex-1">
                        <p className="text-sm sm:text-base font-medium text-white mb-1">
                          {course.title}
                        </p>
                        <p className="text-[11px] sm:text-xs text-white/60">{course.platform}</p>
                      </div>
                      <motion.span
                        className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-white/40"
                        animate={{
                          opacity: isActive ? 1 : 0.4,
                          y: isActive ? 0 : 2,
                        }}
                      >
                        {statusLabel}
                      </motion.span>
                    </div>

                    <p className="text-[11px] sm:text-xs text-white/65">{course.focus}</p>

                    <motion.div
                      className="absolute inset-px rounded-2xl border border-[#9b5cff] pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isActive ? 0.35 : 0 }}
                      transition={{ duration: 0.25 }}
                    />
                  </div>
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCourse.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-white/12 bg-white/5 shadow-[0_18px_60px_rgba(0,0,0,0.6)] backdrop-blur-md p-5 sm:p-6"
            >
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/40 mb-2">
                {copy.coursesLabel}
              </p>
              <p className="text-sm sm:text-base text-white font-medium mb-1">
                {activeCourse.title}
              </p>
              <p className="text-[11px] sm:text-xs text-white/60 mb-3">
                {activeCourse.platform} · {copy.status[activeCourse.status]}
              </p>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                {activeCourse.focus}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.section>
      </div>
    </main>
  );
}

