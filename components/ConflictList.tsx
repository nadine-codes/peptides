import type { ConflictingClaim } from "@/lib/types";

export function ConflictList({ conflicts }: { conflicts: ConflictingClaim[] }) {
  if (!conflicts?.length) {
    return <p className="text-sm text-ink-muted">No major conflicts detected across sources for this run.</p>;
  }
  return (
    <ul className="space-y-3">
      {conflicts.map((c, i) => (
        <li key={i} className="rounded-xl border border-line/70 bg-bg-inset/40 p-4">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-signal-amber/40 bg-signal-amber/5 px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.16em] text-signal-amber">
              Conflict
            </span>
            <p className="font-medium text-ink-primary">{c.topic}</p>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-line/60 bg-bg-surface px-3 py-2.5">
              <p className="text-2xs font-mono uppercase tracking-[0.18em] text-signal-cyan">Research</p>
              <p className="mt-1 text-sm text-ink-secondary">{c.research}</p>
            </div>
            <div className="rounded-lg border border-line/60 bg-bg-surface px-3 py-2.5">
              <p className="text-2xs font-mono uppercase tracking-[0.18em] text-signal-amber">
                Vendor / Telehealth
              </p>
              <p className="mt-1 text-sm text-ink-secondary">{c.marketing}</p>
            </div>
          </div>
          {c.note ? <p className="mt-3 text-xs text-ink-muted">{c.note}</p> : null}
        </li>
      ))}
    </ul>
  );
}
