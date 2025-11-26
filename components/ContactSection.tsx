'use client';

import { motion } from 'framer-motion';
import ReactiveGridBackground from '@/components/Reactivegridbackground';

type LanguageCode = 'PT' | 'EN' | 'ES' | 'FR';

interface ContactSectionProps {
  language?: LanguageCode;
}

const contactCopy: Record<
  LanguageCode,
  {
    eyebrow: string;
    title: string;
    description: string;
    emailLabel: string;
    socialLabel: string;
    availability: string;
  }
> = {
  PT: {
    eyebrow: 'Contato',
    title: 'Vamos transformar uma ideia em experiência',
    description:
      'Se você tem um produto, uma história ou um conceito que merece uma interface viva, podemos conversar. Gosto de entrar cedo no processo e ajudar a dar forma visual e interativa às ideias.',
    emailLabel: 'E‑mail principal',
    socialLabel: 'Outros lugares onde você pode me encontrar',
    availability: 'Disponível para projetos freelance · Remote',
  },
  EN: {
    eyebrow: 'Contact',
    title: 'Let’s turn an idea into an experience',
    description:
      'If you have a product, a story or a concept that deserves a living interface, let’s talk. I enjoy joining early and helping shape visual and interactive direction.',
    emailLabel: 'Primary e‑mail',
    socialLabel: 'Other places you can find me',
    availability: 'Available for freelance projects · Remote',
  },
  ES: {
    eyebrow: 'Contacto',
    title: 'Convirtamos una idea en experiencia',
    description:
      'Si tienes un producto, una historia o un concepto que merece una interfaz viva, hablemos. Me gusta participar temprano y ayudar a dar forma visual e interactiva a las ideas.',
    emailLabel: 'E‑mail principal',
    socialLabel: 'Otros lugares donde puedes encontrarme',
    availability: 'Disponible para proyectos freelance · Remote',
  },
  FR: {
    eyebrow: 'Contact',
    title: 'Transformons une idée en expérience',
    description:
      "Si vous avez un produit, une histoire ou un concept qui mérite une interface vivante, parlons‑en. J'aime intervenir tôt et aider à façonner la direction visuelle et interactive.",
    emailLabel: 'E‑mail principal',
    socialLabel: "Autres endroits où me trouver",
    availability: 'Disponible pour des projets freelance · Remote',
  },
};

const socials = [
  {
    id: 'github',
    label: 'GitHub',
    handle: '@seu-usuario',
    href: 'https://github.com/',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    handle: 'Seu nome aqui',
    href: 'https://www.linkedin.com/',
  },
  {
    id: 'dribbble',
    label: 'Dribbble / Behance',
    handle: 'Explorações visuais e UI',
    href: '#',
  },
];

export default function ContactSection({ language = 'EN' }: ContactSectionProps) {
  const currentLanguage: LanguageCode = language ?? 'EN';
  const copy = contactCopy[currentLanguage];

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

          <p className="text-[10px] sm:text-xs uppercase tracking-[0.22em] text-[#9b5cff] mb-2">
            {copy.availability}
          </p>

          <motion.a
            href="mailto:you@example.com"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs sm:text-sm text-white/80 hover:bg-white/10 hover:border-[#9b5cff] transition-colors"
          >
            <span className="h-2 w-2 rounded-full bg-linear-to-r from-[#9b5cff] to-[#5cd9ff]" />
            <span className="tracking-[0.16em] uppercase">{copy.emailLabel}</span>
            <span className="font-medium">you@example.com</span>
          </motion.a>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="w-full max-w-xl"
        >
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/40 mb-3 text-center lg:text-left">
            {copy.socialLabel}
          </p>

          <div className="space-y-3">
            {socials.map((social, index) => (
              <motion.a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * index }}
                className="block relative group"
              >
                <div className="absolute -inset-0.5 rounded-2xl bg-linear-to-br from-[#9b5cff30] via-transparent to-[#5cd9ff30] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative rounded-2xl border border-white/10 bg-[#04040a]/80 backdrop-blur-md px-4 py-4 shadow-[0_10px_40px_rgba(0,0,0,0.75)] flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs sm:text-sm text-white font-medium">{social.label}</p>
                    <p className="text-[11px] sm:text-xs text-white/60">{social.handle}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 group-hover:text-white/70 transition-colors">
                    {currentLanguage === 'PT'
                      ? 'ABRIR'
                      : currentLanguage === 'ES'
                      ? 'ABRIR'
                      : currentLanguage === 'FR'
                      ? 'OUVRIR'
                      : 'OPEN'}
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>
      </div>
    </main>
  );
}

