import type { MarketSnapshot } from "@/lib/types";

export function MarketSnapshotBlock({ m }: { m: MarketSnapshot }) {
  const rows: Array<[string, string]> = [
    ["Price range mentioned", m.price_range],
    ["Availability", m.availability],
    ["Market activity", m.market_activity],
    ["Vendor frequency", m.vendor_frequency],
    ["Telehealth visibility", m.telehealth_visibility],
  ];
  return (
    <dl className="overflow-hidden rounded-xl border border-line/70 bg-bg-inset/40">
      {rows.map(([k, v], i) => (
        <div
          key={k}
          className={`flex items-baseline justify-between gap-6 px-4 py-3 ${
            i > 0 ? "border-t border-line/60" : ""
          }`}
        >
          <dt className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-muted">{k}</dt>
          <dd className="text-right text-sm text-ink-primary">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
