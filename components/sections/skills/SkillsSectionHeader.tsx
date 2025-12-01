import { motion } from 'framer-motion';

interface SkillsSectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryColor: string;
  isDark: boolean;
}

export default function SkillsSectionHeader({
  eyebrow = 'Skills',
  title,
  description = '',
  primaryColor,
  isDark,
}: SkillsSectionHeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-10 lg:mb-14"
    >
      <div className="mb-4 flex items-center gap-3">
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
        className="mb-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
        style={{ color: isDark ? '#fff' : 'var(--foreground)' }}
      >
        {title}
      </h1>
      {!!description && (
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </motion.header>
  );
}
