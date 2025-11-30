import { motion } from 'framer-motion';
import { type PersonalContent, type PersonalTranslation } from '@/lib/content/schema';

interface PersonalHobbyCardsProps {
  hobbyCards: PersonalContent['hobbyCards'];
  translatedHobbies?: PersonalTranslation['translatedHobbies'];
  hobbiesLabel: string;
  primaryColor: string;
  isDark: boolean;
}

export default function PersonalHobbyCards({
  hobbyCards,
  translatedHobbies,
  hobbiesLabel,
  primaryColor,
  isDark,
}: PersonalHobbyCardsProps) {
  if (!hobbyCards || hobbyCards.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex items-center gap-3 mb-5">
        <span
          className="h-px w-8"
          style={{
            background: `linear-gradient(to right, ${primaryColor}, transparent)`,
          }}
        />
        <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
          {hobbiesLabel}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {hobbyCards.map((card, idx) => {
          const translatedHobby = translatedHobbies?.[idx];

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + idx * 0.08 }}
              className="group rounded-xl border border-border-subtle p-4 transition-all duration-300 hover:border-border"
              style={{
                background: isDark ? 'rgba(30, 30, 35, 0.5)' : 'rgba(255, 255, 255, 0.3)',
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-1 h-8 rounded-full shrink-0 mt-0.5"
                  style={{
                    background: `linear-gradient(to bottom, ${primaryColor}, hsl(var(--secondary)))`,
                  }}
                />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    {translatedHobby?.title || card.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {translatedHobby?.description || card.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </>
  );
}
