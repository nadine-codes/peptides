"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { AgentEvent } from "@/lib/types";

type Phase = "interpret" | "identify" | "scrape" | "analyze" | "synthesize" | "finalize";

const PHRASES_BY_PHASE: Record<Phase, string[]> = {
  interpret: [
    "Interpreting research category…",
    "Mapping intent to peptide ecosystem…",
    "Decoding what you're researching…",
  ],
  identify: [
    "Identifying associated peptides…",
    "Cross-referencing peptide library…",
    "Resolving compounds in this domain…",
  ],
  scrape: [
    "Spinning up Apify Actors…",
    "Reading r/Peptides discussions…",
    "Querying recent Reddit threads…",
    "Crawling research abstracts…",
    "Fetching telehealth marketing copy…",
    "Tracking vendor product listings…",
    "Searching Google for peer review…",
    "Aggregating public discussion velocity…",
    "Watching peptide forums in real time…",
  ],
  analyze: [
    "Analyzing discussion velocity…",
    "Computing sentiment trends…",
    "Detecting recurring themes…",
    "Tier-classifying source URLs…",
    "Cross-referencing claim frequency…",
  ],
  synthesize: [
    "Synthesizing intelligence report…",
    "Distilling sources into structured insights…",
    "Asking Claude to find contradictions…",
    "Comparing vendor claims to research consensus…",
    "Generating peptide briefs…",
    "Detecting conflicting claims across tiers…",
  ],
  finalize: [
    "Finalizing intelligence report…",
    "Polishing the output…",
    "Almost there…",
  ],
};

const PHASE_BASE_PROGRESS: Record<Phase, number> = {
  interpret: 5,
  identify: 12,
  scrape: 20,
  analyze: 75,
  synthesize: 88,
  finalize: 96,
};

const PHASE_LABEL: Record<Phase, string> = {
  interpret: "01 · INTERPRET",
  identify: "02 · IDENTIFY",
  scrape: "03 · SCRAPE",
  analyze: "04 · ANALYZE",
  synthesize: "05 · SYNTHESIZE",
  finalize: "06 · FINALIZE",
};

interface RefreshOverlayProps {
  open: boolean;
  events: AgentEvent[];
  done: boolean;
  onClose: () => void;
}

export function RefreshOverlay({ open, events, done, onClose }: RefreshOverlayProps) {
  const { phase, progress, peptideCount } = useMemo(() => derive(events), [events]);

  const [phraseIndex, setPhraseIndex] = useState(0);
  const phrases = PHRASES_BY_PHASE[phase] ?? PHRASES_BY_PHASE.interpret;

  // Reset phrase index when phase changes so we always start at the top of the new phase's list.
  useEffect(() => {
    setPhraseIndex(0);
  }, [phase]);

  // Rotate through the current phase's phrases.
  useEffect(() => {
    if (!open || done) return;
    const interval = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % phrases.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [open, done, phrases.length]);

  // Auto-close ~1s after done so the 100% state is visible briefly.
  useEffect(() => {
    if (!done || !open) return;
    const t = setTimeout(onClose, 900);
    return () => clearTimeout(t);
  }, [done, open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 grid place-items-center bg-bg-base/70 backdrop-blur-md"
          aria-modal="true"
          role="dialog"
          aria-label="Refreshing intelligence report"
        >
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="glass relative w-[min(92vw,540px)] rounded-2xl p-7"
          >
            {/* Live pulse */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-2xs font-mono uppercase tracking-[0.22em] text-signal-cyan">
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-cyan">
                  {!done && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-signal-cyan opacity-70" />
                  )}
                </span>
                {done ? "Refresh complete" : "Refreshing intelligence"}
              </div>
              <span className="font-mono text-2xs uppercase tracking-[0.18em] text-ink-muted">
                {Math.round(progress)}%
              </span>
            </div>

            {/* Rotating phrase */}
            <div className="mt-7 min-h-[68px] flex items-start">
              <AnimatePresence mode="wait">
                <motion.p
                  key={`${phase}-${phraseIndex}`}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="text-balance text-2xl font-semibold leading-tight tracking-tight text-ink-primary"
                >
                  {done ? "Intelligence ready." : phrases[phraseIndex]}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Progress bar */}
            <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-bg-inset/80 ring-line">
              <motion.div
                className="relative h-full bg-gradient-to-r from-signal-cyan via-signal-cyan to-signal-blue"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {!done && (
                  <span className="absolute inset-y-0 right-0 w-12 -translate-x-0 bg-gradient-to-r from-transparent to-white/50 mix-blend-overlay" />
                )}
              </motion.div>
            </div>

            {/* Phase label + meta */}
            <div className="mt-4 flex items-center justify-between font-mono text-2xs uppercase tracking-[0.18em] text-ink-muted">
              <span>{PHASE_LABEL[phase]}</span>
              <span>
                {peptideCount > 0 ? `${peptideCount} peptides` : "—"}
              </span>
            </div>

            {/* Subtle helper text */}
            <p className="mt-5 text-2xs uppercase tracking-[0.18em] text-ink-dim">
              Rerunning Apify Actors and Claude synthesis with fresh web data.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface Derived {
  phase: Phase;
  progress: number;
  peptideCount: number;
}

function derive(events: AgentEvent[]): Derived {
  let phase: Phase = "interpret";
  let peptideCount = 0;
  let toolResults = 0;
  let expectedToolResults = 0;
  let resultArrived = false;

  for (const e of events) {
    switch (e.type) {
      case "status":
        phase = e.phase as Phase;
        break;
      case "peptides_identified":
        peptideCount = e.peptides.length;
        expectedToolResults = peptideCount * 2; // reddit + search per peptide
        break;
      case "tool_result":
        toolResults += 1;
        break;
      case "result":
        resultArrived = true;
        break;
    }
  }

  let progress = PHASE_BASE_PROGRESS[phase];
  if (phase === "scrape" && expectedToolResults > 0) {
    const span = PHASE_BASE_PROGRESS.analyze - PHASE_BASE_PROGRESS.scrape; // 75-20 = 55
    progress = PHASE_BASE_PROGRESS.scrape + (toolResults / expectedToolResults) * span;
  }
  if (resultArrived) progress = 100;

  return { phase, progress: Math.min(100, Math.max(2, progress)), peptideCount };
}
