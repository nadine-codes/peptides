export function DisclaimerBanner() {
  return (
    <div className="hidden border-b border-line/60 bg-bg-inset md:block">
      <div className="mx-auto max-w-7xl px-6 py-1.5">
        <p className="text-2xs uppercase tracking-[0.18em] text-ink-muted">
          <span className="text-ink-secondary">Educational research aggregation</span>
          <span className="mx-2 text-ink-dim">·</span>
          Not medical advice, dosing guidance, or treatment recommendation
        </p>
      </div>
    </div>
  );
}
