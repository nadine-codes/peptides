"use client";

import { motion } from "framer-motion";
import { CATEGORIES } from "@/lib/peptides";
import type { CategorySlug } from "@/lib/types";

interface CategoryChipsProps {
  selected: CategorySlug | null;
  onSelect: (slug: CategorySlug) => void;
}

export function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat, i) => {
        const isActive = selected === cat.slug;
        return (
          <motion.button
            key={cat.slug}
            type="button"
            onClick={() => onSelect(cat.slug)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.04, duration: 0.4, ease: "easeOut" }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative rounded-full border px-4 py-2 text-sm transition-colors ${
              isActive
                ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                : "border-line bg-bg-elevated/60 text-ink-secondary hover:border-line-strong hover:text-ink-primary"
            }`}
          >
            <span className="relative z-10">{cat.label}</span>
            {isActive && (
              <motion.span
                layoutId="chip-glow"
                className="absolute inset-0 -z-0 rounded-full bg-signal-cyan/5"
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
