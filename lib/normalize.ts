import type { IntelReport, PeptideReport } from "./types";

export function normalizePeptide(p: PeptideReport): PeptideReport {
  const rawPct = (p as { velocity_pct?: unknown }).velocity_pct;
  const rawLabel = (p as { discussion_velocity?: unknown }).discussion_velocity;

  let pct: number | null = null;
  if (typeof rawPct === "number" && Number.isFinite(rawPct)) {
    pct = rawPct;
  } else if (typeof rawPct === "string") {
    const n = Number(rawPct.replace(/[^\d.-]/g, ""));
    if (Number.isFinite(n)) pct = n;
  }
  if (pct === null && typeof rawLabel === "string") {
    const n = Number(rawLabel.replace(/[^\d.-]/g, ""));
    if (Number.isFinite(n)) pct = n;
  }
  if (pct === null) pct = 0;

  const label =
    typeof rawLabel === "string" && rawLabel.trim().length > 0
      ? rawLabel
      : `${pct >= 0 ? "+" : ""}${pct}%`;

  return { ...p, velocity_pct: pct, discussion_velocity: label };
}

export function normalizeReport(report: IntelReport): IntelReport {
  if (!report?.peptides || !Array.isArray(report.peptides)) return report;
  return { ...report, peptides: report.peptides.map(normalizePeptide) };
}
