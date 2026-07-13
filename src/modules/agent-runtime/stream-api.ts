import { getApiBaseUrl } from "@/shared/api/http-client";
import { runtimeHeaders } from "./headers";
import type { EdgeStatusEvent, RuntimeMessageOptions, RuntimeStreamEvent, RuntimeUsage } from "./types";

export class RuntimeStreamHttpError extends Error {
  constructor(message: string, public readonly status: number) { super(message); this.name = "RuntimeStreamHttpError"; }
}

export function parseSseBuffer(buffer: string): { events: unknown[]; rest: string } {
  const lines = buffer.split("\n");
  const rest = lines.pop() || "";
  const events: unknown[] = [];
  for (const line of lines) {
    if (!line.startsWith("data:")) continue;
    const payload = line.slice(5).trim();
    if (!payload) continue;
    try { events.push(JSON.parse(payload)); } catch { /* ignore malformed event */ }
  }
  return { events, rest };
}

function messageBody(content: string, options?: RuntimeMessageOptions): string {
  const body: Record<string, unknown> = { content, stream: true };
  if (options?.attachments?.length) body.attachments = options.attachments;
  if (options?.metadata?.custom_fields && Object.keys(options.metadata.custom_fields).length) body.metadata = options.metadata;
  return JSON.stringify(body);
}

export async function sendRuntimeMessageStream(apiKey: string, workspaceCode: string, sessionId: number, content: string, options: RuntimeMessageOptions | undefined, callbacks: { onChunk: (text: string) => void; onDone: (messageId: string, usage?: RuntimeUsage) => void; onError?: (message: string) => void }): Promise<void> {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/sessions/${sessionId}/messages`, { method: "POST", headers: runtimeHeaders(apiKey, workspaceCode, true), body: messageBody(content, options) });
  if (!response.ok) {
    const message = await response.text() || `HTTP ${response.status}`;
    callbacks.onError?.(message); throw new RuntimeStreamHttpError(message, response.status);
  }
  const reader = response.body?.getReader();
  if (!reader) throw new RuntimeStreamHttpError("No response body", response.status);
  const decoder = new TextDecoder(); let buffer = ""; let completed = false;
  try {
    while (true) {
      const chunk = await reader.read(); if (chunk.done) break;
      buffer += decoder.decode(chunk.value, { stream: true });
      const parsed = parseSseBuffer(buffer); buffer = parsed.rest;
      for (const value of parsed.events) {
        const event = value as RuntimeStreamEvent;
        if (event.type === "delta" && event.text) callbacks.onChunk(event.text);
        if (event.type === "done" && event.message_id) { completed = true; callbacks.onDone(event.message_id, event.usage); return; }
        if (event.type === "error") { const message = event.error || "Stream error"; callbacks.onError?.(message); throw new Error(message); }
      }
    }
  } finally { reader.releaseLock(); }
  if (!completed) throw new Error("Stream ended before completion");
}

export function subscribeRuntimeEvents(apiKey: string, workspaceCode: string, sessionId: number, callbacks: { onEdgeStatus: (event: EdgeStatusEvent) => void; onError?: (error: Error) => void }): () => void {
  const controller = new AbortController();
  void (async () => {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/v1/user/events?session_id=${sessionId}`, { headers: runtimeHeaders(apiKey, workspaceCode), signal: controller.signal });
      if (!response.ok || !response.body) throw new Error(`SSE HTTP ${response.status}`);
      const reader = response.body.getReader(); const decoder = new TextDecoder(); let buffer = "";
      try {
        while (true) {
          const chunk = await reader.read(); if (chunk.done) break;
          buffer += decoder.decode(chunk.value, { stream: true });
          const parsed = parseSseBuffer(buffer); buffer = parsed.rest;
          for (const value of parsed.events) { const event = value as EdgeStatusEvent; if (event.type === "edge_status") callbacks.onEdgeStatus(event); }
        }
      } finally { reader.releaseLock(); }
    } catch (error) { if ((error as Error).name !== "AbortError") callbacks.onError?.(error as Error); }
  })();
  return () => controller.abort();
}
