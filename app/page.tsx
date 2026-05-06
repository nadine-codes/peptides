import { Hero } from "@/components/Hero";
import { CATEGORIES } from "@/lib/peptides";

export default function HomePage() {
  return (
    <>
      <Hero />
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard
            kicker="01 · Agent"
            title="Autonomous AI agent"
            body="An agent interprets the research category, identifies associated peptides, and orchestrates Apify Actors across Reddit, search, and educational sources."
          />
          <FeatureCard
            kicker="02 · Live data"
            title="Apify Actors, real time"
            body="Live web scraping is launched per peptide. Each step streams to the Agent Activity panel — judges see the pipeline as it runs."
          />
          <FeatureCard
            kicker="03 · Synthesis"
            title="Structured intelligence"
            body="The agent synthesizes a structured report: research themes, sentiment, market signals, claim consensus, conflicts, risk flags, and source transparency."
          />
        </div>

        <div className="mt-12 rounded-2xl border border-line/70 bg-bg-surface p-6">
          <p className="text-2xs font-mono uppercase tracking-[0.2em] text-ink-muted">
            Coverage · {CATEGORIES.length} research categories
          </p>
          <p className="mt-2 max-w-3xl text-balance text-sm text-ink-secondary">
            PeptSight covers seven research categories — fat loss, recovery, longevity, sleep,
            muscle retention, cognitive performance, and skin health. The agent dynamically routes
            scraping and synthesis based on the category you select. Every report is{" "}
            <span className="text-ink-primary">educational</span> — no recommendations, no protocols, no medical advice.
          </p>
        </div>
      </section>
    </>
  );
}

function FeatureCard({ kicker, title, body }: { kicker: string; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-line/70 bg-bg-surface p-5 ring-line">
      <p className="font-mono text-2xs uppercase tracking-[0.2em] text-ink-muted">{kicker}</p>
      <h3 className="mt-2 text-lg font-semibold tracking-tight text-ink-primary">{title}</h3>
      <p className="mt-2 text-sm text-ink-secondary">{body}</p>
    </div>
  );
}
