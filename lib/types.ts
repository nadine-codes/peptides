export type CategorySlug =
  | "fat-loss"
  | "recovery"
  | "longevity"
  | "sleep"
  | "muscle-retention"
  | "cognitive-performance"
  | "skin-health";

export type SignalStrength = "High" | "Medium" | "Emerging";
export type ConsensusLevel = "Strong" | "Mixed" | "Weak" | "Anecdotal";
export type SentimentLabel = "Positive" | "Mixed" | "Divided" | "Cautious";
export type ResearchActivity = "Accelerating" | "Stable" | "Declining";
export type RiskLevel = "Low" | "Moderate" | "Elevated" | "Uncertain";
export type SourceTier = "research" | "educational" | "anecdotal" | "vendor" | "telehealth";

export interface ClaimConsensus {
  claim: string;
  consensus: ConsensusLevel;
  note?: string;
}

export interface ConflictingClaim {
  topic: string;
  research: string;
  marketing: string;
  note?: string;
}

export interface RiskFlag {
  label: string;
  detail: string;
  severity: "info" | "watch" | "concern";
}

export interface SourceLink {
  title: string;
  url: string;
  tier: SourceTier;
  snippet?: string;
}

export interface PublicSentiment {
  summary: string;
  pros: string[];
  concerns: string[];
  common_questions: string[];
}

export interface MarketSnapshot {
  price_range: string;
  availability: string;
  market_activity: string;
  vendor_frequency: string;
  telehealth_visibility: string;
}

export interface PeptideReport {
  name: string;
  aka?: string[];
  signal_strength: SignalStrength;
  discussion_velocity: string;          // e.g. "+212%"
  velocity_pct: number;                  // numeric for charts, e.g. 212
  consensus_score: ConsensusLevel;
  sentiment: SentimentLabel;
  research_activity: ResearchActivity;
  risk_level: RiskLevel;
  trending: boolean;

  overview: string;
  research_themes: string[];
  public_sentiment: PublicSentiment;
  market_snapshot: MarketSnapshot;
  claim_consensus: ClaimConsensus[];
  conflicting_claims: ConflictingClaim[];
  risk_flags: RiskFlag[];
  sources: SourceLink[];
}

export interface IntelReport {
  category: CategorySlug;
  category_label: string;
  generated_at: string;     // ISO timestamp
  mode: "live" | "demo";
  peptides: PeptideReport[];
}

// --- Streaming agent events ---

export type AgentEventType =
  | "mode"
  | "status"
  | "tool_call"
  | "tool_result"
  | "peptides_identified"
  | "result"
  | "error"
  | "done";

export interface AgentEventBase {
  type: AgentEventType;
  ts: number;
}

export interface StatusEvent extends AgentEventBase {
  type: "status";
  message: string;
  phase: "interpret" | "identify" | "scrape" | "analyze" | "synthesize" | "finalize";
}

export interface ModeEvent extends AgentEventBase {
  type: "mode";
  mode: "live" | "demo";
  reason?: string;
}

export interface ToolCallEvent extends AgentEventBase {
  type: "tool_call";
  tool: string;
  input: string;
}

export interface ToolResultEvent extends AgentEventBase {
  type: "tool_result";
  tool: string;
  summary: string;
  count?: number;
  durationMs?: number;
}

export interface PeptidesIdentifiedEvent extends AgentEventBase {
  type: "peptides_identified";
  peptides: string[];
}

export interface ResultEvent extends AgentEventBase {
  type: "result";
  data: IntelReport;
}

export interface ErrorEvent extends AgentEventBase {
  type: "error";
  message: string;
  recoverable: boolean;
}

export interface DoneEvent extends AgentEventBase {
  type: "done";
}

export type AgentEvent =
  | StatusEvent
  | ModeEvent
  | ToolCallEvent
  | ToolResultEvent
  | PeptidesIdentifiedEvent
  | ResultEvent
  | ErrorEvent
  | DoneEvent;
