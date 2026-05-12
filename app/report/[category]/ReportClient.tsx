"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { AgentActivity } from "@/components/AgentActivity";
import { PeptideCard } from "@/components/PeptideCard";
import { RefreshNotification } from "@/components/RefreshNotification";
import { useLatestEtlRun } from "@/lib/useEtlRun";
import type { CategorySlug, IntelReport } from "@/lib/types";

interface ReportClientProps {
  category: CategorySlug;
  categoryLabel: string;
  blurb: string;
}

export function ReportClient({ category, categoryLabel, blurb }: ReportClientProps) {
  const [report, setReport] = useState<IntelReport | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  const { run } = useLatestEtlRun(category);

  const fetchReport = useCallback(async () => {
    try {
      const res = await fetch(`/api/report?category=${encodeURIComponent(category)}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const data = await res.json();
      setReport(data.report as IntelReport);
      setLoadError(null);
    } catch (err) {
      setLoadError((err as Error).message);
    }
  }, [category]);

  // Initial load.
  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // When a run finishes successfully, re-fetch the freshly-written report.
  useEffect(() => {
    if (!run) return;
    if (run.status === "success") {
      fetchReport();
      setRefreshing(false);
    } else if (run.status === "error") {
      setRefreshing(false);
    }
  }, [run?.status, run?.id, fetchReport]);

  const handleRefresh = useCallback(async () => {
    if (refreshing || (run && run.status === "running")) return;
    setRefreshing(true);
    setRefreshError(null);
    try {
      const res = await fetch(`/api/refresh?category=${encodeURIComponent(category)}&trigger=manual`, {
        method: "POST",
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `status ${res.status}`);
      }
    } catch (err) {
      setRefreshError((err as Error).message);
      setRefreshing(false);
    }
  }, [category, refreshing, run]);

  const events = useMemo(() => (run ? run.events : []), [run]);
  const done = run ? run.status !== "running" : true;
  const mode: "live" | "demo" | null = run?.mode ?? report?.mode ?? null;
  const generatedLabel = report ? timeAgo(report.generated_at) : null;
  const isRunning = run?.status === "running";

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <RefreshNotification run={run} />

      <header className="mb-8">
        <Link
          href="/"
          className="text-2xs font-mono uppercase tracking-[0.2em] text-ink-muted hover:text-ink-primary"
        >
          ← New search
        </Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-2xs font-mono uppercase tracking-[0.2em] text-ink-muted">
              Research category
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">
              Trending Peptides for{" "}
              <span className="text-signal-cyan">{categoryLabel}</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-ink-secondary">{blurb}</p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <RefreshButton
              onClick={handleRefresh}
              disabled={refreshing || isRunning || !report}
              isRunning={isRunning}
              generatedLabel={generatedLabel}
            />
            <div className="text-right text-2xs font-mono uppercase tracking-[0.18em] text-ink-muted">
              {events.length} agent events
            </div>
            {refreshError && (
              <div className="text-2xs font-mono uppercase tracking-[0.18em] text-signal-red">
                {refreshError}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
        <div className="min-w-0">
          {!report && !loadError && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} index={i} />
              ))}
            </div>
          )}
          {loadError && (
            <div className="rounded-xl border border-signal-red/40 bg-signal-red/5 p-4 text-sm text-signal-red">
              Failed to load report: {loadError}
            </div>
          )}
          {report && (
            <motion.div
              key={report.generated_at}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
            >
              {report.peptides.map((p, i) => (
                <PeptideCard key={p.name} category={category} peptide={p} index={i} />
              ))}
            </motion.div>
          )}
        </div>

        <div className="min-w-0 lg:sticky lg:top-20 lg:self-start">
          <AgentActivity events={events} done={done} mode={mode} />
        </div>
      </div>
    </div>
  );
}

function RefreshButton({
  onClick,
  disabled,
  isRunning,
  generatedLabel,
}: {
  onClick: () => void;
  disabled: boolean;
  isRunning: boolean;
  generatedLabel: string | null;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group inline-flex items-center gap-2 rounded-lg border border-line-strong bg-bg-surface px-3.5 py-2 text-sm text-ink-primary transition hover:border-signal-cyan/60 hover:text-signal-cyan disabled:cursor-not-allowed disabled:opacity-50"
    >
      <RefreshIcon spinning={isRunning} />
      <span className="font-medium">{isRunning ? "Refreshing…" : "Refresh data"}</span>
      {generatedLabel && !isRunning ? (
        <span className="font-mono text-2xs uppercase tracking-[0.16em] text-ink-muted group-hover:text-signal-cyan/70">
          · updated {generatedLabel}
        </span>
      ) : null}
    </button>
  );
}

function RefreshIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 ${spinning ? "animate-spin" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 3v5h-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 21v-5h5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SkeletonCard({ index }: { index: number }) {
  return (
    <div
      className="h-[260px] animate-pulse rounded-xl border border-line bg-bg-surface ring-line"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="p-5">
        <div className="h-3 w-24 rounded bg-bg-elevated" />
        <div className="mt-3 h-6 w-40 rounded bg-bg-elevated" />
        <div className="mt-3 h-3 w-full rounded bg-bg-elevated" />
        <div className="mt-2 h-3 w-3/4 rounded bg-bg-elevated" />
        <div className="mt-5 grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, k) => (
            <div key={k} className="h-10 rounded-lg bg-bg-elevated" />
          ))}
        </div>
      </div>
    </div>
  );
}

function timeAgo(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return d.toLocaleString();
}
