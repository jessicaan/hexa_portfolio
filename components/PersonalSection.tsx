'use client';

import { motion } from 'framer-motion';
import ReactiveGridBackground from '@/components/Reactivegridbackground';
import { useTheme } from '@/components/ThemeProvider';
import type { LanguageCode } from '@/app/i18n';

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
    description: 'Gosto de analisar como jogos contam histórias através de interfaces e ritmo.',
  },
  {
    id: 'music',
    title: 'Música como trilha de foco',
    description: 'Trabalho com playlists de lo-fi, eletrônica leve e trilhas de filmes.',
  },
  {
    id: 'visual-experiments',
    title: 'Experimentos visuais',
    description: 'Protótipos rápidos para testar novas ideias de UI e animação.',
  },
];

const personalCopy: Record<'PT' | 'EN' | 'ES' | 'FR', { eyebrow: string; title: string; description: string; hobbiesLabel: string; }> = {
  PT: { eyebrow: 'Hobbies e curiosidades', title: 'Um pouco do que me move fora do código', description: 'Gosto de pensar experiências digitais como extensão de coisas que vivo fora da tela.', hobbiesLabel: 'Hobbies que influenciam meu trabalho' },
  EN: { eyebrow: 'Hobbies & curiosities', title: 'What shapes me outside of code', description: 'I like to see digital experiences as an extension of what I enjoy offline.', hobbiesLabel: 'Hobbies that influence my work' },
  ES: { eyebrow: 'Hobbies y curiosidades', title: 'Lo que me mueve fuera del código', description: 'Me gusta pensar las experiencias digitales como extensión de lo que vivo fuera de la pantalla.', hobbiesLabel: 'Hobbies que influyen en mi trabajo' },
  FR: { eyebrow: 'Hobbies et curiosités', title: 'Ce qui me nourrit en dehors du code', description: "Je vois les expériences numériques comme une extension de ce que j'aime hors écran.", hobbiesLabel: 'Hobbies qui influencent mon travail' },
};

export default function PersonalSection({ language = 'en' }: PersonalSectionProps) {
  const langKey = (language ?? 'en').toUpperCase() as 'PT' | 'EN' | 'ES' | 'FR';
  const copy = personalCopy[langKey] ?? personalCopy.EN;
  const { primaryRgb, theme } = useTheme();
  const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;

  const size = 260;
  const center = size / 2;
  const maxRadius = 90;

  const getPoint = (value: number, index: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const radius = maxRadius * value;
    return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
  };

  const polygonPoints = traits.map((trait, index) => getPoint(trait.value, index, traits.length)).join(' ');

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <ReactiveGridBackground />
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full h-full px-6 sm:px-10 gap-10 lg:gap-16">
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl text-center lg:text-left text-foreground">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-muted-foreground-subtle mb-4">{copy.eyebrow}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-5">{copy.title}</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">{copy.description}</p>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-muted-foreground-subtle mb-3">{copy.hobbiesLabel}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {hobbies.map(card => (
              <div key={card.id} className="rounded-2xl border border-border-subtle bg-surface-soft px-4 py-4" style={{ boxShadow: `0 10px 30px rgba(0,0,0,${theme === 'dark' ? 0.6 : 0.15})` }}>
                <p className="text-xs sm:text-sm text-foreground font-medium mb-1">{card.title}</p>
                <p className="text-[11px] sm:text-xs text-muted-foreground">{card.description}</p>
              </div>
            ))}
          </div>
        </motion.section>
        <motion.section initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="w-full max-w-xl">
          <div className="rounded-3xl border border-border-subtle bg-surface-soft backdrop-blur-md px-4 py-4 sm:px-6 sm:py-6 flex flex-col md:flex-row gap-6 items-center" style={{ boxShadow: `0 18px 60px rgba(0,0,0,${theme === 'dark' ? 0.6 : 0.15})` }}>
            <svg viewBox={`0 0 ${size} ${size}`} className="w-52 h-52 sm:w-60 sm:h-60">
              <defs><radialGradient id="trait-fill" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor={primaryColor} stopOpacity="0.35" /><stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.05" /></radialGradient></defs>
              {[0.35, 0.7, 1].map((level, idx) => (<polygon key={level} points={traits.map((_, i) => getPoint(level, i, traits.length)).join(' ')} fill="none" stroke={theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)'} strokeWidth={idx === 2 ? 1.2 : 0.6} />))}
              {traits.map((_, index) => { const angle = (Math.PI * 2 * index) / traits.length - Math.PI / 2; return (<line key={index} x1={center} y1={center} x2={center + maxRadius * Math.cos(angle)} y2={center + maxRadius * Math.sin(angle)} stroke={theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'} strokeWidth={0.6} />); })}
              <polygon points={polygonPoints} fill="url(#trait-fill)" stroke={primaryColor} strokeWidth={1.5} />
              {traits.map((trait, index) => { const [xStr, yStr] = getPoint(trait.value, index, traits.length).split(','); return (<circle key={trait.id} cx={parseFloat(xStr)} cy={parseFloat(yStr)} r={3} fill={primaryColor} stroke={theme === 'dark' ? '#ffffff' : '#1a1a1a'} strokeWidth={1} />); })}
              {traits.map((trait, index) => { const angle = (Math.PI * 2 * index) / traits.length - Math.PI / 2; return (<text key={trait.id} x={center + (maxRadius + 18) * Math.cos(angle)} y={center + (maxRadius + 18) * Math.sin(angle)} textAnchor="middle" dominantBaseline="middle" fill={theme === 'dark' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'} fontSize="9" style={{ letterSpacing: '0.08em' }}>{trait.label.toUpperCase()}</text>); })}
            </svg>
            <div className="flex-1 space-y-3 text-xs sm:text-sm text-muted-foreground">
              <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground-subtle">Como ler esse gráfico</p>
              <p>Cada eixo representa um traço que influencia como eu colaboro e tomo decisões.</p>
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}
