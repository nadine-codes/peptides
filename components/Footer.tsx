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
        <p className="mt-8 text-2xs uppercase tracking-[0.18em] text-ink-dim">
          © {new Date().getFullYear()} PeptSight · 3rd place at the 2026 San Francisco All Things Agents Hackathon · Built solo
        </p>
      </div>
    </footer>
  );
}
