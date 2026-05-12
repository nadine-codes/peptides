export function Footer() {
  return (
    <footer className="mt-20 border-t border-line/60 bg-bg-inset">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid gap-8 text-sm md:grid-cols-3">
          <div>
            <p className="font-semibold text-ink-primary">PeptSight</p>
            <p className="mt-2 max-w-xs text-ink-muted">
              Real-time peptide intelligence. AI agents and live web data, transformed into educational research aggregation.
            </p>
          </div>
          <div>
            <p className="text-2xs uppercase tracking-[0.18em] text-ink-muted">Disclaimer</p>
            <p className="mt-2 max-w-md text-ink-secondary">
              PeptSight does not provide medical advice. The platform analyzes how peptides are
              discussed, researched, and marketed. It does not recommend treatments, dosages, or
              protocols. Consult a licensed clinician for any health decision.
            </p>
          </div>
          <div>
            <p className="text-2xs uppercase tracking-[0.18em] text-ink-muted">Architecture</p>
            <p className="mt-2 text-ink-secondary">
              AI agent orchestration · Apify Actors · live web data · LLM synthesis · structured intelligence reports.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2 text-2xs uppercase tracking-[0.18em]">
          <BronzeMedal />
          <span className="text-ink-secondary">Hackathon Winner</span>
          <span className="text-ink-dim">·</span>
          <span className="text-ink-muted">3rd Place · 2026 SF All Things Agents · Solo Build</span>
        </div>

        <p className="mt-3 text-2xs uppercase tracking-[0.18em] text-ink-dim">
          © {new Date().getFullYear()} PeptSight
        </p>
      </div>
    </footer>
  );
}

function BronzeMedal() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden>
      <defs>
        <linearGradient id="footer-medal-bronze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9a87c" />
          <stop offset="0.5" stopColor="#cd7f32" />
          <stop offset="1" stopColor="#8b4513" />
        </linearGradient>
      </defs>
      <path d="M8.5 3 L10.5 11" stroke="#a0522d" strokeWidth="2" strokeLinecap="round" />
      <path d="M15.5 3 L13.5 11" stroke="#a0522d" strokeWidth="2" strokeLinecap="round" />
      <circle
        cx="12"
        cy="15.5"
        r="6"
        fill="url(#footer-medal-bronze)"
        stroke="#5c2e0a"
        strokeWidth="0.7"
      />
      <circle
        cx="12"
        cy="15.5"
        r="3.6"
        fill="none"
        stroke="#5c2e0a"
        strokeWidth="0.5"
        opacity="0.7"
      />
      <circle cx="10" cy="13.5" r="1.2" fill="#fcd9b6" opacity="0.6" />
    </svg>
  );
}
