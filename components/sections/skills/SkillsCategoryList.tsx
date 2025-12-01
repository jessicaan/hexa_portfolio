import { type ReactNode } from 'react';

interface SkillsCategoryListProps {
  categories: Array<{
    name: string;
    skills: Array<{ name: string; level: number }>;
  }>;
  activeIndex: number;
  onSelect: (index: number) => void;
  primaryColor: string;
  primaryRgb: { r: number; g: number; b: number };
  isDark: boolean;
  footer?: ReactNode;
}

export default function SkillsCategoryList({
  categories,
  activeIndex,
  onSelect,
  primaryColor,
  primaryRgb,
  isDark,
  footer,
}: SkillsCategoryListProps) {
  return (
    <div
      className="rounded-2xl border border-border-subtle p-5 backdrop-blur-md"
      style={{
        background: isDark ? 'rgba(20, 20, 25, 0.7)' : 'rgba(255, 255, 255, 0.5)',
        boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? 0.3 : 0.1})`,
      }}
    >
      <div className="mb-4 flex items-center gap-2">
        <span className="h-4 w-1 rounded-full" style={{ backgroundColor: primaryColor }} />
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Categories
        </p>
      </div>

      <div className="space-y-2">
        {categories.map((category, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={`${category.name}-${index}`}
              onClick={() => onSelect(index)}
              className="group w-full text-left"
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
                  <p
                    className="mb-1 text-sm font-medium transition-colors"
                    style={{ color: isActive ? primaryColor : 'var(--foreground)' }}
                  >
                    {category.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{category.skills.length} skills</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {footer}
    </div>
  );
}
