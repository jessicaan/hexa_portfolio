import { motion } from 'framer-motion';

interface AboutStoryPanelProps {
  longDescription: string;
  highlights: string[];
  primaryColor: string;
  isDark: boolean;
  storyLabel: string;
  highlightsLabel: string;
  scrollClassName?: string;
}

export default function AboutStoryPanel({
  longDescription,
  highlights,
  primaryColor,
  isDark,
  storyLabel,
  highlightsLabel,
  scrollClassName = '',
}: AboutStoryPanelProps) {
  return (
    <div
      className="rounded-2xl border border-border-subtle overflow-hidden backdrop-blur-md flex-1 flex flex-col"
      style={{
        background: isDark ? 'rgba(20, 20, 25, 0.7)' : 'rgba(255, 255, 255, 0.5)',
        boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? 0.3 : 0.1})`,
      }}
    >
      <div className={`p-6 lg:p-8 flex-1 overflow-y-auto ${scrollClassName}`}>
        <div className="flex items-center gap-3 mb-5">
          <span
            className="h-px w-8"
            style={{
              background: `linear-gradient(to right, ${primaryColor}, transparent)`,
            }}
          />
          <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
            {storyLabel}
          </p>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div
            className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line"
            style={{ lineHeight: '1.8' }}
          >
            {longDescription}
          </div>
        </div>

        {!!highlights.length && (
          <div className="mt-8 pt-6 border-t border-border-subtle">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-4 rounded-full" style={{ backgroundColor: primaryColor }} />
              <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
                {highlightsLabel}
              </p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {highlights.map((item, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + idx * 0.04 }}
                  className="flex items-start gap-2 text-sm p-3 rounded-lg bg-muted/30 border border-border-subtle"
                >
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <span className="text-foreground/90">{item}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
