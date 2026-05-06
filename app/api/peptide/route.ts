import { NextResponse } from "next/server";
import { isCategorySlug } from "@/lib/peptides";
import { getFallbackReport, getFallbackPeptide } from "@/lib/fallback";

export const runtime = "nodejs";

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

  const report = getFallbackReport(category);
  const target = getFallbackPeptide(category, peptide);

  if (!target) {
    return NextResponse.json({ error: "peptide not found" }, { status: 404 });
  }

  return NextResponse.json({
    category: report.category,
    category_label: report.category_label,
    peptide: target,
  });
}
