import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, buildUserPrompt, type SynthesisInput } from "./prompts";
import type { IntelReport } from "./types";
import { normalizePeptide } from "./normalize";

const DEFAULT_MODEL = "claude-sonnet-4-6";

let client: Anthropic | null = null;

function getClient(): Anthropic | null {
  if (!process.env.ANTHROPIC_API_KEY) return null;
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export function llmAvailable(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export async function synthesizeReport(input: SynthesisInput): Promise<IntelReport | null> {
  const c = getClient();
  if (!c) return null;

  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
  const userPrompt = buildUserPrompt(input);

  const response = await c.messages.create({
    model,
    max_tokens: 8000,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n")
    .trim();

  const json = extractJson(text);
  if (!json) return null;

  try {
    const parsed = JSON.parse(json) as IntelReport;
    if (!parsed.peptides || !Array.isArray(parsed.peptides)) return null;
    return {
      ...parsed,
      mode: "live",
      generated_at: parsed.generated_at || new Date().toISOString(),
      peptides: parsed.peptides.map(normalizePeptide),
    };
  } catch {
    return null;
  }
}

function extractJson(text: string): string | null {
  if (!text) return null;
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) return fence[1].trim();
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    return text.slice(firstBrace, lastBrace + 1);
  }
  return null;
}
