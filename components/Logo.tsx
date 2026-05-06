export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="relative grid h-7 w-7 place-items-center rounded-md bg-bg-elevated ring-line">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-signal-cyan" fill="none">
          <path
            d="M5 7c2-3 6-3 8 0 2 3 0 6-3 8-3 2-7 0-7-4 0-2 1-3 2-4z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="16.5" cy="14" r="1.5" fill="currentColor" />
          <circle cx="11" cy="9.5" r="1.2" fill="currentColor" opacity="0.6" />
        </svg>
      </span>
      <span className="font-semibold tracking-tight text-ink-primary">
        Pept<span className="text-signal-cyan">Sight</span>
      </span>
    </span>
  );
}
