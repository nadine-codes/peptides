"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { EtlRun } from "@/lib/useEtlRun";

type Phase = "interpret" | "identify" | "scrape" | "analyze" | "synthesize" | "finalize";

const PHASE_LABEL: Record<Phase, string> = {
  interpret: "Interpreting",
  identify: "Identifying peptides",
  scrape: "Scraping sources",
  analyze: "Analyzing signals",
  synthesize: "Synthesizing report",
  finalize: "Finalizing",
};

interface Props {
  run: EtlRun | null;
}

export function RefreshNotification({ run }: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [latestSeenId, setLatestSeenId] = useState<string | null>(null);

  // Reset dismissal when a new run begins.
  useEffect(() => {
    if (!run) return;
    if (run.id !== latestSeenId) {
      setLatestSeenId(run.id);
      if (run.status === "running") setDismissed(false);
    }
  }, [run, latestSeenId]);

  // Linger longer on success so the green-lit state is readable, then fade.
  // Errors stay shorter — failure is something to act on, not celebrate.
  const linger = run?.status === "success" ? 10_000 : 4_000;

  useEffect(() => {
    if (!run) return;
    if (run.status === "running") return;
    const t = setTimeout(() => setDismissed(true), linger);
    return () => clearTimeout(t);
  }, [run?.status, run?.id, linger]);

  const visible = useMemo(() => {
    if (!run) return false;
    if (dismissed) return false;
    if (run.status === "running") return true;
    return Boolean(run.finished_at) && Date.now() - new Date(run.finished_at as string).getTime() < linger + 1000;
  }, [run, dismissed, linger]);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 flex max-w-[360px] flex-col items-end gap-2 sm:right-6 sm:top-6">
      <AnimatePresence>
        {visible && run && (
          <motion.div
            key={run.id}
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{
              duration: run.status === "success" ? 1.2 : 0.28,
              ease: "easeOut",
            }}
            className="glass pointer-events-auto w-[340px] rounded-xl border border-line/70 bg-bg-surface/95 p-4 shadow-2xl backdrop-blur"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-2xs font-mono uppercase tracking-[0.22em]">
                <StatusDot status={run.status} />
                <span className={statusTextClass(run.status)}>{statusLabel(run)}</span>
              </div>
              <button
                type="button"
                onClick={() => setDismissed(true)}
                className="text-ink-muted hover:text-ink-primary transition"
                aria-label="Dismiss notification"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mt-3 flex items-baseline justify-between gap-3">
              <p className="truncate text-sm text-ink-primary">
                {currentLine(run)}
              </p>
              <span className="font-mono text-2xs uppercase tracking-[0.16em] text-ink-muted">
                {Math.round(run.percent)}%
              </span>
            </div>

            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-bg-inset/80">
              <motion.div
                className={`h-full ${barColorClass(run.status)}`}
                initial={false}
                animate={{ width: `${run.percent}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>

            <div className="mt-2.5 flex items-center justify-between font-mono text-2xs uppercase tracking-[0.16em] text-ink-muted">
              <span>{run.trigger === "cron" ? "scheduled run" : "manual refresh"}</span>
              <span>{run.mode ? run.mode : ""}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function currentLine(run: EtlRun): string {
  if (run.status === "error") return run.error || "Refresh failed";
  if (run.status === "success") return "Intelligence updated.";
  // Pull latest status message from events if available; otherwise phase label.
  const reversed = [...run.events].reverse();
  const lastStatus = reversed.find((e) => e.type === "status");
  if (lastStatus && lastStatus.type === "status") return lastStatus.message;
  const phase = (run.phase as Phase) || "interpret";
  return PHASE_LABEL[phase] + "…";
}

function statusLabel(run: EtlRun): string {
  if (run.status === "running") return "Refreshing";
  if (run.status === "success") return "Done";
  return "Refresh failed";
}

function statusTextClass(status: EtlRun["status"]): string {
  if (status === "running") return "text-signal-cyan";
  if (status === "success") return "text-signal-green";
  return "text-signal-red";
}

function barColorClass(status: EtlRun["status"]): string {
  if (status === "error") return "bg-signal-red";
  if (status === "success") return "bg-signal-green";
  return "bg-gradient-to-r from-signal-cyan via-signal-cyan to-signal-blue";
}

function StatusDot({ status }: { status: EtlRun["status"] }) {
  const base = "relative inline-flex h-1.5 w-1.5 rounded-full";
  if (status === "running") {
    return (
      <span className={`${base} bg-signal-cyan`}>
        <span className="absolute inset-0 animate-ping rounded-full bg-signal-cyan opacity-70" />
      </span>
    );
  }
  if (status === "success") return <span className={`${base} bg-signal-green`} />;
  return <span className={`${base} bg-signal-red`} />;
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 3l10 10M13 3L3 13" strokeLinecap="round" />
    </svg>
  );
}
