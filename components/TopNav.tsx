import Link from "next/link";
import { Logo } from "./Logo";

export function TopNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-bg-base/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-6">
        <Link href="/" className="hover:opacity-90">
          <Logo />
        </Link>
        <div className="flex items-center gap-2 text-2xs uppercase tracking-[0.18em] text-ink-muted">
          <span className="font-mono">v0.1</span>
          <span className="text-ink-dim">·</span>
          <span className="text-right">
            Educational Research <br className="md:hidden" />Aggregation
          </span>
        </div>
      </div>
    </header>
  );
}
