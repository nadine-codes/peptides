# PeptSight

Live link: https://abroad-extension-salvation-kodak.trycloudflare.com

![Project Screenshot](./images/<img width="2340" height="1406" alt="peptsight2" src="https://github.com/user-attachments/assets/344948d7-cd8c-4b93-b2fc-dd8040a8885d" />
.png)


Real-time peptide intelligence powered by AI agents, Apify Actors, and live web data.

PeptSight transforms fragmented peptide-ecosystem information — Reddit threads,
research mentions, vendor pages, telehealth marketing — into structured, educational
intelligence reports. It analyzes trends, sentiment, market signals, and claim
consistency. **It is not a medical or clinical tool.** See `CLAUDE.md` for the full
agent system, safety rules, and reasoning pipeline.

## Quick start

```bash
npm install
cp .env.example .env.local      # optional — works without keys in demo mode
npm run dev
```

Open <http://localhost:3000>.

## Environment

All variables are optional. The app runs in **demo mode** with rich fallback data
when no keys are present, so judges can see the full flow regardless.

| Variable | Purpose |
| --- | --- |
| `ANTHROPIC_API_KEY` | Claude (claude-sonnet-4-6) for live synthesis |
| `ANTHROPIC_MODEL` | Override model (default `claude-sonnet-4-6`) |
| `APIFY_TOKEN` | Apify Actors for live web scraping |
| `APIFY_REDDIT_ACTOR` | Override Reddit actor (default `trudax/reddit-scraper-lite`) |
| `APIFY_SEARCH_ACTOR` | Override search actor (default `apify/google-search-scraper`) |

## Architecture

```
landing  →  /api/intelligence  (SSE stream of AgentEvents)
                │
                ├─ identify peptides for category
                ├─ launch Apify Actors (parallel)
                ├─ normalize + truncate scrape data
                ├─ Claude synthesis → structured JSON
                └─ stream final IntelReport to UI
                       │
                       ├─ /report/[category]      results dashboard
                       └─ /peptide/[…]/[…]        detailed report
```

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v3 · Framer Motion ·
Apify Client SDK · Anthropic SDK.

## Note on safety

PeptSight is an **educational research-aggregation tool**. It analyzes how peptides
are discussed, researched, and marketed. It does not provide medical advice, dosing
guidance, or treatment recommendations. The agent declines requests for protocols,
cycles, stacks, or specific recommendations.

The full safety policy lives in [`CLAUDE.md`](./CLAUDE.md).
