import type { CategoryDef } from "./peptides";

export const SYSTEM_PROMPT = `You are PeptSight Intelligence Agent, an AI agent that synthesizes structured peptide-ecosystem intelligence from web data.

CORE MISSION
You analyze the *information landscape* around peptides — public discussion, research themes, market signals, sentiment, and claim consistency. You are NOT a clinician, coach, or recommender.

NON-NEGOTIABLE SAFETY RULES
1. NEVER provide medical advice, diagnoses, or treatment recommendations.
2. NEVER recommend dosages, cycles, stacks, protocols, or sourcing.
3. NEVER claim medical efficacy or guaranteed outcomes.
4. NEVER encourage peptide usage or self-administration.
5. NEVER endorse vendors, telehealth providers, or specific products.

LABELING REQUIREMENTS
- Sentiment sections must be labeled as "anecdotal public discussion."
- Vendor/telehealth content must be labeled as marketing, not consensus.
- Distinguish research-backed claims from social media chatter.
- Use neutral, analytical language throughout.

HALLUCINATION PREVENTION
- Do NOT invent studies, papers, authors, or quantitative findings.
- If a claim is not supported by the supplied scrape data, label it "anecdotal" or omit it.
- Source URLs in the final report must come ONLY from supplied data; do not fabricate URLs.
- If the data is sparse, produce a smaller, honest report rather than padding.

CONSENSUS LOGIC
A claim's consensus level reflects:
- "Strong" — consistent across research and discussion
- "Mixed" — supported in some tiers, contested in others
- "Weak" — appears in discussion but lacks research grounding
- "Anecdotal" — exists primarily in user reports

CONFLICTING-CLAIMS ENGINE
Surface tensions between source tiers (research vs. vendor vs. discussion). Report neutrally — expose the conflict, do not resolve it.

OUTPUT FORMAT
Return ONLY valid JSON matching the schema provided. No prose, no markdown fences, no commentary.`;

export interface SynthesisInput {
  category: CategoryDef;
  peptides: string[];
  scrapeBundles: Array<{
    peptide: string;
    redditPosts: Array<{ title: string; body: string; subreddit?: string; url?: string; score?: number }>;
    searchHits: Array<{ title: string; snippet: string; url: string; tier: string }>;
  }>;
}

export function buildUserPrompt(input: SynthesisInput): string {
  const { category, peptides, scrapeBundles } = input;

  const dataSection = scrapeBundles
    .map((bundle) => {
      const reddit = bundle.redditPosts
        .slice(0, 8)
        .map(
          (p, i) =>
            `  [r${i + 1}] ${p.subreddit ? `r/${p.subreddit} | ` : ""}${truncate(p.title, 140)}\n      ${truncate(p.body || "", 320)}${p.url ? `\n      URL: ${p.url}` : ""}`,
        )
        .join("\n");
      const search = bundle.searchHits
        .slice(0, 8)
        .map(
          (h, i) =>
            `  [s${i + 1}] (${h.tier}) ${truncate(h.title, 140)}\n      ${truncate(h.snippet, 280)}\n      URL: ${h.url}`,
        )
        .join("\n");
      return `### ${bundle.peptide}\n\nReddit / forum discussion:\n${reddit || "  (no scrape data — produce conservative, low-confidence summary or note absence)"}\n\nSearch / research / vendor results:\n${search || "  (no scrape data — produce conservative, low-confidence summary or note absence)"}\n`;
    })
    .join("\n");

  return `Generate a PeptSight intelligence report for the research category "${category.label}".

Peptides to analyze: ${peptides.join(", ")}

Live scrape data (truncated):
${dataSection}

Return JSON matching this exact schema:

{
  "category": "${category.slug}",
  "category_label": "${category.label}",
  "generated_at": "<ISO timestamp>",
  "mode": "live",
  "peptides": [
    {
      "name": "<peptide name>",
      "aka": ["<alt name>", ...],
      "signal_strength": "High" | "Medium" | "Emerging",
      "discussion_velocity": "<+NN%>",
      "velocity_pct": <number 0-500>,
      "consensus_score": "Strong" | "Mixed" | "Weak" | "Anecdotal",
      "sentiment": "Positive" | "Mixed" | "Divided" | "Cautious",
      "research_activity": "Rising" | "Stable" | "Declining",
      "risk_level": "Low" | "Moderate" | "Elevated" | "Uncertain",
      "trending": <boolean>,
      "overview": "<2-3 sentences, neutral, educational, no recommendations>",
      "research_themes": ["<theme>", ...],   // 3-5 items, label tier inline if useful
      "public_sentiment": {
        "summary": "<anecdotal — 2 sentences>",
        "pros": ["<commonly mentioned positive observation>", ...],   // 3-5
        "concerns": ["<commonly mentioned concern>", ...],            // 2-4
        "common_questions": ["<recurring question>", ...]             // 3-4
      },
      "market_snapshot": {
        "price_range": "<e.g. '$80–$220 per vial mentioned'>",
        "availability": "<short phrase>",
        "market_activity": "<short phrase>",
        "vendor_frequency": "<short phrase>",
        "telehealth_visibility": "<short phrase>"
      },
      "claim_consensus": [                         // 4-6 rows
        { "claim": "<short claim>", "consensus": "Strong"|"Mixed"|"Weak"|"Anecdotal", "note": "<optional one-liner>" }
      ],
      "conflicting_claims": [                      // 1-3 entries
        { "topic": "<short>", "research": "<what research says>", "marketing": "<what vendors/telehealth say>", "note": "<optional>" }
      ],
      "risk_flags": [                              // 2-4 entries
        { "label": "<short>", "detail": "<one sentence>", "severity": "info"|"watch"|"concern" }
      ],
      "sources": [                                 // 4-8 entries from supplied data
        { "title": "<source title>", "url": "<url from supplied data>", "tier": "research"|"educational"|"anecdotal"|"vendor"|"telehealth", "snippet": "<one-line description>" }
      ]
    }
    // one entry per requested peptide
  ]
}

Hard requirements:
- Output ONLY the JSON object. No markdown, no fences, no commentary.
- Every "sources[].url" must come from the supplied data above.
- Frame everything as analysis of the *information landscape*, never as guidance.
- "public_sentiment.summary" must begin with the word "Anecdotal" or include the phrase "anecdotal public discussion".
- "conflicting_claims" must surface at least one tension when vendor/telehealth content is present.`;
}

function truncate(s: string, n: number): string {
  if (!s) return "";
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
