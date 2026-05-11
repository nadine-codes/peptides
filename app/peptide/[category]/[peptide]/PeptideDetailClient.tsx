"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { CategorySlug, PeptideReport } from "@/lib/types";
import { MetricBadge } from "@/components/MetricBadge";
import { Sparkline } from "@/components/Sparkline";
import { SectionHeading } from "@/components/SectionHeading";
import { ConsensusTable } from "@/components/ConsensusTable";
import { ConflictList } from "@/components/ConflictList";
import { RiskFlagList } from "@/components/RiskFlagList";
import { SourceList } from "@/components/SourceList";
import { SentimentBlock } from "@/components/SentimentBlock";
import { MarketSnapshotBlock } from "@/components/MarketSnapshot";

interface Props {
  category: CategorySlug;
  categoryLabel: string;
  peptideSlug: string;
}

export function PeptideDetailClient({ category, categoryLabel, peptideSlug: targetSlug }: Props) {
  const [peptide, setPeptide] = useState<PeptideReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/peptide?category=${encodeURIComponent(category)}&peptide=${encodeURIComponent(targetSlug)}`,
          { cache: "no-store" },
        );
        if (!res.ok) throw new Error(`status ${res.status}`);
        const data = await res.json();
        if (!cancelled) setPeptide(data.peptide);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [category, targetSlug]);

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-signal-red">Could not load report: {error}</p>
        <Link href={`/report/${category}`} className="mt-4 inline-block text-signal-cyan">
          ← Back to {categoryLabel}
        </Link>
      </div>
    );
  }

  if (!peptide) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="h-6 w-40 animate-pulse rounded bg-bg-elevated" />
        <div className="mt-3 h-10 w-72 animate-pulse rounded bg-bg-elevated" />
        <div className="mt-6 h-32 animate-pulse rounded bg-bg-elevated" />
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href={`/report/${category}`}
        className="text-2xs font-mono uppercase tracking-[0.2em] text-ink-muted hover:text-ink-primary"
      >
        ← {categoryLabel}
      </Link>

      <motion.header
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="mt-3 border-b border-line/70 pb-6"
      >
        <div className="flex items-center gap-2">
          <p className="font-mono text-2xs uppercase tracking-[0.2em] text-ink-muted">
            Intelligence Report
          </p>
          {peptide.trending && (
            <span className="inline-flex items-center gap-1 rounded-full border border-signal-cyan/40 bg-signal-cyan/10 px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.18em] text-signal-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-signal-cyan" /> Trending
            </span>
          )}
        </div>
        <h1 className="mt-2 text-balance text-4xl font-semibold tracking-tight md:text-5xl">
          {peptide.name} <span className="text-ink-muted">·</span>{" "}
          <span className="text-signal-cyan">{categoryLabel}</span>
        </h1>
        {peptide.aka && peptide.aka.length > 0 ? (
          <p className="mt-2 text-sm text-ink-muted">also: {peptide.aka.join(", ")}</p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-2">
          <MetricBadge kind="signal" label="Signal" value={peptide.signal_strength} />
          <MetricBadge kind="consensus" label="Consensus" value={peptide.consensus_score} />
          <MetricBadge kind="sentiment" label="Sentiment" value={peptide.sentiment} />
          <MetricBadge kind="research" label="Research" value={peptide.research_activity} />
          <MetricBadge kind="risk" label="Risk" value={peptide.risk_level} />
        </div>

        <div className="mt-6 rounded-xl border border-line/70 bg-bg-inset/60 p-4">
          <div className="flex items-baseline justify-between">
            <p className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-muted">
              Discussion velocity (24-week)
            </p>
            <p
              className={`font-mono text-2xl font-semibold ${
                peptide.velocity_pct >= 100 ? "text-signal-cyan" : "text-ink-primary"
              }`}
            >
              {peptide.discussion_velocity}
            </p>
          </div>
          <Sparkline velocityPct={peptide.velocity_pct} className="mt-3 h-12 w-full" />
        </div>
      </motion.header>

      <Section index={1} title="Overview" subtitle="Educational summary — not medical advice">
        <p className="text-base leading-relaxed text-ink-secondary">{peptide.overview}</p>
        <div className="mt-4 rounded-lg border border-line/60 bg-bg-inset/40 p-3 text-sm text-ink-muted">
          PeptSight describes how this compound is <span className="text-ink-secondary">discussed and researched</span>. It does not provide dosing, protocols, or treatment recommendations. Consult a licensed clinician for any health decision.
        </div>
      </Section>

      <Section index={2} title="Signal Summary" subtitle="Why this compound surfaced now">
        <ul className="space-y-2 text-sm text-ink-secondary">
          <li>• Signal strength is <strong className="text-ink-primary">{peptide.signal_strength}</strong> across observed sources.</li>
          <li>• Discussion velocity over the recent window: <strong className="text-ink-primary">{peptide.discussion_velocity}</strong>.</li>
          <li>• Research activity trending <strong className="text-ink-primary">{peptide.research_activity.toLowerCase()}</strong>.</li>
          <li>• Public sentiment is <strong className="text-ink-primary">{peptide.sentiment.toLowerCase()}</strong>; consensus is <strong className="text-ink-primary">{peptide.consensus_score.toLowerCase()}</strong>.</li>
        </ul>
      </Section>

      <Section index={3} title="Research Themes" subtitle="Recurring themes across research and educational sources">
        <ul className="space-y-2 text-sm text-ink-secondary">
          {peptide.research_themes.map((t, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1 inline-block h-1 w-1 shrink-0 rounded-full bg-signal-cyan" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section index={4} title="Public Sentiment" subtitle="Anecdotal — derived from public discussion">
        <SentimentBlock s={peptide.public_sentiment} />
      </Section>

      <Section index={5} title="Market Snapshot" subtitle="Pricing and availability mentioned across vendor / telehealth pages">
        <MarketSnapshotBlock m={peptide.market_snapshot} />
      </Section>

      <Section index={6} title="Claim Consensus Engine" subtitle="Agreement across research, discussion, and marketing tiers">
        <ConsensusTable rows={peptide.claim_consensus} />
      </Section>

      <Section index={7} title="Conflicting Claims Detected" subtitle="Where vendor / telehealth framing diverges from research">
        <ConflictList conflicts={peptide.conflicting_claims} />
      </Section>

      <Section index={8} title="Risk Flags" subtitle="Open questions, regulatory uncertainty, and source-quality concerns">
        <RiskFlagList flags={peptide.risk_flags} />
      </Section>

      <Section index={9} title="Source Transparency" subtitle="Every source the agent referenced">
        <SourceList sources={peptide.sources} />
      </Section>

      <div className="mt-12 rounded-xl border border-line/70 bg-bg-inset/60 p-5 text-sm text-ink-muted">
        <p className="text-2xs font-mono uppercase tracking-[0.18em] text-ink-muted">
          Educational disclaimer
        </p>
        <p className="mt-2 text-ink-secondary">
          PeptSight aggregates and structures public information about peptides for educational
          research purposes. This report is not medical advice and does not recommend any peptide,
          dosage, protocol, or treatment. Consult a licensed clinician before making any health
          decision.
        </p>
      </div>
    </article>
  );
}

function Section({
  index,
  title,
  subtitle,
  children,
}: {
  index: number;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <SectionHeading index={index} title={title} subtitle={subtitle} />
      {children}
    </section>
  );
}
