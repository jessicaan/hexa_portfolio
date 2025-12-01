import { type ComponentType, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import * as SiIcons from 'react-icons/si';
import { getTechById } from '@/lib/content/technologies';

interface SkillsCategoryPanelProps {
  category?: {
    name: string;
    skills: Array<{ name: string; level: number }>;
  };
  primaryColor: string;
  isDark: boolean;
}

export default function SkillsCategoryPanel({
  category,
  primaryColor,
  isDark,
}: SkillsCategoryPanelProps) {
  if (!category) {
    return null;
  }

  return (
    <motion.div
      key={category.name}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden rounded-2xl border border-border-subtle backdrop-blur-md"
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
        <div className="mb-6 flex items-center gap-3">
          <span
            className="h-px w-8"
            style={{
              background: `linear-gradient(to right, ${primaryColor}, transparent)`,
            }}
          />
          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {category.name}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {category.skills.map((skill, idx) => {
            const tech = getTechById(skill.name);
            const Icon = tech?.icon
              ? (SiIcons as Record<string, ComponentType<{ className?: string; style?: CSSProperties }>>)[tech.icon]
              : null;

            return (
              <motion.div
                key={`${skill.name}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group rounded-xl border border-border-subtle p-4 transition-all duration-300 hover:border-border"
                style={{
                  background: isDark ? 'rgba(30, 30, 35, 0.5)' : 'rgba(255, 255, 255, 0.3)',
                }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {Icon && (
                      <Icon
                        className="h-5 w-5 transition-colors"
                        style={{ color: tech?.color }}
                      />
                    )}
                    <span className="text-sm font-medium text-foreground">{tech?.name || skill.name}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {skill.level}%
                  </span>
                </div>

                <div
                  className="h-1.5 w-full overflow-hidden rounded-full"
                  style={{
                    background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: `linear-gradient(to right, ${tech?.color || primaryColor}, hsl(var(--secondary)))`,
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 0.6, delay: idx * 0.05 + 0.1 }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
