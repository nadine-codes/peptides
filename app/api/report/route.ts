import { NextResponse } from "next/server";
import { isCategorySlug } from "@/lib/peptides";
import { getServerSupabase, supabaseConfigured } from "@/lib/supabase";
import { getFallbackReport } from "@/lib/fallback";
import { normalizeReport } from "@/lib/normalize";
import type { CategorySlug, IntelReport } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category") || "";

  if (!isCategorySlug(category)) {
    return NextResponse.json({ error: "invalid category" }, { status: 400 });
  }

  if (!supabaseConfigured()) {
    const fallback = normalizeReport(getFallbackReport(category as CategorySlug, "demo"));
    return NextResponse.json({ report: fallback, source: "fallback-no-supabase" });
  }

  const supabase = getServerSupabase();
  const { data, error } = await supabase
    .from("intel_reports")
    .select("payload, mode, generated_at")
    .eq("category", category)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    // No row yet — first cold start before any cron has run. Serve fallback so
    // the UI never blanks; cron / manual refresh will populate the row.
    const fallback = normalizeReport(getFallbackReport(category as CategorySlug, "demo"));
    return NextResponse.json({ report: fallback, source: "fallback-empty" });
  }

  const report = data.payload as IntelReport;
  return NextResponse.json({
    report: normalizeReport({
      ...report,
      mode: data.mode,
      generated_at: data.generated_at,
    }),
    source: "supabase",
  });
}
