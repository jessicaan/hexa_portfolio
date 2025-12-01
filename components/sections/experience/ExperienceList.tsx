import { motion } from 'framer-motion';
import type { ExperienceContent } from '@/lib/content/schema';

interface ExperienceListProps {
  experiences: ExperienceContent['experiences'];
  activeId: string;
  onSelect: (company: string) => void;
  primaryColor: string;
  primaryRgb: { r: number; g: number; b: number };
  isDark: boolean;
  label: string;
}

export default function ExperienceList({
  experiences,
  activeId,
  onSelect,
  primaryColor,
  primaryRgb,
  isDark,
  label,
}: ExperienceListProps) {
  return (
    <div
      className="rounded-2xl border border-border-subtle backdrop-blur-md p-5"
      style={{
        background: isDark ? 'rgba(20, 20, 25, 0.7)' : 'rgba(255, 255, 255, 0.5)',
        boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? 0.3 : 0.1})`,
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1 h-4 rounded-full" style={{ backgroundColor: primaryColor }} />
        <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
          {label}
        </p>
      </div>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto exp-scrollbar pr-1">
        {experiences.map((experience, index) => {
          const isActive = experience.company === activeId;

          return (
            <motion.button
              key={`${experience.company}-${index}`}
              type="button"
              onClick={() => onSelect(experience.company)}
              className="w-full text-left group"
            >
              <div
                className="relative rounded-xl border p-4 transition-all duration-300"
                style={{
                  background: isActive
                    ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`
                    : isDark
                      ? 'rgba(30, 30, 35, 0.5)'
                      : 'rgba(255, 255, 255, 0.3)',
                  borderColor: isActive
                    ? `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.4)`
                    : 'var(--border-subtle)',
                  boxShadow: isActive
                    ? `0 4px 20px rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.15)`
                    : 'none',
                }}
              >
                <div
                  className="absolute left-0 top-0 h-full w-1 rounded-l-xl transition-all duration-300"
                  style={{
                    background: isActive
                      ? `linear-gradient(to bottom, ${primaryColor}, hsl(var(--secondary)))`
                      : 'transparent',
                  }}
                />

                <div className="pl-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      {experience.period}
                    </p>
                    {experience.contractType && (
                      <span
                        className="px-2 py-0.5 rounded text-[9px] uppercase tracking-wider"
                        style={{
                          background: isDark
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.05)',
                          color: 'var(--muted-foreground)',
                        }}
                      >
                        {experience.contractType}
                      </span>
                    )}
                  </div>
                  <p
                    className="text-sm font-medium mb-0.5 transition-colors"
                    style={{ color: isActive ? primaryColor : 'var(--foreground)' }}
                  >
                    {experience.role}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {experience.company}
                    {experience.location ? ` - ${experience.location}` : ''}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
