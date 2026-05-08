#!/usr/bin/env tsx
/**
 * scripts/refresh.ts
 *
 * Runs the PeptSight intelligence pipeline for every research category and
 * writes the results to public/data/<category>.json.
 *
 * Run modes:
 *   tsx scripts/refresh.ts                 # all 7 categories
 *   tsx scripts/refresh.ts fat-loss        # one specific category
 *   tsx scripts/refresh.ts fat-loss recovery
 *
 * Required env vars (read from .env.local locally, GitHub Actions secrets in CI):
 *   ANTHROPIC_API_KEY
 *   APIFY_TOKEN
 */

import { runIntelligencePipeline } from "../lib/agent";
import { writeCachedReport } from "../lib/cache";
import { CATEGORIES, isCategorySlug } from "../lib/peptides";
import type { CategorySlug, IntelReport } from "../lib/types";

// Best-effort load of .env.local for local runs (GitHub Actions injects env directly).
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("dotenv").config({ path: ".env.local" });
} catch {
  // dotenv not installed → assume env vars are already in process.env
}

function pickCategories(args: string[]): CategorySlug[] {
  if (args.length === 0) return CATEGORIES.map((c) => c.slug);
  const valid: CategorySlug[] = [];
  for (const a of args) {
    if (!isCategorySlug(a)) {
      console.error(`✗ skipping unknown category: ${a}`);
      continue;
    }
    valid.push(a);
  }
  return valid;
}

async function refreshOne(category: CategorySlug): Promise<IntelReport | null> {
  let report: IntelReport | null = null;
  let lastStatus = "";

  await runIntelligencePipeline(
    category,
    (event) => {
      switch (event.type) {
        case "mode":
          console.log(`  mode: ${event.mode}${event.reason ? ` — ${event.reason}` : ""}`);
          break;
        case "status":
          if (event.message !== lastStatus) {
            console.log(`  · ${event.message}`);
            lastStatus = event.message;
          }
          break;
        case "tool_result":
          console.log(
            `    ✓ ${event.tool} → ${event.summary}${
              event.durationMs ? ` (${(event.durationMs / 1000).toFixed(1)}s)` : ""
            }`,
          );
          break;
        case "error":
          console.warn(`  ! ${event.message}`);
          break;
        case "result":
          report = event.data;
          break;
      }
    },
    { forceRefresh: true },
  );

  return report;
}

async function main() {
  const args = process.argv.slice(2);
  const cats = pickCategories(args);

  if (cats.length === 0) {
    console.error("No valid categories to refresh.");
    process.exit(1);
  }

  if (!process.env.ANTHROPIC_API_KEY || !process.env.APIFY_TOKEN) {
    console.error("✗ ANTHROPIC_API_KEY and APIFY_TOKEN must be set for live refresh.");
    console.error("  (set them in .env.local for local runs, or repo secrets for CI)");
    process.exit(1);
  }

  console.log(`PeptSight refresh — ${cats.length} categor${cats.length === 1 ? "y" : "ies"}`);
  console.log(`Started: ${new Date().toISOString()}\n`);

  let succeeded = 0;
  let failed = 0;
  const t0 = Date.now();

  for (const cat of cats) {
    const tStart = Date.now();
    console.log(`▶ ${cat}`);
    try {
      const report = await refreshOne(cat);
      if (!report) {
        console.error(`  ✗ no report returned`);
        failed++;
        continue;
      }
      await writeCachedReport(cat, report);
      const elapsed = ((Date.now() - tStart) / 1000).toFixed(1);
      console.log(`  ✓ wrote public/data/${cat}.json (${report.peptides.length} peptides, ${elapsed}s)\n`);
      succeeded++;
    } catch (err) {
      console.error(`  ✗ ${(err as Error).message}\n`);
      failed++;
    }
  }

  const totalElapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`Done: ${succeeded} succeeded, ${failed} failed in ${totalElapsed}s`);
  process.exit(failed > 0 && succeeded === 0 ? 1 : 0);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
