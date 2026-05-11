import { NextResponse } from "next/server";
import { isCategorySlug, peptideSlug as makeSlug } from "@/lib/peptides";
import { getServerSupabase, supabaseConfigured } from "@/lib/supabase";
import { getFallbackReport, getFallbackPeptide } from "@/lib/fallback";
import type { CategorySlug, IntelReport } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const category = url.searchParams.get("category") || "";
  const peptide = url.searchParams.get("peptide") || "";

  if (!isCategorySlug(category)) {
    return NextResponse.json({ error: "invalid category" }, { status: 400 });
  }
  if (!peptide) {
    return NextResponse.json({ error: "missing peptide" }, { status: 400 });
  }

  let report: IntelReport | null = null;

  if (supabaseConfigured()) {
    const supabase = getServerSupabase();
    const { data } = await supabase
      .from("intel_reports")
      .select("payload, mode, generated_at")
      .eq("category", category)
      .maybeSingle();
    if (data) {
      report = {
        ...(data.payload as IntelReport),
        mode: data.mode,
        generated_at: data.generated_at,
      };
    }
  }

  if (!report) {
    report = getFallbackReport(category as CategorySlug, "demo");
  }

  const target =
    report.peptides.find((p) => makeSlug(p.name) === peptide) ||
    getFallbackPeptide(category as CategorySlug, peptide);

  if (!target) {
    return NextResponse.json({ error: "peptide not found" }, { status: 404 });
  }

  return NextResponse.json({
    category: report.category,
    category_label: report.category_label,
    peptide: target,
  });
}
