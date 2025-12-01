import { motion } from 'framer-motion';

interface AboutSectionHeaderProps {
  eyebrowLabel: string;
  summary: string;
  primaryColor: string;
  isDark: boolean;
}

export default function AboutSectionHeader({
  eyebrowLabel,
  summary,
  primaryColor,
  isDark,
}: AboutSectionHeaderProps) {
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
          {eyebrowLabel}
        </p>
      </div>
      <h1
        className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-4"
        style={{ color: isDark ? '#fff' : 'var(--foreground)' }}
      >
        {summary}
      </h1>
    </motion.header>
  );
}
