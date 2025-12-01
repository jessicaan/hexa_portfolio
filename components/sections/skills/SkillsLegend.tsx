import type { CSSProperties } from 'react';

interface SkillsLegendProps {
  levels: Array<{ name: string; width: string }>;
  primaryColor: string;
  isDark: boolean;
  title?: string;
}

export default function SkillsLegend({ levels, primaryColor, isDark, title = 'Proficiency' }: SkillsLegendProps) {
  if (!levels.length) {
    return null;
  }

  return (
    <div className="mt-6 border-t border-border-subtle pt-4">
      <p className="mb-3 text-[10px] uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <div className="space-y-2">
        {levels.map(level => (
          <div key={level.name} className="flex items-center gap-3">
            <div
              className="h-1.5 w-16 overflow-hidden rounded-full"
              style={{
                background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
              }}
            >
              <div
                className="h-full rounded-full"
                style={
                  {
                    width: level.width,
                    background: `linear-gradient(to right, ${primaryColor}, hsl(var(--secondary)))`,
                  } as CSSProperties
                }
              />
            </div>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {level.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
