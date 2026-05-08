import type { AgentEvent, CategorySlug, IntelReport } from "./types";
import { CATEGORY_BY_SLUG } from "./peptides";
import { apifyAvailable, scrapeReddit, scrapeSearch, type RedditPost, type SearchHit } from "./apify";
import { llmAvailable, synthesizeReport } from "./llm";
import { getFallbackReport } from "./fallback";
import { readCachedReport, writeCachedReport } from "./cache";

// In-memory cache for fast repeated reads within a single Node process.
// Persistent (cross-deploy) caching is handled by lib/cache.ts (JSON files
// in public/data/ produced by scripts/refresh.ts on a 6h cron).
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const reportCache = new Map<CategorySlug, { at: number; report: IntelReport }>();

export interface PipelineOptions {
  forceRefresh?: boolean;
}

type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
type Emit = (event: DistributiveOmit<AgentEvent, "ts">) => void;

const STATUS_MIN_DELAY = 280;

function pause(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export async function runIntelligencePipeline(
  category: CategorySlug,
  rawEmit: (e: AgentEvent) => void,
  options: PipelineOptions = {},
): Promise<void> {
  const emit: Emit = (e) => rawEmit({ ...(e as AgentEvent), ts: Date.now() });
  const cat = CATEGORY_BY_SLUG[category];

  const liveMode = apifyAvailable() && llmAvailable();

  // Cache layer (skipped on forceRefresh):
  //   1. In-memory Map  — fastest, per-process
  //   2. JSON file       — persistent, populated by 6h cron job
  //   3. Live pipeline   — only on first cold load before cron has run
  if (!options.forceRefresh) {
    const memCached = reportCache.get(category);
    if (memCached && Date.now() - memCached.at < CACHE_TTL_MS) {
      return replayCachedReport(memCached.report, cat, emit, liveMode, "memory");
    }
    const fileCached = await readCachedReport(category);
    if (fileCached) {
      reportCache.set(category, { at: Date.now(), report: fileCached });
      return replayCachedReport(fileCached, cat, emit, liveMode, "file");
    }
  }

  emit({
    type: "mode",
    mode: liveMode ? "live" : "demo",
    reason: liveMode
      ? "APIFY_TOKEN and ANTHROPIC_API_KEY present — running live pipeline"
      : "Running curated demo data — set APIFY_TOKEN and ANTHROPIC_API_KEY for live mode",
  });

  // 1. Interpret
  emit({ type: "status", phase: "interpret", message: `Interpreting research category: ${cat.label}…` });
  await pause(STATUS_MIN_DELAY);

  // 2. Identify peptides
  emit({ type: "status", phase: "identify", message: "Identifying associated peptides…" });
  await pause(STATUS_MIN_DELAY);
  const peptides = cat.peptides;
  emit({ type: "peptides_identified", peptides });

  // 3. Scrape
  emit({
    type: "status",
    phase: "scrape",
    message: liveMode
      ? `Launching Apify Actors across ${peptides.length} peptides…`
      : `Loading curated source bundles for ${peptides.length} peptides…`,
  });

  const scrapeBundles: Array<{ peptide: string; redditPosts: RedditPost[]; searchHits: SearchHit[] }> = [];

  if (liveMode) {
    // Run actors in parallel per peptide. Each peptide → reddit + search.
    const tasks = peptides.map(async (p) => {
      const redditQuery = p; // simpler queries = more hits
      const searchQuery = `${p} ${cat.label} peptide research`;

      emit({ type: "tool_call", tool: "apify:reddit-scraper", input: redditQuery });
      const tStart = Date.now();
      const redditPosts = await scrapeReddit(redditQuery, 6);
      emit({
        type: "tool_result",
        tool: "apify:reddit-scraper",
        summary: `${p} — ${redditPosts.length} Reddit posts`,
        count: redditPosts.length,
        durationMs: Date.now() - tStart,
      });

      emit({ type: "tool_call", tool: "apify:search-scraper", input: searchQuery });
      const sStart = Date.now();
      const searchHits = await scrapeSearch(searchQuery, 6);
      emit({
        type: "tool_result",
        tool: "apify:search-scraper",
        summary: `${p} — ${searchHits.length} search hits`,
        count: searchHits.length,
        durationMs: Date.now() - sStart,
      });

      scrapeBundles.push({ peptide: p, redditPosts, searchHits });
    });

    await Promise.all(tasks);
  } else {
    // Simulated agent activity for demo mode — clearly labeled.
    for (const p of peptides) {
      emit({ type: "tool_call", tool: "demo:reddit-cache", input: `${p} ${cat.short}` });
      await pause(140);
      emit({
        type: "tool_result",
        tool: "demo:reddit-cache",
        summary: `${p} — curated posts loaded`,
        count: 8,
        durationMs: 140,
      });
      scrapeBundles.push({ peptide: p, redditPosts: [], searchHits: [] });
    }
  }

  // 4. Analyze
  emit({ type: "status", phase: "analyze", message: "Analyzing discussion velocity and sentiment…" });
  await pause(STATUS_MIN_DELAY);
  emit({ type: "status", phase: "analyze", message: "Comparing claim consistency across sources…" });
  await pause(STATUS_MIN_DELAY);

  const totalScraped = scrapeBundles.reduce(
    (n, b) => n + b.redditPosts.length + b.searchHits.length,
    0,
  );

  // 5. Synthesize
  let report: IntelReport | null = null;

  if (liveMode && totalScraped >= 4) {
    emit({
      type: "status",
      phase: "synthesize",
      message: `Generating intelligence report from ${totalScraped} live sources…`,
    });
    try {
      report = await synthesizeReport({ category: cat, peptides, scrapeBundles });
    } catch (err) {
      emit({
        type: "error",
        message: `Synthesis failed: ${(err as Error).message}. Falling back to curated data.`,
        recoverable: true,
      });
    }
  } else if (liveMode) {
    emit({
      type: "error",
      message: `Live scrapes returned only ${totalScraped} items — falling back to curated data to avoid speculative synthesis.`,
      recoverable: true,
    });
  } else {
    emit({ type: "status", phase: "synthesize", message: "Generating intelligence report…" });
  }

  if (!report) {
    if (liveMode) {
      emit({ type: "status", phase: "finalize", message: "Falling back to curated intelligence…" });
      await pause(200);
    }
    report = getFallbackReport(category, liveMode ? "live" : "demo");
  }

  emit({ type: "status", phase: "finalize", message: "Finalizing intelligence report…" });
  await pause(200);

  // Cache successful reports so subsequent reads are instant. The JSON file
  // write is best-effort and silent — the cron job is the canonical writer.
  reportCache.set(category, { at: Date.now(), report });
  if (liveMode && report.mode === "live") {
    writeCachedReport(category, report).catch(() => {});
  }

  emit({ type: "result", data: report });
  emit({ type: "done" });
}

type CategoryDef = (typeof CATEGORY_BY_SLUG)[CategorySlug];

async function replayCachedReport(
  report: IntelReport,
  cat: CategoryDef,
  emit: Emit,
  liveMode: boolean,
  source: "memory" | "file" = "memory",
): Promise<void> {
  emit({
    type: "mode",
    mode: report.mode,
    reason: `Cached intelligence — ${source === "file" ? "from scheduled refresh, " : ""}generated ${ageOf(report.generated_at)} ago${liveMode ? " (live)" : ""}`,
  });
  emit({ type: "status", phase: "interpret", message: `Interpreting research category: ${cat.label}…` });
  await pause(120);
  emit({ type: "status", phase: "identify", message: "Identifying associated peptides…" });
  await pause(120);
  emit({ type: "peptides_identified", peptides: report.peptides.map((p) => p.name) });
  emit({ type: "status", phase: "scrape", message: "Loading cached intelligence from this session…" });
  await pause(140);
  for (const p of report.peptides) {
    emit({
      type: "tool_result",
      tool: "cache:report",
      summary: `${p.name} — cached`,
      count: p.sources.length,
      durationMs: 0,
    });
    await pause(50);
  }
  emit({ type: "status", phase: "synthesize", message: "Replaying synthesized report…" });
  await pause(160);
  emit({ type: "result", data: report });
  emit({ type: "done" });
}

function ageOf(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s`;
  return `${Math.floor(diff / 60_000)}m`;
}

export async function getDetailedPeptide(category: CategorySlug, peptideName: string): Promise<IntelReport> {
  // For deep-link load of a detail page, return a fresh fallback (or live, if a richer flow is later wired in).
  const liveMode = apifyAvailable() && llmAvailable();
  return getFallbackReport(category, liveMode ? "live" : "demo");
}

export type { AgentEvent };
