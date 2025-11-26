export default function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-7 w-7 rounded-full bg-[#090314] overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-[#9b5cff] to-[#5cd9ff] opacity-70 blur-sm" />
            <div className="absolute inset-[2px] rounded-full border border-white/20" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
              Portfolio
            </span>
            <span className="text-xs text-white/80">
              Frontend · Motion · Experiences
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] text-white/40">
          <span className="px-3 py-1 rounded-full border border-white/15 bg-white/5">
            Available for freelance
          </span>
          <span className="text-white/50">Remote · Worldwide</span>
        </div>
      </div>
    </header>
  );
}

