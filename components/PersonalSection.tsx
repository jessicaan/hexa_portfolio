'use client';

import { motion } from 'framer-motion';
import ReactiveGridBackground from '@/components/Reactivegridbackground';

type LanguageCode = 'PT' | 'EN' | 'ES' | 'FR';

interface PersonalSectionProps {
  language?: LanguageCode;
}

interface Trait {
  id: string;
  label: string;
  value: number;
}

interface HobbyCard {
  id: string;
  title: string;
  description: string;
}

const traits: Trait[] = [
  { id: 'curiosity', label: 'Curiosidade', value: 0.95 },
  { id: 'creativity', label: 'Criatividade', value: 0.9 },
  { id: 'focus', label: 'Foco profundo', value: 0.85 },
  { id: 'calm', label: 'Calma', value: 0.75 },
  { id: 'collaboration', label: 'Colaboração', value: 0.82 },
  { id: 'experimentation', label: 'Experimentação', value: 0.9 },
];

const hobbies: HobbyCard[] = [
  {
    id: 'games',
    title: 'Jogos e narrativas interativas',
    description:
      'Gosto de analisar como jogos contam histórias através de interfaces, ritmo e pequenas interações que prendem a atenção.',
  },
  {
    id: 'music',
    title: 'Música como trilha de foco',
    description:
      'Costumo trabalhar com playlists pensadas para manter o fluxo, explorando muito lo‑fi, eletrônica leve e trilhas de filmes e jogos.',
  },
  {
    id: 'visual-experiments',
    title: 'Experimentos visuais',
    description:
      'Brinco com protótipos rápidos para testar novas ideias de UI, animação e storytelling visual fora de projetos formais.',
  },
];

const funFacts: string[] = [
  'Gosto de documentar ideias em pequenos mapas visuais e diagramas antes de escrever código.',
  'Tenho costume de salvar referências de animação e microinterações interessantes que encontro pela web.',
  'Curto muito observar como produtos que não são “de tecnologia” pensam jornada, ritmo e experiência.',
];

const personalCopy: Record<
  LanguageCode,
  {
    eyebrow: string;
    title: string;
    description: string;
    traitsLabel: string;
    hobbiesLabel: string;
    funFactsLabel: string;
  }
> = {
  PT: {
    eyebrow: 'Hobbies, personalidade e curiosidades',
    title: 'Um pouco do que me move fora do código',
    description:
      'Gosto de pensar experiências digitais como extensão de coisas que vivo fora da tela: jogos, música, narrativas, detalhes visuais e pequenos rituais de foco.',
    traitsLabel: 'Mapa de traços pessoais',
    hobbiesLabel: 'Hobbies que influenciam meu trabalho',
    funFactsLabel: 'Curiosidades sobre como eu trabalho',
  },
  EN: {
    eyebrow: 'Hobbies, personality & curiosities',
    title: 'What shapes me outside of code',
    description:
      'I like to see digital experiences as an extension of what I enjoy offline: games, music, stories, visual details and small focus rituals.',
    traitsLabel: 'Personal trait map',
    hobbiesLabel: 'Hobbies that influence my work',
    funFactsLabel: 'Curiosities about how I work',
  },
  ES: {
    eyebrow: 'Hobbies, personalidad y curiosidades',
    title: 'Lo que me mueve fuera del código',
    description:
      'Me gusta pensar las experiencias digitales como extensión de lo que vivo fuera de la pantalla: juegos, música, narrativas y detalles visuales.',
    traitsLabel: 'Mapa de rasgos personales',
    hobbiesLabel: 'Hobbies que influyen en mi trabajo',
    funFactsLabel: 'Curiosidades sobre cómo trabajo',
  },
  FR: {
    eyebrow: 'Hobbies, personnalité et curiosités',
    title: 'Ce qui me nourrit en dehors du code',
    description:
      'Je vois les expériences numériques comme une extension de ce que j’aime hors écran : jeux, musique, récits, détails visuels et petits rituels de concentration.',
    traitsLabel: 'Carte de traits personnels',
    hobbiesLabel: 'Hobbies qui influencent mon travail',
    funFactsLabel: 'Curiosités sur ma manière de travailler',
  },
};

export default function PersonalSection({ language = 'EN' }: PersonalSectionProps) {
  const currentLanguage: LanguageCode = language ?? 'EN';
  const copy = personalCopy[currentLanguage];

  const size = 260;
  const center = size / 2;
  const maxRadius = 90;

  const getPoint = (value: number, index: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const radius = maxRadius * value;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    return `${x},${y}`;
  };

  const polygonPoints = traits
    .map((trait, index) => getPoint(trait.value, index, traits.length))
    .join(' ');

  const levels = [0.35, 0.7, 1];

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

          <p className="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-white/40 mb-3">
            {copy.hobbiesLabel}
          </p>

          <div className="space-y-3">
            {hobbies.map(card => (
              <div
                key={card.id}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
              >
                <p className="text-xs sm:text-sm text-white font-medium mb-1">{card.title}</p>
                <p className="text-[11px] sm:text-xs text-white/65">{card.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-5">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-white/40 mb-2">
              {copy.funFactsLabel}
            </p>
            <ul className="space-y-1.5 text-xs sm:text-sm text-white/70">
              {funFacts.map(item => (
                <li key={item} className="flex gap-2">
                  <span className="mt-[6px] h-[3px] w-3 rounded-full bg-linear-to-r from-[#9b5cff] to-[#5cd9ff]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-full max-w-xl"
        >
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/40 mb-3 text-center lg:text-left">
            {copy.traitsLabel}
          </p>

          <div className="rounded-3xl border border-white/12 bg-white/5 shadow-[0_18px_60px_rgba(0,0,0,0.6)] backdrop-blur-md px-4 py-4 sm:px-6 sm:py-6 flex flex-col md:flex-row gap-6 items-center">
            <motion.svg
              viewBox={`0 0 ${size} ${size}`}
              className="w-52 h-52 sm:w-60 sm:h-60"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            >
              <defs>
                <radialGradient id="trait-fill" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#9b5cff" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#5cd9ff" stopOpacity="0.05" />
                </radialGradient>
              </defs>

              {/* grid levels */}
              {levels.map((level, idx) => {
                const points = traits
                  .map((_, index) => getPoint(level, index, traits.length))
                  .join(' ');
                return (
                  <polygon
                    key={level}
                    points={points}
                    fill="none"
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth={idx === levels.length - 1 ? 1.2 : 0.6}
                  />
                );
              })}

              {/* axes */}
              {traits.map((_, index) => {
                const angle = (Math.PI * 2 * index) / traits.length - Math.PI / 2;
                const x = center + maxRadius * Math.cos(angle);
                const y = center + maxRadius * Math.sin(angle);
                return (
                  <line
                    key={index}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth={0.6}
                  />
                );
              })}

              {/* main polygon */}
              <motion.polygon
                points={polygonPoints}
                fill="url(#trait-fill)"
                stroke="#9b5cff"
                strokeWidth={1.5}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              />

              {/* points */}
              {traits.map((trait, index) => {
                const [xStr, yStr] = getPoint(trait.value, index, traits.length).split(',');
                const x = parseFloat(xStr);
                const y = parseFloat(yStr);
                return (
                  <circle
                    key={trait.id}
                    cx={x}
                    cy={y}
                    r={3}
                    fill="#9b5cff"
                    stroke="#ffffff"
                    strokeWidth={1}
                  />
                );
              })}

              {/* labels */}
              {traits.map((trait, index) => {
                const angle = (Math.PI * 2 * index) / traits.length - Math.PI / 2;
                const x = center + (maxRadius + 18) * Math.cos(angle);
                const y = center + (maxRadius + 18) * Math.sin(angle);
                return (
                  <text
                    key={trait.id}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="rgba(255,255,255,0.7)"
                    fontSize="9"
                    style={{ letterSpacing: '0.08em' }}
                  >
                    {trait.label.toUpperCase()}
                  </text>
                );
              })}
            </motion.svg>

            <div className="flex-1 space-y-3 text-xs sm:text-sm text-white/75">
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">
                Como ler esse gráfico
              </p>
              <p>
                Cada eixo representa um traço que costuma influenciar como eu colaboro e tomo
                decisões em projetos. Não é uma ciência exata, mas um mapa rápido para entender meu
                estilo.
              </p>
              <ul className="space-y-1.5">
                <li>
                  <span className="font-medium text-white">Curiosidade</span> · explorar contextos,
                  referências e perguntas antes de propor soluções.
                </li>
                <li>
                  <span className="font-medium text-white">Experimentação</span> · testar ideias em
                  pequena escala, prototipar e iterar rápido.
                </li>
                <li>
                  <span className="font-medium text-white">Foco profundo</span> · reservar blocos
                  de tempo para resolver partes complexas com calma.
                </li>
              </ul>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

