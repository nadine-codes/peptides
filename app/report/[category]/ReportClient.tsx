"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AgentActivity } from "@/components/AgentActivity";
import { PeptideCard } from "@/components/PeptideCard";
import { RefreshOverlay } from "@/components/RefreshOverlay";
import type { AgentEvent, CategorySlug, IntelReport } from "@/lib/types";

interface ReportClientProps {
  category: CategorySlug;
  categoryLabel: string;
  blurb: string;
}

export function ReportClient({ category, categoryLabel, blurb }: ReportClientProps) {
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [report, setReport] = useState<IntelReport | null>(null);
  const [done, setDone] = useState(false);
  const [mode, setMode] = useState<"live" | "demo" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshEvents, setRefreshEvents] = useState<AgentEvent[]>([]);
  const [refreshDone, setRefreshDone] = useState(false);
  const inFlightRef = useRef<AbortController | null>(null);

  const runStream = useCallback(
    async (opts: { force: boolean }) => {
      // Cancel any in-flight stream first
      if (inFlightRef.current) inFlightRef.current.abort();
      const ctrl = new AbortController();
      inFlightRef.current = ctrl;

      const isRefresh = opts.force;
      let cancelled = false;

      if (isRefresh) {
        setRefreshing(true);
        setRefreshEvents([]);
        setRefreshDone(false);
      } else {
        setEvents([]);
        setDone(false);
      }

      try {
        const url = isRefresh ? "/api/intelligence?refresh=true" : "/api/intelligence";
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ category }),
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) throw new Error(`stream failed: ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (!cancelled) {
          const { value, done: streamDone } = await reader.read();
          if (streamDone) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";
          for (const part of parts) {
            const line = part.trim();
            if (!line.startsWith("data:")) continue;
            const json = line.slice(5).trim();
            if (!json) continue;
            try {
              const evt = JSON.parse(json) as AgentEvent;
              if (cancelled) return;
              if (isRefresh) {
                setRefreshEvents((prev) => [...prev, evt]);
              } else {
                setEvents((prev) => [...prev, evt]);
              }
              if (evt.type === "mode") setMode(evt.mode);
              if (evt.type === "result") {
                setReport(evt.data);
                try {
                  sessionStorage.setItem(
                    `peptsight:report:${category}`,
                    JSON.stringify(evt.data),
                  );
                } catch {}
              }
              if (evt.type === "done") {
                if (isRefresh) setRefreshDone(true);
                else setDone(true);
              }
            } catch {
              // skip malformed line
            }
          }
        }
        if (!cancelled) {
          if (isRefresh) setRefreshDone(true);
          else setDone(true);
        }
      } catch (e) {
        if (cancelled) return;
        if ((e as Error).name === "AbortError") return;
        setError((e as Error).message);
        if (isRefresh) setRefreshDone(true);
        else setDone(true);
      } finally {
        if (inFlightRef.current === ctrl) inFlightRef.current = null;
      }

      return () => {
        cancelled = true;
      };
    },
    [category],
  );

  useEffect(() => {
    const ctrl = new AbortController();
    let cancelled = false;
    (async () => {
      if (cancelled) return;
      await runStream({ force: false });
    })();
    return () => {
      cancelled = true;
      ctrl.abort();
      if (inFlightRef.current) inFlightRef.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleRefresh = useCallback(() => {
    if (refreshing) return;
    runStream({ force: true });
  }, [refreshing, runStream]);

  const handleCloseOverlay = useCallback(() => {
    setRefreshing(false);
  }, []);

  const generatedLabel = report ? timeAgo(report.generated_at) : null;

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <RefreshOverlay
        open={refreshing}
        events={refreshEvents}
        done={refreshDone}
        onClose={handleCloseOverlay}
      />

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
              disabled={refreshing || !report}
              generatedLabel={generatedLabel}
            />
            <div className="text-right text-2xs font-mono uppercase tracking-[0.18em] text-ink-muted">
              {events.length} agent events
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr,360px]">
        <div className="order-2 lg:order-1">
          {!report && !error && (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} index={i} />
              ))}
            </div>
          )}
          {error && (
            <div className="rounded-xl border border-signal-red/40 bg-signal-red/5 p-4 text-sm text-signal-red">
              Stream failed: {error}
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

        <div className="order-1 lg:order-2 lg:sticky lg:top-20 lg:self-start">
          <AgentActivity events={events} done={done} mode={mode} />
        </div>
      </div>
    </div>
  );
}

function RefreshButton({
  onClick,
  disabled,
  generatedLabel,
}: {
  onClick: () => void;
  disabled: boolean;
  generatedLabel: string | null;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group inline-flex items-center gap-2 rounded-lg border border-line-strong bg-bg-surface px-3.5 py-2 text-sm text-ink-primary transition hover:border-signal-cyan/60 hover:text-signal-cyan disabled:cursor-not-allowed disabled:opacity-50"
    >
      <RefreshIcon />
      <span className="font-medium">Refresh data</span>
      {generatedLabel ? (
        <span className="font-mono text-2xs uppercase tracking-[0.16em] text-ink-muted group-hover:text-signal-cyan/70">
          · updated {generatedLabel}
        </span>
      ) : null}
    </button>
  );
}

function RefreshIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
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
