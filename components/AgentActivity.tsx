"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import type { AgentEvent } from "@/lib/types";

interface AgentActivityProps {
  events: AgentEvent[];
  done: boolean;
  mode: "live" | "demo" | null;
}

export function AgentActivity({ events, done, mode }: AgentActivityProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [events.length]);

  return (
    <aside className="rounded-xl border border-line-strong bg-bg-surface ring-line">
      <header className="flex items-center justify-between border-b border-line/70 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-cyan">
            {!done && (
              <span className="absolute inset-0 animate-ping rounded-full bg-signal-cyan opacity-60" />
            )}
          </span>
          <span className="text-2xs font-mono uppercase tracking-[0.2em] text-ink-secondary">
            Agent Activity
          </span>
        </div>
        <ModePill mode={mode} done={done} />
      </header>

      <div ref={scrollerRef} className="max-h-[420px] overflow-y-auto px-2 py-2 font-mono text-[12.5px]">
        <AnimatePresence initial={false}>
          {events.map((evt, i) => (
            <motion.div
              key={i}
              layout
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="rounded-md px-2 py-1.5"
            >
              <EventLine event={evt} />
            </motion.div>
          ))}
        </AnimatePresence>
        {!done && events.length > 0 && (
          <div className="px-2 py-1.5">
            <span className="text-ink-muted">▍</span>
            <span className="ml-1 text-ink-muted shimmer">working…</span>
          </div>
        )}
      </div>

      <footer className="border-t border-line/70 px-4 py-2 text-2xs uppercase tracking-[0.18em] text-ink-muted">
        {events.length} event{events.length === 1 ? "" : "s"}
      </footer>
    </aside>
  );
}

function ModePill({ mode, done }: { mode: "live" | "demo" | null; done: boolean }) {
  if (!mode) return null;
  if (mode === "live") {
    return (
      <span className="flex items-center gap-1.5 rounded-full border border-signal-green/40 bg-signal-green/10 px-2 py-0.5 text-2xs font-mono uppercase tracking-[0.18em] text-signal-green">
        <span className="h-1.5 w-1.5 rounded-full bg-signal-green" />
        {done ? "Live" : "Live · Streaming"}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-signal-amber/40 bg-signal-amber/10 px-2 py-0.5 text-2xs font-mono uppercase tracking-[0.18em] text-signal-amber">
      <span className="h-1.5 w-1.5 rounded-full bg-signal-amber" />
      Demo Mode
    </span>
  );
}

function EventLine({ event }: { event: AgentEvent }) {
  const ts = formatTs(event.ts);
  switch (event.type) {
    case "mode":
      return (
        <Line ts={ts} icon="◆" tone="muted">
          <span className="text-ink-secondary">mode</span>{" "}
          <span className="text-ink-primary">{event.mode}</span>
          {event.reason ? (
            <span className="ml-2 text-ink-muted">— {event.reason}</span>
          ) : null}
        </Line>
      );
    case "status":
      return (
        <Line ts={ts} icon="›" tone="cyan">
          <span className="text-ink-primary">{event.message}</span>
          <span className="ml-2 text-ink-muted">[{event.phase}]</span>
        </Line>
      );
    case "tool_call":
      return (
        <Line ts={ts} icon="↗" tone="violet">
          <span className="text-signal-violet">tool.call</span>{" "}
          <span className="text-ink-primary">{event.tool}</span>
          <span className="ml-2 text-ink-muted truncate">({event.input})</span>
        </Line>
      );
    case "tool_result":
      return (
        <Line ts={ts} icon="✓" tone="green">
          <span className="text-signal-green">tool.result</span>{" "}
          <span className="text-ink-primary">{event.tool}</span>
          <span className="ml-2 text-ink-secondary">{event.summary}</span>
          {typeof event.durationMs === "number" ? (
            <span className="ml-2 text-ink-muted">· {event.durationMs}ms</span>
          ) : null}
        </Line>
      );
    case "peptides_identified":
      return (
        <Line ts={ts} icon="◇" tone="cyan">
          <span className="text-ink-primary">identified</span>{" "}
          <span className="text-ink-secondary">{event.peptides.length} peptides:</span>{" "}
          <span className="text-signal-cyan">{event.peptides.join(", ")}</span>
        </Line>
      );
    case "result":
      return (
        <Line ts={ts} icon="●" tone="green">
          <span className="text-signal-green">report.ready</span>{" "}
          <span className="text-ink-secondary">
            {event.data.peptides.length} structured peptide briefs
          </span>
        </Line>
      );
    case "error":
      return (
        <Line ts={ts} icon="!" tone="red">
          <span className="text-signal-red">error</span>{" "}
          <span className="text-ink-secondary">{event.message}</span>
        </Line>
      );
    case "done":
      return (
        <Line ts={ts} icon="■" tone="muted">
          <span className="text-ink-muted">stream closed</span>
        </Line>
      );
  }
}

function Line({
  ts,
  icon,
  tone,
  children,
}: {
  ts: string;
  icon: string;
  tone: "cyan" | "green" | "violet" | "red" | "muted";
  children: React.ReactNode;
}) {
  const toneClass = {
    cyan: "text-signal-cyan",
    green: "text-signal-green",
    violet: "text-signal-violet",
    red: "text-signal-red",
    muted: "text-ink-muted",
  }[tone];
  return (
    <div className="flex items-baseline gap-2">
      <span className="w-12 shrink-0 text-ink-dim">{ts}</span>
      <span className={`w-3 shrink-0 ${toneClass}`}>{icon}</span>
      <span className="flex-1 leading-snug">{children}</span>
    </div>
  );
}

function formatTs(ts: number): string {
  const d = new Date(ts);
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  const ms = String(d.getMilliseconds()).padStart(3, "0").slice(0, 2);
  return `${mm}:${ss}.${ms}`;
}
