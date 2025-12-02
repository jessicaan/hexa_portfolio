import Image from 'next/image';

interface AboutMediaCardProps {
  primaryColor: string;
  primaryColorBg: string;
  isDark: boolean;
  videoUrl?: string | null;
  profileImage?: string | null;
  videoHeading: string;
  videoDescription: string;
  placeholderLabel: string;
  title: string;
}

export default function AboutMediaCard({
  primaryColor,
  primaryColorBg,
  isDark,
  videoUrl,
  profileImage,
  videoHeading,
  videoDescription,
  placeholderLabel,
  title,
}: AboutMediaCardProps) {
  const normalizedVideoUrl = videoUrl?.trim();
  const hasVideo = Boolean(normalizedVideoUrl);

  return (
    <div
      className="relative rounded-2xl border border-border-subtle overflow-hidden backdrop-blur-md"
      style={{
        background: isDark ? 'rgba(20, 20, 25, 0.7)' : 'rgba(255, 255, 255, 0.5)',
        boxShadow: `0 8px 32px rgba(0,0,0,${isDark ? 0.3 : 0.1})`,
      }}
    >
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${primaryColorBg} 0%, transparent 70%)`,
        }}
      />

      <div className="relative w-full py-16 flex justify-center items-center">
        <div
          className="relative w-full max-w-[280px] sm:max-w-[300px] aspect-9/16 rounded-xl overflow-hidden shadow-2xl border border-white/10"
          style={{ backgroundColor: isDark ? primaryColorBg : '#f0f0f0' }}
        >
          {hasVideo ? (
            <video
              src={normalizedVideoUrl ?? undefined}
              poster={profileImage || undefined}
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          ) : profileImage ? (
            <Image src={profileImage} alt={title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted/20">
              <div className="text-center p-6">
                <div
                  className="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: primaryColorBg }}
                >
                  <div
                    className="w-0 h-0 border-l-10 border-l-current border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"
                    style={{ color: primaryColor, opacity: 0.6 }}
                  />
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                  {placeholderLabel}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 border-t border-border-subtle relative z-10 bg-background/30 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3">
          <p className="text-xs uppercase tracking-widest font-medium text-muted-foreground">
            {videoHeading}
          </p>
        </div>
        {!hasVideo && (
          <p className="text-sm text-foreground/80 leading-relaxed">{videoDescription}</p>
        )}
      </div>
    </div>
  );
}
