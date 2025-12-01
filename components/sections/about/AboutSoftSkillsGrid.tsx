import { motion } from 'framer-motion';
import type { SoftSkill } from '@/lib/content/schema';

interface AboutSoftSkillsGridProps {
  skills: SoftSkill[];
  primaryColor: string;
  isDark: boolean;
  label: string;
}

export default function AboutSoftSkillsGrid({
  skills,
  primaryColor,
  isDark,
  label,
}: AboutSoftSkillsGridProps) {
  if (!skills.length) {
    return null;
  }

  return (
    <div
      className="rounded-2xl border border-border-subtle p-5 backdrop-blur-md"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {skills.map((skill, idx) => (
          <motion.div
            key={skill.name + idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 + idx * 0.05 }}
            className="group p-3 rounded-xl bg-background/50 border border-border-subtle hover:border-border transition-all"
          >
            <div className="flex items-start gap-2">
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: primaryColor }}
              />
              <div>
                <p className="text-md font-medium text-foreground mb-0.5">{skill.name}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{skill.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
