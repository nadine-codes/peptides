import type { ConsensusLevel, ResearchActivity, RiskLevel, SentimentLabel, SignalStrength } from "@/lib/types";

const SIGNAL_STYLES: Record<SignalStrength, string> = {
  High: "text-signal-cyan border-signal-cyan/40 bg-signal-cyan/5",
  Medium: "text-signal-blue border-signal-blue/40 bg-signal-blue/5",
  Emerging: "text-signal-violet border-signal-violet/40 bg-signal-violet/5",
};

const CONSENSUS_STYLES: Record<ConsensusLevel, string> = {
  Strong: "text-signal-green border-signal-green/40 bg-signal-green/5",
  Mixed: "text-signal-amber border-signal-amber/40 bg-signal-amber/5",
  Weak: "text-ink-secondary border-line-strong bg-bg-elevated",
  Anecdotal: "text-ink-muted border-line bg-bg-elevated",
};

const SENTIMENT_STYLES: Record<SentimentLabel, string> = {
  Positive: "text-signal-green border-signal-green/40 bg-signal-green/5",
  Mixed: "text-signal-amber border-signal-amber/40 bg-signal-amber/5",
  Divided: "text-signal-red border-signal-red/40 bg-signal-red/5",
  Cautious: "text-signal-amber border-signal-amber/40 bg-signal-amber/5",
};

const RESEARCH_STYLES: Record<ResearchActivity, string> = {
  Rising: "text-signal-cyan border-signal-cyan/40 bg-signal-cyan/5",
  Stable: "text-ink-secondary border-line-strong bg-bg-elevated",
  Declining: "text-ink-muted border-line bg-bg-elevated",
};

const RISK_STYLES: Record<RiskLevel, string> = {
  Low: "text-signal-green border-signal-green/40 bg-signal-green/5",
  Moderate: "text-signal-amber border-signal-amber/40 bg-signal-amber/5",
  Elevated: "text-signal-red border-signal-red/40 bg-signal-red/5",
  Uncertain: "text-ink-secondary border-line-strong bg-bg-elevated",
};

interface MetricBadgeProps {
  kind: "signal" | "consensus" | "sentiment" | "research" | "risk" | "neutral";
  value: string;
  label?: string;
  className?: string;
}

export function MetricBadge({ kind, value, label, className = "" }: MetricBadgeProps) {
  const styles = (() => {
    switch (kind) {
      case "signal":
        return SIGNAL_STYLES[value as SignalStrength] || SIGNAL_STYLES.Medium;
      case "consensus":
        return CONSENSUS_STYLES[value as ConsensusLevel] || CONSENSUS_STYLES.Weak;
      case "sentiment":
        return SENTIMENT_STYLES[value as SentimentLabel] || SENTIMENT_STYLES.Mixed;
      case "research":
        return RESEARCH_STYLES[value as ResearchActivity] || RESEARCH_STYLES.Stable;
      case "risk":
        return RISK_STYLES[value as RiskLevel] || RISK_STYLES.Uncertain;
      default:
        return "text-ink-secondary border-line-strong bg-bg-elevated";
    }
  })();

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-2xs uppercase tracking-[0.12em] ${styles} ${className}`}
    >
      {label ? <span className="text-ink-muted">{label}</span> : null}
      <span>{value}</span>
    </span>
  );
}
