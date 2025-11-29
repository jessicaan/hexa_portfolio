'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ReactiveGridBackground from '@/components/Reactivegridbackground';
import { useTheme } from '@/components/ThemeProvider';
import { loadContactContent } from '@/lib/content/client';
import { defaultContactContent, type ContactContent, type LanguageCode } from '@/lib/content/schema';
import { useTranslation } from 'react-i18next';

interface ContactSectionProps {}

export default function ContactSection({}: ContactSectionProps) {
  const { i18n } = useTranslation();
  const language = i18n.language as LanguageCode;

  const { primaryRgb, theme } = useTheme();
  const primaryColor = `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`;

  const [content, setContent] = useState<ContactContent>(defaultContactContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const data = await loadContactContent();
        setContent(data);
      } catch (error) {
        console.error("Failed to load contact content:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, []);

  if (loading) {
    return (
      <main className="relative w-screen h-screen overflow-hidden">
        <ReactiveGridBackground />
        <div className="relative z-10 flex items-center justify-center w-full h-full px-6 text-center">
          <p className="text-muted-foreground">Loading contact information...</p>
        </div>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="relative w-screen h-screen overflow-hidden">
        <ReactiveGridBackground />
        <div className="relative z-10 flex items-center justify-center w-full h-full px-6 text-center">
          <p className="text-muted-foreground">Failed to load contact data.</p>
        </div>
      </main>
    );
  }

  const translation = content.translations[language] || content.translations['en'];



  return (
    <main className="relative w-screen h-screen overflow-hidden">
      <ReactiveGridBackground />
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full h-full px-6 sm:px-10 gap-10 lg:gap-16">
        <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-xl text-center lg:text-left text-foreground">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-muted-foreground-subtle mb-4">{translation.headline}</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-5">{translation.headline}</h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">{translation.description}</p>
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.22em] mb-2" style={{ color: primaryColor }}>{translation.availability}</p>
          <motion.a href="mailto:you@example.com" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="inline-flex items-center gap-3 rounded-full border border-border-subtle bg-surface-soft px-5 py-2 text-xs sm:text-sm text-muted-foreground hover:border-primary hover:bg-primary/10 hover:text-foreground transition-colors">
            <span className="h-2 w-2 rounded-full" style={{ background: `linear-gradient(to right, ${primaryColor}, hsl(var(--secondary)))` }} />
            <span className="tracking-[0.16em] uppercase">{translation.emailLabel}</span>
            <span className="font-medium">you@example.com</span>
          </motion.a>
        </motion.section>
        <motion.section initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }} className="w-full max-w-xl">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-muted-foreground-subtle mb-3 text-center lg:text-left">{translation.socialLabel}</p>
          <div className="space-y-3">
            {content.socialLinks.map((social, index) => (
              <motion.a key={social.platform} href={social.url} target="_blank" rel="noreferrer" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 * index }} className="block relative group">
                <div className="absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(to bottom right, ${primaryColor}30, transparent, hsl(var(--secondary) / 0.3))` }} />
                <div className="relative rounded-2xl border border-border-subtle bg-surface-soft backdrop-blur-md px-4 py-4 flex items-center justify-between gap-3" style={{ boxShadow: `0 10px 40px rgba(0,0,0,${theme === 'dark' ? 0.75 : 0.15})` }}>
                  <div>
                    <p className="text-xs sm:text-sm text-foreground font-medium">{social.label}</p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground">{social.handle}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground-subtle group-hover:text-foreground transition-colors">{translation.openText}</span>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.section>
      </div>
    </main>
  );
}
