import { promises as fs } from "fs";
import path from "path";
import type { CategorySlug, IntelReport } from "./types";

// Persistent cache layer backed by JSON files in public/data/.
// Files are produced by scripts/refresh.ts (run on a 6-hour cron via GitHub
// Actions) and committed to the repo. At runtime the agent reads them as
// pre-computed reports so user-facing requests are instant — no waiting on
// Apify or Claude.

const DATA_DIR = path.join(process.cwd(), "public", "data");

function fileFor(category: CategorySlug): string {
  return path.join(DATA_DIR, `${category}.json`);
}

export async function readCachedReport(category: CategorySlug): Promise<IntelReport | null> {
  try {
    const raw = await fs.readFile(fileFor(category), "utf8");
    const report = JSON.parse(raw) as IntelReport;
    if (!report?.peptides || !Array.isArray(report.peptides)) return null;
    return report;
  } catch {
    return null;
  }
}

export async function writeCachedReport(
  category: CategorySlug,
  report: IntelReport,
): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const out = JSON.stringify(report, null, 2);
  await fs.writeFile(fileFor(category), out, "utf8");
}

export async function listCachedCategories(): Promise<
  Array<{ category: CategorySlug; generated_at: string }>
> {
  try {
    const entries = await fs.readdir(DATA_DIR);
    const out: Array<{ category: CategorySlug; generated_at: string }> = [];
    for (const name of entries) {
      if (!name.endsWith(".json")) continue;
      const slug = name.replace(/\.json$/, "") as CategorySlug;
      const r = await readCachedReport(slug);
      if (r) out.push({ category: slug, generated_at: r.generated_at });
    }
    return out;
  } catch {
    return [];
  }
}
