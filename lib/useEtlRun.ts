"use client";

import { useEffect, useRef, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { getBrowserSupabase } from "./supabase";
import type { AgentEvent, CategorySlug } from "./types";

export interface EtlRun {
  id: string;
  category: string;
  status: "running" | "success" | "error";
  phase: string | null;
  mode: "live" | "demo" | null;
  percent: number;
  events: AgentEvent[];
  trigger: "cron" | "manual";
  started_at: string;
  finished_at: string | null;
  error: string | null;
}

interface UseEtlRunResult {
  run: EtlRun | null;
  loading: boolean;
}

function normalizeRow(row: any): EtlRun {
  return {
    id: row.id,
    category: row.category,
    status: row.status,
    phase: row.phase,
    mode: row.mode,
    percent: typeof row.percent === "number" ? row.percent : Number(row.percent) || 0,
    events: Array.isArray(row.events) ? (row.events as AgentEvent[]) : [],
    trigger: row.trigger,
    started_at: row.started_at,
    finished_at: row.finished_at,
    error: row.error,
  };
}

/**
 * Subscribes to the latest ETL run for a given category. On mount, fetches the
 * most recent row so the UI shows last-run history immediately. While mounted,
 * Realtime swaps to a newer run as soon as one is inserted (refresh click or
 * cron firing).
 */
export function useLatestEtlRun(category: CategorySlug): UseEtlRunResult {
  const [run, setRun] = useState<EtlRun | null>(null);
  const [loading, setLoading] = useState(true);
  const currentIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    currentIdRef.current = null;
    setRun(null);
    setLoading(true);

    let supabase;
    try {
      supabase = getBrowserSupabase();
    } catch (err) {
      console.warn("[useLatestEtlRun] browser client unavailable:", (err as Error).message);
      setLoading(false);
      return;
    }

    let channel: RealtimeChannel | null = null;

    (async () => {
      const { data, error } = await supabase
        .from("etl_runs")
        .select("*")
        .eq("category", category)
        .order("started_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) console.warn("[useLatestEtlRun] initial fetch failed:", error.message);
      if (cancelled) return;
      if (data) {
        const normalized = normalizeRow(data);
        currentIdRef.current = normalized.id;
        setRun(normalized);
      }
      setLoading(false);

      channel = supabase
        .channel(`etl_runs:${category}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "etl_runs",
            filter: `category=eq.${category}`,
          },
          (payload) => {
            console.debug("[useLatestEtlRun] INSERT", payload.new);
            const next = normalizeRow(payload.new);
            currentIdRef.current = next.id;
            setRun(next);
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "etl_runs",
            filter: `category=eq.${category}`,
          },
          (payload) => {
            const next = normalizeRow(payload.new);
            if (currentIdRef.current && next.id !== currentIdRef.current) return;
            currentIdRef.current = next.id;
            setRun(next);
          },
        )
        .subscribe((status, err) => {
          if (status === "SUBSCRIBED") {
            console.debug(`[useLatestEtlRun] subscribed to etl_runs:${category}`);
          } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT" || status === "CLOSED") {
            console.warn(
              `[useLatestEtlRun] channel ${status} for etl_runs:${category}`,
              err || "(no error detail)",
            );
          }
        });
    })();

    return () => {
      cancelled = true;
      if (channel) {
        try {
          channel.unsubscribe();
        } catch {}
      }
    };
  }, [category]);

  return { run, loading };
}
