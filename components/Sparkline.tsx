interface SparklineProps {
  velocityPct: number;
  className?: string;
}

// Deterministic pseudo-random generator so sparklines are stable per peptide.
function seeded(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

export function Sparkline({ velocityPct, className = "" }: SparklineProps) {
  const seed = Math.max(1, Math.round(velocityPct));
  const rand = seeded(seed);
  const points = 24;
  const trend = velocityPct / 100; // 0..5
  const arr: number[] = [];
  for (let i = 0; i < points; i++) {
    const drift = (i / (points - 1)) * trend;
    const noise = (rand() - 0.5) * 0.6;
    arr.push(0.4 + drift * 0.6 + noise * 0.5);
  }
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const range = Math.max(0.001, max - min);
  const w = 100;
  const h = 28;
  const stepX = w / (points - 1);
  const path = arr
    .map((v, i) => {
      const x = i * stepX;
      const y = h - ((v - min) / range) * h;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  const fillPath = `${path} L${w},${h} L0,${h} Z`;

  const accent = velocityPct >= 100 ? "#22d3ee" : velocityPct >= 50 ? "#3b82f6" : "#a1a1aa";

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`sg-${seed}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.35" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#sg-${seed})`} />
      <path d={path} fill="none" stroke={accent} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}
