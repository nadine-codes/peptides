import type { SourceLink, SourceTier } from "@/lib/types";

const TIER_STYLES: Record<SourceTier, string> = {
  research: "text-signal-cyan border-signal-cyan/40 bg-signal-cyan/5",
  educational: "text-signal-blue border-signal-blue/40 bg-signal-blue/5",
  anecdotal: "text-ink-secondary border-line-strong bg-bg-elevated",
  vendor: "text-signal-amber border-signal-amber/40 bg-signal-amber/5",
  telehealth: "text-signal-violet border-signal-violet/40 bg-signal-violet/5",
};

export function SourceList({ sources }: { sources: SourceLink[] }) {
  if (!sources?.length) {
    return <p className="text-sm text-ink-muted">No sources captured for this run.</p>;
  }
  return (
    <ul className="space-y-2">
      {sources.map((s, i) => (
        <li
          key={i}
          className="flex items-start gap-3 rounded-lg border border-line/60 bg-bg-inset/40 px-3 py-2.5"
        >
          <span
            className={`mt-0.5 inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.16em] ${TIER_STYLES[s.tier] || TIER_STYLES.educational}`}
          >
            {s.tier}
          </span>
          <div className="min-w-0 flex-1">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block truncate text-sm text-ink-primary hover:text-signal-cyan"
            >
              {s.title}
            </a>
            {s.snippet ? <p className="mt-0.5 line-clamp-2 text-xs text-ink-muted">{s.snippet}</p> : null}
            <p className="mt-0.5 truncate text-2xs font-mono text-ink-dim">{s.url}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
