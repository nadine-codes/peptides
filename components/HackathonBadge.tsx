/**
 * Persistent corner badge advertising the hackathon result this project
 * was built for. Fixed bottom-right so it's visible from any page
 * without competing for layout space.
 */
export function HackathonBadge() {
  return (
    <div
      className="pointer-events-none fixed bottom-3 right-3 z-40 sm:bottom-5 sm:right-5"
      aria-label="3rd place · 2026 SF All Things Agents Hackathon · Built solo"
    >
      <div
        title="3rd place · 2026 SF All Things Agents Hackathon · Built solo"
        className="pointer-events-auto flex items-center gap-2 rounded-full border border-line/70 bg-bg-surface/80 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur transition hover:border-line-strong hover:text-ink-primary sm:px-3 sm:text-2xs"
      >
        <BronzeMedal />
        <span className="hidden sm:inline">3rd · 2026 SF All Things Agents · Solo</span>
        <span className="sm:hidden">3rd · Solo</span>
      </div>
    </div>
  );
}

function BronzeMedal() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0"
      aria-hidden
    >
      <defs>
        <linearGradient id="medal-bronze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9a87c" />
          <stop offset="0.5" stopColor="#cd7f32" />
          <stop offset="1" stopColor="#8b4513" />
        </linearGradient>
      </defs>
      {/* Ribbon tails */}
      <path
        d="M8.5 3 L10.5 11"
        stroke="#a0522d"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M15.5 3 L13.5 11"
        stroke="#a0522d"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Medal body */}
      <circle
        cx="12"
        cy="15.5"
        r="6"
        fill="url(#medal-bronze)"
        stroke="#5c2e0a"
        strokeWidth="0.7"
      />
      {/* Inner engraved ring */}
      <circle
        cx="12"
        cy="15.5"
        r="3.6"
        fill="none"
        stroke="#5c2e0a"
        strokeWidth="0.5"
        opacity="0.7"
      />
      {/* Small highlight to suggest metal */}
      <circle cx="10" cy="13.5" r="1.2" fill="#fcd9b6" opacity="0.6" />
    </svg>
  );
}
