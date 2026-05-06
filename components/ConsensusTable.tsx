import type { ClaimConsensus } from "@/lib/types";
import { MetricBadge } from "./MetricBadge";

export function ConsensusTable({ rows }: { rows: ClaimConsensus[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-line/70">
      <table className="w-full text-sm">
        <thead className="bg-bg-inset/60">
          <tr className="text-left">
            <th className="px-4 py-2 font-mono text-2xs uppercase tracking-[0.18em] text-ink-muted">
              Claim
            </th>
            <th className="px-4 py-2 font-mono text-2xs uppercase tracking-[0.18em] text-ink-muted">
              Consensus
            </th>
            <th className="px-4 py-2 font-mono text-2xs uppercase tracking-[0.18em] text-ink-muted">
              Note
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-line/60">
              <td className="px-4 py-3 align-top text-ink-primary">{r.claim}</td>
              <td className="px-4 py-3 align-top">
                <MetricBadge kind="consensus" value={r.consensus} />
              </td>
              <td className="px-4 py-3 align-top text-ink-muted">{r.note || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
