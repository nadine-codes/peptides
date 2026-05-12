"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/peptides";

// Cycle the cyan glow through cards every ~2.2s. Pauses while a user is
// hovering or focused on any card so their interaction wins.
const AUTO_HIGHLIGHT_MS = 2200;

export function CategoryGrid() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      setActiveIndex((i) => (i + 1) % CATEGORIES.length);
    }, AUTO_HIGHLIGHT_MS);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
      {CATEGORIES.map((cat, i) => {
        const isAuto = !paused && activeIndex === i;
        return (
          <motion.div
            key={cat.slug}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.04 + i * 0.04, duration: 0.4, ease: "easeOut" }}
          >
            <Link
              href={`/report/${cat.slug}`}
              aria-label={`Open ${cat.label} research report`}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
              onFocus={() => setPaused(true)}
              onBlur={() => setPaused(false)}
              className={`group relative flex aspect-square w-full flex-col justify-between rounded-xl border bg-bg-surface p-4 transition duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal-cyan/70 ${
                isAuto
                  ? "border-signal-cyan/60 bg-bg-elevated/50 shadow-[0_0_0_1px_rgba(34,211,238,0.18),0_18px_44px_-22px_rgba(34,211,238,0.45)]"
                  : "border-line-strong/80 hover:border-signal-cyan/60 hover:bg-bg-elevated/40 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.18),0_18px_44px_-22px_rgba(34,211,238,0.45)]"
              }`}
            >
              {/* Top row: index + live agent dot */}
              <div className="flex items-start justify-between">
                <span
                  className={`font-mono text-2xs uppercase tracking-[0.2em] transition duration-300 group-hover:text-signal-cyan ${
                    isAuto ? "text-signal-cyan" : "text-ink-muted"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="relative inline-flex h-1.5 w-1.5">
                  <span
                    className={`relative inline-flex h-1.5 w-1.5 rounded-full transition duration-300 group-hover:bg-signal-cyan ${
                      isAuto ? "bg-signal-cyan" : "bg-signal-cyan/70"
                    }`}
                  >
                    <span className="absolute inset-0 animate-ping rounded-full bg-signal-cyan opacity-50" />
                  </span>
                </span>
              </div>

              {/* Bottom: label + two small data points */}
              <div>
                <h3 className="text-balance text-base font-semibold leading-tight tracking-tight text-ink-primary md:text-lg">
                  {cat.label}
                </h3>
                <div className="mt-2 border-t border-line/40 pt-2">
                  <p className="font-mono text-2xs uppercase tracking-[0.18em] text-ink-secondary">
                    {cat.peptides.length} peptides
                  </p>
                  <p className="mt-0.5 truncate text-2xs text-ink-muted">{cat.short}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
