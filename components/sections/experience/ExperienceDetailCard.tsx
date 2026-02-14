import { motion } from 'framer-motion';
import type { ExperienceContent } from '@/lib/content/schema';

interface ExperienceDetailCardProps {
  experience?: ExperienceContent['experiences'][number];
  primaryColor: string;
  primaryRgb: { r: number; g: number; b: number };
  isDark: boolean;
  detailHeading: string;
  highlightsHeading: string;
  stackHeading: string;
}

export default function ExperienceDetailCard({
  experience,
  primaryColor,
  primaryRgb,
  isDark,
  detailHeading,
  highlightsHeading,
  stackHeading,
}: ExperienceDetailCardProps) {
  if (!experience) {
    return null;
  }

  return (
    <motion.div
      key={experience.company}
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
            {detailHeading}
          </p>
        </div>

        <h2
          className="text-xl sm:text-2xl font-semibold mb-2 text-foreground"
        >
          {experience.role}
        </h2>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-sm text-muted-foreground">
            {experience.company}
            {experience.location ? ` - ${experience.location}` : ''}
          </span>
          <span
            className="px-2.5 py-1 rounded-md text-xs font-medium border border-border-subtle"
            style={{
              background: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`,
              color: primaryColor,
            }}
          >
            {experience.period}
          </span>
        </div>

        {experience.description && (
          <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
            <p className="text-sm text-muted-foreground leading-relaxed">{experience.description}</p>
          </div>
        )}

        {!!experience.achievements?.length && (
          <div className="pt-6 border-t border-border-subtle mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-4 rounded-full" style={{ backgroundColor: primaryColor }} />
              <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
                {highlightsHeading}
              </p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {experience.achievements.map((achievement, idx) => (
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
                  <span className="text-foreground/90">{achievement}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}

        {!!experience.technologies?.length && (
          <div className="pt-6 border-t border-border-subtle">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-4 rounded-full" style={{ backgroundColor: primaryColor }} />
              <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
                {stackHeading}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {experience.technologies.map((tech, idx) => (
                <span
                  key={`${tech}-${idx}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border-subtle transition-colors hover:border-border"
                  style={{
                    background: isDark ? 'rgba(30, 30, 35, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
