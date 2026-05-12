"use client";

import { motion } from "framer-motion";
import { CategoryGrid } from "./CategoryGrid";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 grid-bg opacity-90" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-radial-spot" />

      <div className="mx-auto max-w-7xl px-6 pt-16 pb-14 md:pt-20">
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
          className="mt-12"
        >
          <div className="flex items-center gap-3">
            <span className="block h-5 w-[3px] rounded-sm bg-signal-cyan" />
            <p className="font-mono text-sm uppercase tracking-[0.22em] text-ink-primary md:text-base">
              Select a research category below to launch the agent…
            </p>
          </div>

          <div className="mt-6">
            <CategoryGrid />
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.42 }}
          className="mt-12 max-w-3xl text-balance text-sm text-ink-muted"
        >
          PeptSight uses AI agents and live web data to transform fragmented peptide information
          into structured intelligence reports. The platform aggregates public discussion, research
          themes, market signals, and conflicting claims for educational purposes only.
        </motion.p>
      </div>
    </section>
  );
}
