import type { RiskFlag } from "@/lib/types";

const SEVERITY_STYLES: Record<RiskFlag["severity"], string> = {
  info: "border-signal-blue/40 bg-signal-blue/5 text-signal-blue",
  watch: "border-signal-amber/40 bg-signal-amber/5 text-signal-amber",
  concern: "border-signal-red/40 bg-signal-red/5 text-signal-red",
};

export function RiskFlagList({ flags }: { flags: RiskFlag[] }) {
  return (
    <ul className="space-y-2">
      {flags.map((f, i) => (
        <li key={i} className="flex items-start gap-3 rounded-lg border border-line/60 bg-bg-inset/40 px-3 py-2.5">
          <span
            className={`mt-0.5 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.16em] ${SEVERITY_STYLES[f.severity]}`}
          >
            {f.severity}
          </span>
          <div>
            <p className="text-sm font-medium text-ink-primary">{f.label}</p>
            <p className="mt-0.5 text-sm text-ink-secondary">{f.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
