import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { type LanguageCode } from '@/lib/content/schema';

interface PersonalSectionHeaderProps {
  primaryColor: string;
  eyebrow: string;
  title: string;
  description: string;
  isDark: boolean;
}

export default function PersonalSectionHeader({
  primaryColor,
  eyebrow,
  title,
  description,
  isDark,
}: PersonalSectionHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10 lg:mb-14"
    >
      <div className="flex items-center gap-3 mb-4">
        <span
          className="h-px w-10"
          style={{
            background: `linear-gradient(to right, ${primaryColor}, transparent)`,
          }}
        />
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          {eyebrow}
        </p>
      </div>
      <h1
        className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-4"
        style={{ color: isDark ? '#fff' : 'var(--foreground)' }}
      >
        {title}
      </h1>
      <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
        {description}
      </p>
    </motion.header>
  );
}
