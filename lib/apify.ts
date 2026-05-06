import { ApifyClient } from "apify-client";

const DEFAULT_REDDIT_ACTOR = process.env.APIFY_REDDIT_ACTOR || "trudax/reddit-scraper-lite";
const DEFAULT_SEARCH_ACTOR = process.env.APIFY_SEARCH_ACTOR || "apify/google-search-scraper";

let client: ApifyClient | null = null;

function getClient(): ApifyClient | null {
  if (!process.env.APIFY_TOKEN) return null;
  if (!client) {
    client = new ApifyClient({ token: process.env.APIFY_TOKEN });
  }
  return client;
}

export function apifyAvailable(): boolean {
  return Boolean(process.env.APIFY_TOKEN);
}

export interface RedditPost {
  title: string;
  body: string;
  subreddit?: string;
  url?: string;
  score?: number;
}

export interface SearchHit {
  title: string;
  snippet: string;
  url: string;
  tier: "research" | "educational" | "anecdotal" | "vendor" | "telehealth";
}

// Per-actor budget. Apify Reddit Scraper Lite cold-starts in ~10s, then crawls
// ~25s. We want comfortable headroom so the run object resolves with the
// dataset already populated.
const ACTOR_WAIT_SECS = 120;

async function runAndCollect<T>(
  actorId: string,
  input: object,
  maxItems: number,
  map: (raw: any) => T | null,
  label: string,
): Promise<T[]> {
  const c = getClient();
  if (!c) return [];

  try {
    const run = await c.actor(actorId).call(input, { waitSecs: ACTOR_WAIT_SECS });

    if (!run || !run.defaultDatasetId) {
      console.error(`[apify] ${label}: no run / no dataset id`, run);
      return [];
    }

    if (run.status && run.status !== "SUCCEEDED") {
      console.warn(
        `[apify] ${label}: run not yet SUCCEEDED (status=${run.status}); reading whatever the dataset has so far`,
      );
    }

    const { items } = await c.dataset(run.defaultDatasetId).listItems({ limit: maxItems });
    return items
      .map(map)
      .filter((x): x is T => x !== null);
  } catch (err: any) {
    console.error(`[apify] ${label} failed:`, err?.statusCode || "", err?.message || err);
    return [];
  }
}

export async function scrapeReddit(query: string, maxItems = 12): Promise<RedditPost[]> {
  return runAndCollect<RedditPost>(
    DEFAULT_REDDIT_ACTOR,
    {
      searches: [query],
      maxItems,
      maxComments: 0,
      skipComments: true,
      searchPosts: true,
      searchComments: false,
      searchCommunities: false,
      sort: "relevance",
      time: "year",
      proxy: { useApifyProxy: true },
    },
    maxItems,
    (i: any) => {
      const title = String(i.title || i.dataType || "").slice(0, 200);
      if (!title) return null;
      return {
        title,
        body: String(i.body || i.text || i.selftext || i.description || "").slice(0, 800),
        subreddit:
          typeof i.communityName === "string"
            ? i.communityName.replace(/^r\//, "")
            : i.subreddit || i.parsedCommunityName,
        url: i.url || i.parsedId || undefined,
        score: typeof i.upVotes === "number" ? i.upVotes : i.score,
      };
    },
    `reddit:${query}`,
  );
}

export async function scrapeSearch(query: string, maxItems = 10): Promise<SearchHit[]> {
  const c = getClient();
  if (!c) return [];

  try {
    const run = await c.actor(DEFAULT_SEARCH_ACTOR).call(
      {
        queries: query,
        maxPagesPerQuery: 1,
        resultsPerPage: maxItems,
        mobileResults: false,
        languageCode: "en",
        countryCode: "us",
      },
      { waitSecs: ACTOR_WAIT_SECS },
    );

    if (!run || !run.defaultDatasetId) {
      console.error(`[apify] search:${query}: no run / no dataset id`, run);
      return [];
    }

    const { items } = await c.dataset(run.defaultDatasetId).listItems({ limit: 1 });
    const page: any = items[0] || {};
    const organic: any[] = page.organicResults || [];

    return organic.slice(0, maxItems).map((r) => ({
      title: String(r.title || "").slice(0, 200),
      snippet: String(r.description || r.snippet || "").slice(0, 600),
      url: String(r.url || ""),
      tier: tierForUrl(String(r.url || "")),
    }));
  } catch (err: any) {
    console.error(`[apify] search:${query} failed:`, err?.statusCode || "", err?.message || err);
    return [];
  }
}

function tierForUrl(url: string): SearchHit["tier"] {
  const u = url.toLowerCase();
  if (/pubmed|nih\.gov|ncbi|nature\.com|sciencedirect|nejm\.org|jamanetwork|thelancet|bmj\.com|cell\.com|frontiersin/.test(u)) {
    return "research";
  }
  if (/\.gov|\.edu|cochrane|who\.int|fda\.gov|mayoclinic|clevelandclinic|harvard\.edu/.test(u)) {
    return "educational";
  }
  if (/reddit\.com|forum|community|trtrevolution/.test(u)) {
    return "anecdotal";
  }
  if (/hims|hers|henryhealth|invigor|joinmaximus|joi|gameday|amaze|optimaledge|edenshealth/.test(u)) {
    return "telehealth";
  }
  return "vendor";
}
