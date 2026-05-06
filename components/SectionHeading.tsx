interface SectionHeadingProps {
  index: number;
  title: string;
  subtitle?: string;
}

export function SectionHeading({ index, title, subtitle }: SectionHeadingProps) {
  return (
    <div className="mb-5 flex items-baseline gap-3 border-b border-line/70 pb-3">
      <span className="font-mono text-2xs uppercase tracking-[0.2em] text-ink-muted">
        {String(index).padStart(2, "0")}
      </span>
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-ink-primary">{title}</h2>
        {subtitle ? <p className="text-sm text-ink-muted">{subtitle}</p> : null}
      </div>
    </div>
  );
}
