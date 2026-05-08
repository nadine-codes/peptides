"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { CategoryChips } from "./CategoryChips";
import type { CategorySlug } from "@/lib/types";

export function Hero() {
  const [selected, setSelected] = useState<CategorySlug | null>(null);
  const router = useRouter();

  function handleGenerate() {
    if (!selected) return;
    router.push(`/report/${selected}`);
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-bg opacity-90" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-radial-spot" />

      <div className="mx-auto max-w-7xl px-6 pt-20 pb-14 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex items-center gap-2 text-2xs uppercase tracking-[0.22em] text-ink-muted"
        >
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal-cyan live-dot" />
          <span>AI Agent · Apify Actors · Live Web Data</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.06, ease: "easeOut" }}
          className="mt-5 text-balance text-5xl font-semibold leading-[1.04] tracking-tight md:text-6xl"
        >
          Real-time peptide
          <br />
          <span className="bg-gradient-to-r from-signal-cyan via-ink-primary to-signal-blue bg-clip-text text-transparent">
            intelligence.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.14, ease: "easeOut" }}
          className="mt-5 max-w-2xl text-balance text-lg text-ink-secondary"
        >
          Track research trends, public sentiment, market signals, and claim consistency across the
          peptide ecosystem.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: "easeOut" }}
          className="mt-10"
        >
          <label className="block">
            <span className="text-2xs uppercase tracking-[0.2em] text-ink-muted">
              What are you researching?
            </span>
            <div className="mt-3 flex items-center gap-3 rounded-2xl border border-line-strong bg-bg-surface px-4 py-3 ring-line-strong shadow-[0_0_0_1px_rgba(34,211,238,0.06)]">
              <SearchIcon />
              <input
                disabled
                placeholder="Select a research category below to launch the agent…"
                className="w-full bg-transparent text-base text-ink-primary placeholder:text-ink-muted focus:outline-none"
                value={
                  selected
                    ? `Research category: ${selected.replace(/-/g, " ")}`
                    : ""
                }
                readOnly
              />
              <button
                type="button"
                disabled={!selected}
                onClick={handleGenerate}
                className="shrink-0 rounded-lg bg-signal-cyan px-4 py-2 text-sm font-medium text-bg-base transition disabled:cursor-not-allowed disabled:bg-line-strong disabled:text-ink-muted"
              >
                Generate Intelligence Report →
              </button>
            </div>
          </label>

          <div className="mt-6">
            <CategoryChips selected={selected} onSelect={setSelected} />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.42 }}
          className="mt-10 max-w-3xl text-balance text-sm text-ink-muted"
        >
          PeptSight uses AI agents and live web data to transform fragmented peptide information
          into structured intelligence reports. The platform aggregates public discussion, research
          themes, market signals, and conflicting claims for educational purposes only.
        </motion.p>
      </div>
    </section>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-ink-muted" fill="none">
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.6" />
      <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
