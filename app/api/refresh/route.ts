import { NextResponse, after } from "next/server";
import { runIntelligencePipeline } from "@/lib/agent";
import { isCategorySlug } from "@/lib/peptides";
import { getServerSupabase, supabaseConfigured } from "@/lib/supabase";
import type { AgentEvent, CategorySlug } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const PHASE_BASE_PROGRESS: Record<string, number> = {
  interpret: 5,
  identify: 12,
  scrape: 20,
  analyze: 75,
  synthesize: 88,
  finalize: 96,
};

function authorize(req: Request): boolean {
  // Cron / external callers must present the bearer secret.
  const secret = process.env.REFRESH_SECRET;
  const auth = req.headers.get("authorization") || "";
  if (secret && auth === `Bearer ${secret}`) return true;

  // Same-origin browser calls (the manual refresh button) are trusted: anyone
  // who can visit the site can also click the button — protecting this path
  // with a shared secret would either leak the secret to the client or break
  // the UI. We detect "browser-issued" by Origin matching Host.
  const origin = req.headers.get("origin");
  const host = req.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host === host) return true;
    } catch {
      // malformed origin — fall through
    }
  }

  // No secret configured at all → dev mode, allow everything.
  if (!secret) return true;

  return false;
}

export async function POST(req: Request) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing)" },
      { status: 500 },
    );
  }

  const url = new URL(req.url);
  const queryCategory = url.searchParams.get("category");
  const queryTrigger = url.searchParams.get("trigger");

  let bodyCategory: string | undefined;
  let bodyTrigger: string | undefined;
  try {
    const body = (await req.json()) as { category?: string; trigger?: string };
    bodyCategory = body?.category;
    bodyTrigger = body?.trigger;
  } catch {
    // body is optional — cron passes via query string
  }

  const category = queryCategory || bodyCategory;
  if (!category || !isCategorySlug(category)) {
    return NextResponse.json({ error: "invalid or missing category" }, { status: 400 });
  }
  const trigger: "cron" | "manual" =
    (queryTrigger === "cron" || bodyTrigger === "cron") ? "cron" : "manual";

  const supabase = getServerSupabase();

  const { data: created, error: createErr } = await supabase
    .from("etl_runs")
    .insert({
      category,
      trigger,
      status: "running",
      phase: "interpret",
      percent: 0,
      events: [],
    })
    .select("id")
    .single();

  if (createErr || !created) {
    const msg = createErr?.message || "unknown";
    const isRls = msg.includes("row-level security");
    return NextResponse.json(
      {
        error: `failed to create etl run: ${msg}`,
        hint: isRls
          ? "SUPABASE_SERVICE_ROLE_KEY must be the service_role secret (a long JWT starting with 'eyJ') from Supabase Dashboard → Project Settings → API. The publishable/anon key won't bypass RLS."
          : undefined,
      },
      { status: 500 },
    );
  }
  const runId = created.id as string;

  // Pipeline runs after the response is sent. The route returns immediately so
  // the browser's fetch doesn't gate UI updates — Realtime on etl_runs drives
  // the notification toast + activity panel instead. This also means the
  // pipeline survives client-side aborts (page nav, hot reload), since the
  // request lifecycle no longer bounds its lifetime.
  after(async () => {
    await runPipelineForRun(runId, category as CategorySlug);
  });

  return NextResponse.json({ ok: true, runId, category, trigger }, { status: 202 });
}

async function runPipelineForRun(runId: string, category: CategorySlug) {
  const supabase = getServerSupabase();
  const events: AgentEvent[] = [];
  let lastPersist = 0;
  let pendingFlush: Promise<unknown> | null = null;

  let latestPhase = "interpret";
  let latestMode: "live" | "demo" | null = null;
  let toolResults = 0;
  let expectedToolResults = 0;

  const computeProgress = (): number => {
    let p = PHASE_BASE_PROGRESS[latestPhase] ?? 5;
    if (latestPhase === "scrape" && expectedToolResults > 0) {
      const span = PHASE_BASE_PROGRESS.analyze - PHASE_BASE_PROGRESS.scrape;
      p = PHASE_BASE_PROGRESS.scrape + (toolResults / expectedToolResults) * span;
    }
    return Math.min(99, Math.max(2, p));
  };

  const persist = async () => {
    lastPersist = Date.now();
    const { error } = await supabase
      .from("etl_runs")
      .update({
        phase: latestPhase,
        mode: latestMode,
        percent: computeProgress(),
        events,
      })
      .eq("id", runId);
    if (error) console.warn(`[refresh:${runId}] persist failed:`, error.message);
  };

  const queuePersist = () => {
    if (pendingFlush) return;
    pendingFlush = persist().finally(() => {
      pendingFlush = null;
    });
  };

  try {
    const { report, mode } = await runIntelligencePipeline(category, {
      onEvent: async (event) => {
        events.push(event);

        switch (event.type) {
          case "status":
            latestPhase = event.phase;
            break;
          case "mode":
            latestMode = event.mode;
            break;
          case "peptides_identified":
            expectedToolResults = event.peptides.length * 2;
            break;
          case "tool_result":
            toolResults += 1;
            break;
        }

        const force =
          event.type === "mode" ||
          event.type === "peptides_identified" ||
          event.type === "result" ||
          event.type === "error" ||
          event.type === "done";
        if (force || Date.now() - lastPersist > 250) {
          queuePersist();
        }
      },
    });

    if (pendingFlush) await pendingFlush;

    const { error: upsertErr } = await supabase.from("intel_reports").upsert(
      {
        category,
        payload: report,
        mode,
        generated_at: report.generated_at,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "category" },
    );
    if (upsertErr) {
      throw new Error(`intel_reports upsert failed: ${upsertErr.message}`);
    }

    await supabase
      .from("etl_runs")
      .update({
        status: "success",
        phase: "finalize",
        mode,
        percent: 100,
        events,
        finished_at: new Date().toISOString(),
      })
      .eq("id", runId);
  } catch (err) {
    const message = (err as Error).message || "unknown pipeline error";
    console.error(`[refresh:${runId}] pipeline failed:`, message);
    if (pendingFlush) {
      try {
        await pendingFlush;
      } catch {}
    }
    await supabase
      .from("etl_runs")
      .update({
        status: "error",
        error: message,
        events,
        finished_at: new Date().toISOString(),
      })
      .eq("id", runId);
  }
}
