import { beforeEach, describe, expect, it, vi } from "vitest";
import { parseSseBuffer, sendRuntimeMessageStream, subscribeRuntimeEvents } from "./stream-api";

function eventStream(text: string): ReadableStream<Uint8Array> {
  return new ReadableStream({ start(controller) { controller.enqueue(new TextEncoder().encode(text)); controller.close(); } });
}

describe("runtime streams", () => {
  beforeEach(() => { window.localStorage.clear(); vi.restoreAllMocks(); });

  it("parses complete SSE data lines and preserves a partial tail", () => {
    const result = parseSseBuffer('data: {"type":"delta","text":"你"}\n\ndata: {"type":"done"');
    expect(result.events).toEqual([{ type: "delta", text: "你" }]);
    expect(result.rest).toContain("done");
  });

  it("streams delta and done events with workspace headers", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(eventStream('data: {"type":"delta","text":"你好"}\n\ndata: {"type":"done","message_id":"m-1","usage":{"input_tokens":1,"output_tokens":2,"total_tokens":3}}\n\n'), { status: 200 }));
    const chunks: string[] = []; let doneId = "";
    await sendRuntimeMessageStream("key", "studio", 9, "你好", undefined, { onChunk: (text) => chunks.push(text), onDone: (id) => { doneId = id; } });
    expect(chunks).toEqual(["你好"]); expect(doneId).toBe("m-1");
    expect((fetchMock.mock.calls[0][1] as RequestInit).headers).toMatchObject({ "X-Workspace-Code": "studio" });
  });

  it("subscribes to Edge status through authenticated fetch SSE", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(eventStream('data: {"type":"edge_status","subtype":"progress","content":"正在调用工具"}\n\n'), { status: 200 }));
    const event = await new Promise<{ content: string }>((resolve, reject) => {
      const stop = subscribeRuntimeEvents("key", "studio", 9, { onEdgeStatus: (value) => { stop(); resolve(value); }, onError: reject });
    });
    expect(event.content).toBe("正在调用工具");
    expect(fetchMock.mock.calls[0][0]).toContain("/user/events?session_id=9");
    expect((fetchMock.mock.calls[0][1] as RequestInit).headers).toMatchObject({ "X-API-Key": "key", "X-Workspace-Code": "studio" });
  });
});
