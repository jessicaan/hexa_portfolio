import { motion } from 'framer-motion';
import { type PersonalContent, type PersonalTranslation } from '@/lib/content/schema';
import { Rgb } from '@/lib/types/custom';

interface PersonalTraitsRadarChartProps {
  contentTraits: PersonalContent['traits'];
  translation: PersonalTranslation;
  primaryColor: string;
  primaryRgb: Rgb;
  isDark: boolean;
}

export default function PersonalTraitsRadarChart({
  contentTraits,
  translation,
  primaryColor,
  primaryRgb,
  isDark,
}: PersonalTraitsRadarChartProps) {
  const size = 420;
  const center = size / 2;
  const maxRadius = 110;

  const getPoint = (value: number, index: number, total: number) => {
    const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
    const radius = maxRadius * value;
    return { x: center + radius * Math.cos(angle), y: center + radius * Math.sin(angle) };
  };

  const polygonPoints = contentTraits
    .map((trait, index) => {
      const point = getPoint(trait.value, index, contentTraits.length);
      return `${point.x},${point.y}`;
    })
    .join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="lg:col-span-4 flex flex-col"
    >
      <div
        className="rounded-2xl border border-border-subtle backdrop-blur-md p-4 sm:p-6"
        style={{
          background: isDark ? 'rgba(20, 20, 25, 0.7)' : 'rgba(255, 255, 255, 0.5)',
          boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? 0.3 : 0.1})`,
        }}
      >
        <div className="flex items-center gap-2 mb-2 sm:mb-4">
          <span
            className="w-1 h-4 rounded-full"
            style={{ backgroundColor: primaryColor }}
          />
          <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
            {translation.howToReadGraphTitle}
          </p>
        </div>

        <div className="flex flex-col items-center w-full">
          <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-auto max-w-[470px]">
            <defs>
              <radialGradient id="trait-fill-personal" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={primaryColor} stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.05" />
              </radialGradient>
              <filter id="glow-personal" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {[0.33, 0.66, 1].map((level, idx) => (
              <polygon
                key={level}
                points={contentTraits
                  .map((_, i) => {
                    const point = getPoint(level, i, contentTraits.length);
                    return `${point.x},${point.y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}
                strokeWidth={idx === 2 ? 1 : 0.5}
              />
            ))}

            {contentTraits.map((_, index) => {
              const angle = (Math.PI * 2 * index) / contentTraits.length - Math.PI / 2;
              return (
                <line
                  key={index}
                  x1={center}
                  y1={center}
                  x2={center + maxRadius * Math.cos(angle)}
                  y2={center + maxRadius * Math.sin(angle)}
                  stroke={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}
                  strokeWidth={0.5}
                />
              );
            })}

            <polygon
              points={polygonPoints}
              fill="url(#trait-fill-personal)"
              stroke={primaryColor}
              strokeWidth={2}
              filter="url(#glow-personal)"
            />

            {contentTraits.map((trait, index) => {
              const point = getPoint(trait.value, index, contentTraits.length);
              return (
                <g key={trait.id}>
                  <circle cx={point.x} cy={point.y} r={6} fill={primaryColor} opacity={0.2} />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={3}
                    fill={primaryColor}
                    stroke={isDark ? '#1a1a1a' : '#fff'}
                    strokeWidth={1.5}
                  />
                </g>
              );
            })}

            {contentTraits.map((trait, index) => {
              const total = contentTraits.length;
              const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
              const labelRadius = maxRadius + 25;

              const x = center + labelRadius * Math.cos(angle);
              const y = center + labelRadius * Math.sin(angle);

              const translatedLabel = translation.translatedTraits?.[index]?.label || trait.label;

              let textAnchor: 'middle' | 'start' | 'end' = 'middle';
              const cosAngle = Math.cos(angle);
              const sinAngle = Math.sin(angle);

              if (cosAngle > 0.1) textAnchor = 'start';
              if (cosAngle < -0.1) textAnchor = 'end';

              let baseDy = 0.35;
              if (sinAngle < -0.5) baseDy = -0.5;
              if (sinAngle > 0.5) baseDy = 0.8;

              const maxCharsPerLine = 12;
              const words = translatedLabel.split(' ');
              const lines: string[] = [];
              let currentLine = words[0];

              for (let i = 1; i < words.length; i++) {
                if (currentLine.length + 1 + words[i].length <= maxCharsPerLine) {
                  currentLine += ' ' + words[i];
                } else {
                  lines.push(currentLine);
                  currentLine = words[i];
                }
              }
              lines.push(currentLine);

              if (lines.length > 1 && sinAngle < -0.5) {
                baseDy -= 0.5;
              }

              return (
                <text
                  key={trait.id}
                  x={x}
                  y={y}
                  textAnchor={textAnchor}
                  fill={isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'}
                  fontSize="11"
                  fontWeight="500"
                  style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}
                >
                  {lines.map((line, i) => (
                    <tspan
                      key={i}
                      x={x}
                      dy={i === 0 ? `${baseDy}em` : '1.1em'}
                    >
                      {line}
                    </tspan>
                  ))}
                </text>
              );
            })}
          </svg>

          <p className="text-xs text-muted-foreground text-center max-w-xs leading-relaxed mt-2 sm:mt-4">
            {translation.howToReadGraphDescription}
          </p>
        </div>
      </div>
    </motion.div>
  );
}