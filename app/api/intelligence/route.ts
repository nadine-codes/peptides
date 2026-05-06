import { NextResponse } from "next/server";
import { runIntelligencePipeline } from "@/lib/agent";
import { isCategorySlug } from "@/lib/peptides";
import type { AgentEvent } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  const category = (body as { category?: string })?.category;
  if (!category || !isCategorySlug(category)) {
    return NextResponse.json({ error: "invalid category" }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: AgentEvent) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        } catch {
          // controller may already be closed
        }
      };

      try {
        await runIntelligencePipeline(category, send);
      } catch (err) {
        send({
          type: "error",
          ts: Date.now(),
          message: `Pipeline error: ${(err as Error).message}`,
          recoverable: false,
        });
      } finally {
        try {
          controller.close();
        } catch {
          // already closed
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
