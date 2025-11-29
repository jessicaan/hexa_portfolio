import { type PersonalContent, type Translation } from '@/lib/content/schema';
import { Rgb } from '@/types/custom';

interface PersonalValuesBadgesProps {
  values: PersonalContent['values'];
  translatedValues?: Translation['personal']['values'];
  primaryColor: string;
  primaryRgb: Rgb;
  isDark: boolean;
}

export default function PersonalValuesBadges({
  values,
  translatedValues,
  primaryColor,
  primaryRgb,
  isDark,
}: PersonalValuesBadgesProps) {
  if (!values || values.length === 0) {
    return null;
  }

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
          Values
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {values.map((value, idx) => (
          <span
            key={idx}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border-subtle"
            style={{
              background: `rgba(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}, 0.1)`,
            }}
          >
            {translatedValues?.[idx] || value}
          </span>
        ))}
      </div>
    </div>
  );
}
