import { motion } from 'framer-motion';
import type { EducationItem } from '@/lib/content/schema';

interface EducationDetailCardProps {
  education?: EducationItem;
  primaryColor: string;
  primaryRgb: { r: number; g: number; b: number };
  isDark: boolean;
  listLabel: string;
  highlightsLabel: string;
}

export default function EducationDetailCard({
  education,
  primaryColor,
  primaryRgb,
  isDark,
  listLabel,
  highlightsLabel,
}: EducationDetailCardProps) {
  if (!education) {
    return null;
  }

  return (
    <motion.div
      key={`${education.course}-${education.institution}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="rounded-2xl border border-border-subtle overflow-hidden backdrop-blur-md h-full"
      style={{
        background: isDark ? 'rgba(20, 20, 25, 0.7)' : 'rgba(255, 255, 255, 0.5)',
        boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? 0.3 : 0.1})`,
      }}
    >
      <div
        className="h-2 w-full"
        style={{
          background: `linear-gradient(to right, ${primaryColor}, hsl(var(--secondary)))`,
        }}
      />

      <div className="p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-5">
          <span
            className="h-px w-8"
            style={{
              background: `linear-gradient(to right, ${primaryColor}, transparent)`,
            }}
          />
          <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
            {listLabel}
          </p>
        </div>

        <h2
          className="text-xl sm:text-2xl font-semibold mb-2"
          style={{ color: isDark ? '#fff' : 'var(--foreground)' }}
        >
          {education.course}
        </h2>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-sm text-muted-foreground">{education.institution}</span>
          <span
            className="px-2.5 py-1 rounded-md text-xs font-medium border border-border-subtle"
            style={{
              background: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`,
              color: primaryColor,
            }}
          >
            {education.period}
          </span>
        </div>

        {education.description && (
          <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {education.description}
            </p>
          </div>
        )}

        {!!education.highlights?.length && (
          <div className="pt-6 border-t border-border-subtle">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-4 rounded-full" style={{ backgroundColor: primaryColor }} />
              <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
                {highlightsLabel}
              </p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {education.highlights.map((highlight, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="flex items-start gap-2 text-sm p-3 rounded-lg bg-muted/30 border border-border-subtle"
                >
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <span className="text-foreground/90">{highlight}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
}
