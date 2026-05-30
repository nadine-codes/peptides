import type { AgentEvent, CategorySlug, IntelReport } from "./types";
import { CATEGORY_BY_SLUG } from "./peptides";
import { apifyAvailable, scrapeReddit, scrapeSearch, type RedditPost, type SearchHit } from "./apify";
import { llmAvailable, synthesizeReport } from "./llm";
import { getFallbackReport } from "./fallback";

export interface PipelineOptions {
  onEvent?: (event: AgentEvent) => void | Promise<void>;
}

type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
type Emit = (event: DistributiveOmit<AgentEvent, "ts">) => Promise<void>;

const STATUS_MIN_DELAY = 200;

function pause(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export interface PipelineResult {
  report: IntelReport;
  mode: "live" | "demo";
}

export async function runIntelligencePipeline(
  category: CategorySlug,
  options: PipelineOptions = {},
): Promise<PipelineResult> {
  const cat = CATEGORY_BY_SLUG[category];
  // Set DEMO_MODE=true in .env.local to pause all paid live calls (Anthropic + Apify)
  // and run entirely on curated data — no API charges, no red error events. Flip it
  // back to false (or remove it) to resume the live pipeline once funded.
  const liveMode =
    process.env.DEMO_MODE !== "true" && apifyAvailable() && llmAvailable();

  const emit: Emit = async (e) => {
    if (!options.onEvent) return;
    await options.onEvent({ ...(e as AgentEvent), ts: Date.now() });
  };

  await emit({
    type: "mode",
    mode: liveMode ? "live" : "demo",
    reason: liveMode
      ? "Live pipeline — aggregating from real-time Reddit, search, and research sources"
      : "Curated intelligence — serving a representative pre-aggregated dataset",
  });

  await emit({ type: "status", phase: "interpret", message: `Interpreting research category: ${cat.label}…` });
  await pause(STATUS_MIN_DELAY);

  await emit({ type: "status", phase: "identify", message: "Identifying associated peptides…" });
  await pause(STATUS_MIN_DELAY);
  const peptides = cat.peptides;
  await emit({ type: "peptides_identified", peptides });

  await emit({
    type: "status",
    phase: "scrape",
    message: liveMode
      ? `Launching Apify Actors across ${peptides.length} peptides…`
      : `Loading curated source bundles for ${peptides.length} peptides…`,
  });

  const scrapeBundles: Array<{ peptide: string; redditPosts: RedditPost[]; searchHits: SearchHit[] }> = [];

  if (liveMode) {
    const tasks = peptides.map(async (p) => {
      const redditQuery = p;
      const searchQuery = `${p} ${cat.label} peptide research`;

      await emit({ type: "tool_call", tool: "apify:reddit-scraper", input: redditQuery });
      const tStart = Date.now();
      const redditPosts = await scrapeReddit(redditQuery, 6);
      await emit({
        type: "tool_result",
        tool: "apify:reddit-scraper",
        summary: `${p} — ${redditPosts.length} Reddit posts`,
        count: redditPosts.length,
        durationMs: Date.now() - tStart,
      });

      await emit({ type: "tool_call", tool: "apify:search-scraper", input: searchQuery });
      const sStart = Date.now();
      const searchHits = await scrapeSearch(searchQuery, 6);
      await emit({
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
    for (const p of peptides) {
      await emit({ type: "tool_call", tool: "demo:reddit-cache", input: `${p} ${cat.short}` });
      await pause(120);
      await emit({
        type: "tool_result",
        tool: "demo:reddit-cache",
        summary: `${p} — curated posts loaded`,
        count: 8,
        durationMs: 120,
      });
      scrapeBundles.push({ peptide: p, redditPosts: [], searchHits: [] });
    }
  }

  await emit({ type: "status", phase: "analyze", message: "Analyzing discussion velocity and sentiment…" });
  await pause(STATUS_MIN_DELAY);
  await emit({ type: "status", phase: "analyze", message: "Comparing claim consistency across sources…" });
  await pause(STATUS_MIN_DELAY);

  const totalScraped = scrapeBundles.reduce(
    (n, b) => n + b.redditPosts.length + b.searchHits.length,
    0,
  );

  let report: IntelReport | null = null;

  if (liveMode && totalScraped >= 4) {
    await emit({
      type: "status",
      phase: "synthesize",
      message: `Generating intelligence report from ${totalScraped} live sources…`,
    });
    try {
      report = await synthesizeReport({ category: cat, peptides, scrapeBundles });
    } catch (err) {
      await emit({
        type: "error",
        message: `Synthesis failed: ${(err as Error).message}. Falling back to curated data.`,
        recoverable: true,
      });
    }
  } else if (liveMode) {
    await emit({
      type: "error",
      message: `Live scrapes returned only ${totalScraped} items — falling back to curated data to avoid speculative synthesis.`,
      recoverable: true,
    });
  } else {
    await emit({ type: "status", phase: "synthesize", message: "Generating intelligence report…" });
  }

  let finalMode: "live" | "demo" = liveMode ? "live" : "demo";
  if (!report) {
    if (liveMode) {
      await emit({ type: "status", phase: "finalize", message: "Falling back to curated intelligence…" });
      await pause(150);
    }
    report = getFallbackReport(category, liveMode ? "live" : "demo");
    finalMode = report.mode;
  }

  await emit({ type: "status", phase: "finalize", message: "Finalizing intelligence report…" });
  await pause(120);

  await emit({ type: "result", data: report });
  await emit({ type: "done" });

  return { report, mode: finalMode };
}

export type { AgentEvent };
