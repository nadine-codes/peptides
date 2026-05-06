# PeptSight Agent System

## Purpose

PeptSight is an AI-powered peptide intelligence agent that aggregates and structures
peptide-ecosystem data into educational intelligence reports. It is **not** a
clinical tool, supplement store, protocol generator, or wellness coach. It analyzes
the *information landscape* — public discussion, research themes, market signals,
sentiment, claim consistency — so users can better understand how peptides are
being talked about, researched, and marketed.

## Agent Responsibilities

The PeptSight agent must:

- Interpret a user's research goal (one of seven research categories).
- Identify peptides commonly discussed in association with that category.
- Launch Apify Actors to gather live web data (Reddit threads, search results,
  research mentions, vendor/telehealth pages).
- Structure the extracted information into a normalized internal schema.
- Run an LLM synthesis pass that produces:
  - an overview of each peptide as discussed,
  - research themes (clearly labeled as research vs. anecdotal),
  - public sentiment (clearly labeled as anecdotal),
  - market snapshot (pricing/availability mentions, never recommendations),
  - a claim-consensus table,
  - conflicting claims across source tiers,
  - risk flags (research limitations, regulatory uncertainty, side-effect mentions).
- Return a structured intelligence report.

## Safety Rules — Non-Negotiable

The agent **must never**:

- Provide medical advice, diagnoses, or treatment plans.
- Recommend specific peptides for a user's situation.
- Generate dosages, cycles, stacks, or protocols.
- Claim medical efficacy or guaranteed outcomes.
- Encourage peptide usage, sourcing, or self-administration.
- Endorse vendors, telehealth providers, or specific products.

Every report must:

- Carry an educational-only disclaimer.
- Label sentiment sections as "anecdotal public discussion."
- Label vendor/telehealth content as marketing, not consensus.
- Distinguish research-backed claims from social media chatter.

If a user request edges toward "what should I take" / "how much should I take" /
"what stack works" — the agent must decline and reframe toward landscape analysis.

## Source Prioritization

When sources conflict, weight them in this order:

1. **Peer-reviewed research / clinical abstracts** (PubMed, journal pages, NCBI)
2. **Educational medical sources** (institutional pages, regulatory bodies)
3. **Public discussion** (Reddit, forums) — labeled "anecdotal"
4. **Vendor pages** — labeled "marketing"
5. **Telehealth marketing pages** — labeled "marketing"

Vendor and telehealth content is **never** treated as scientific consensus. It is
included only to surface conflicting claims between marketing and research.

## Scraping Workflow

The agent orchestrates Apify Actors dynamically based on the selected category:

1. **Reddit scraper** — recent discussions matching the category's peptide terms.
2. **Search scraper** — top results filtered for research/educational domains.
3. (Optional) **Generic content extractor** — for high-quality educational pages.

Each scrape is timeboxed. If an actor fails or times out, the pipeline degrades
gracefully to fallback data without breaking the user experience.

## Reasoning Pipeline

```
category
  └─ identify peptides (static map + optional LLM disambiguation)
       └─ launch Apify Actors in parallel
            └─ normalize + truncate scrape data
                 └─ LLM synthesis (single structured-output call)
                      └─ post-process + validate JSON shape
                           └─ stream report to UI
```

Each step emits an `AgentEvent` over the `/api/intelligence` stream so the UI's
"Agent Activity" panel reflects real pipeline state — not staged animation.

## Hallucination Prevention

- The synthesis LLM is instructed to cite source-tier (`research` | `anecdotal` |
  `vendor` | `telehealth`) for every non-trivial claim.
- The model **must not invent studies, papers, or authors**. If a claim is not
  supported by the supplied scrape data, it must be labeled as "anecdotal" or
  omitted.
- Quantitative metrics (discussion velocity, sentiment scores) are derived from
  scrape statistics, not invented by the LLM.
- Source URLs in the final report come only from scraped data.

## Consensus Logic

A claim's consensus level is estimated from:

- **Source agreement** — does it appear in research *and* discussion?
- **Frequency** — how often does it recur across distinct sources?
- **Tier overlap** — does research support what users discuss?
- **Cross-tier consistency** — do vendor claims align with or exceed research?

Levels:

- **Strong** — consistent across research and discussion
- **Mixed** — supported in some tiers, contested in others
- **Weak** — appears in discussion but lacks research grounding
- **Anecdotal** — exists primarily in user reports

## Conflicting-Claims Engine

The agent surfaces tensions between source tiers. Example output:

> Vendor recovery claims appear stronger than current public research consensus.
> Telehealth marketing emphasizes muscle retention; research literature does not.

Conflicts are reported neutrally — the agent does not resolve them, only exposes
them.

## Fallback Behavior

If `APIFY_TOKEN` is missing, an actor errors, or scraping times out:

- The pipeline continues with curated fallback data.
- The UI labels the run as "demo mode" via a visible status pill.
- Agent activity events still emit so the demo flow stays intact.
- All safety rules and labeling apply identically to fallback data.

If `ANTHROPIC_API_KEY` is missing or the synthesis call fails:

- The pipeline returns a curated fallback report directly.
- The UI clearly indicates demo mode.

The demo must always succeed — even with zero credentials.

## Educational-Only Policy

Every page renders a persistent disclaimer:

> PeptSight is an educational research-aggregation tool. It analyzes how peptides
> are discussed, researched, and marketed. It does not provide medical advice,
> dosing guidance, or treatment recommendations. Consult a licensed clinician
> for any health decision.

The disclaimer is part of the product, not a footnote.
