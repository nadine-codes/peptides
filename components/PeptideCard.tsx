"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { CategorySlug, PeptideReport } from "@/lib/types";
import { peptideSlug } from "@/lib/peptides";
import { MetricBadge } from "./MetricBadge";
import { Sparkline } from "./Sparkline";

interface PeptideCardProps {
  category: CategorySlug;
  peptide: PeptideReport;
  index: number;
}

export function PeptideCard({ category, peptide, index }: PeptideCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: "easeOut" }}
      className="group relative rounded-xl border border-line bg-bg-surface ring-line transition-colors hover:border-line-strong"
    >
      {peptide.trending && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-signal-cyan/40 bg-signal-cyan/10 px-2 py-0.5 text-2xs font-mono uppercase tracking-[0.18em] text-signal-cyan">
          <span className="h-1.5 w-1.5 rounded-full bg-signal-cyan" />
          Trending
        </span>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-2xs font-mono uppercase tracking-[0.2em] text-ink-muted">
              Compound · {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-1 text-xl font-semibold tracking-tight text-ink-primary">
              {peptide.name}
            </h3>
            {peptide.aka && peptide.aka.length > 0 ? (
              <p className="mt-0.5 text-xs text-ink-muted">also: {peptide.aka.join(", ")}</p>
            ) : null}
          </div>
        </div>

        <p className="mt-3 line-clamp-3 text-sm text-ink-secondary">{peptide.overview}</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Stat label="Signal" value={peptide.signal_strength} kind="signal" />
          <Stat label="Consensus" value={peptide.consensus_score} kind="consensus" />
          <Stat label="Sentiment" value={peptide.sentiment} kind="sentiment" />
          <Stat label="Research" value={peptide.research_activity} kind="research" />
        </div>

        <div className="mt-4 rounded-lg border border-line/70 bg-bg-inset/60 p-3">
          <div className="flex items-baseline justify-between">
            <span className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-muted">
              Discussion velocity
            </span>
            <span
              className={`font-mono text-sm font-semibold ${
                peptide.velocity_pct >= 100 ? "text-signal-cyan" : "text-ink-primary"
              }`}
            >
              {peptide.discussion_velocity}
            </span>
          </div>
          <Sparkline velocityPct={peptide.velocity_pct} className="mt-2 h-7 w-full" />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line/70 pt-4">
          <MetricBadge kind="risk" label="Risk" value={peptide.risk_level} />
          <Link
            href={`/peptide/${category}/${peptideSlug(peptide.name)}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-signal-cyan transition hover:text-ink-primary"
          >
            View Intelligence
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function Stat({
  label,
  value,
  kind,
}: {
  label: string;
  value: string;
  kind: "signal" | "consensus" | "sentiment" | "research";
}) {
  return (
    <div className="rounded-lg border border-line/70 bg-bg-inset/40 px-3 py-2">
      <div className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-muted">{label}</div>
      <div className="mt-1">
        <MetricBadge kind={kind} value={value} />
      </div>
    </div>
  );
}
