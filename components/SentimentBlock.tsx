import type { PublicSentiment } from "@/lib/types";

export function SentimentBlock({ s }: { s: PublicSentiment }) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-line/70 bg-bg-inset/40 p-4">
        <p className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-muted">
          Anecdotal public discussion
        </p>
        <p className="mt-2 text-sm text-ink-secondary">{s.summary}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <Column title="Common observations" tone="green" items={s.pros} />
        <Column title="Concerns raised" tone="amber" items={s.concerns} />
        <Column title="Recurring questions" tone="blue" items={s.common_questions} />
      </div>
      <p className="text-2xs uppercase tracking-[0.18em] text-ink-muted">
        Source tier: anecdotal · not a clinical finding
      </p>
    </div>
  );
}

function Column({
  title,
  tone,
  items,
}: {
  title: string;
  tone: "green" | "amber" | "blue";
  items: string[];
}) {
  const accent = {
    green: "text-signal-green",
    amber: "text-signal-amber",
    blue: "text-signal-blue",
  }[tone];
  return (
    <div className="rounded-lg border border-line/60 bg-bg-surface p-4">
      <p className={`text-2xs font-mono uppercase tracking-[0.18em] ${accent}`}>{title}</p>
      <ul className="mt-2 space-y-1.5 text-sm text-ink-secondary">
        {items.map((i, k) => (
          <li key={k} className="flex gap-2">
            <span className="mt-1 inline-block h-1 w-1 shrink-0 rounded-full bg-ink-muted" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
