import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearTestUserMemories, createRuntimeSession, getRuntimeWidgets, sendRuntimeMessage } from "./api";
import { runtimeHeaders } from "./headers";
import { resolveRuntimeAttachments, uploadRuntimeFile } from "./upload-api";

describe("Agent runtime contracts", () => {
  beforeEach(() => { window.localStorage.clear(); vi.restoreAllMocks(); });

  it("builds authenticated workspace headers without forcing multipart content type", () => {
    expect(runtimeHeaders("key", "studio")).toEqual({ "X-API-Key": "key", "X-Workspace-Code": "studio" });
    expect(runtimeHeaders("key", "studio", true)).toMatchObject({ "Content-Type": "application/json" });
  });

  it("uploads images as multipart with workspace scope", async () => {
    const data = { token: "image-token", preview_url: "/preview/image-token" };
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true, data }), { status: 200 }));
    const result = await uploadRuntimeFile("key", "studio", new File(["image"], "avatar.png", { type: "image/png" }), "image");
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(fetchMock.mock.calls[0][0]).toContain("/files/upload");
    expect(init.body).toBeInstanceOf(FormData);
    expect(init.headers).toEqual({ "X-API-Key": "key", "X-Workspace-Code": "studio" });
    expect(result).toMatchObject({ type: "image", token: "image-token", name: "avatar.png" });
  });

  it("resolves pending documents and preserves widget identifiers", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ success: true, data: { token: "doc-token", download_url: "/download/doc-token" } }), { status: 200 }));
    const result = await resolveRuntimeAttachments("key", "studio", [{ type: "file", file: new File(["doc"], "guide.pdf", { type: "application/pdf" }), widget_id: "upload", skill_id: "knowledge" }]);
    expect(result[0]).toMatchObject({ type: "file", token: "doc-token", widget_id: "upload", skill_id: "knowledge" });
    expect("file" in result[0]).toBe(false);
  });

  it("creates sessions and sends attachment-aware messages", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(JSON.stringify({ success: true, data: {} }), { status: 200 }));
    await createRuntimeSession("key", "studio", 32, 7);
    await sendRuntimeMessage("key", "studio", 9, "分析附件", { attachments: [{ type: "file", token: "doc" }], metadata: { custom_fields: { tone: "brief" } } });
    expect(JSON.parse(String((fetchMock.mock.calls[0][1] as RequestInit).body))).toEqual({ agent_id: 32, user_id: 7 });
    expect(JSON.parse(String((fetchMock.mock.calls[1][1] as RequestInit).body))).toMatchObject({ attachments: [{ type: "file", token: "doc" }], metadata: { custom_fields: { tone: "brief" } } });
  });

  it("uses scoped widget and memory endpoints", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async () => new Response(JSON.stringify({ success: true, data: { widgets: [] } }), { status: 200 }));
    await getRuntimeWidgets("key", "studio", 32);
    await clearTestUserMemories("key", "studio", 7, 32);
    expect(fetchMock.mock.calls[0][0]).toContain("/agents/32/skills/widgets");
    expect(fetchMock.mock.calls[1][0]).toContain("/users/7/agents/32/memories");
    expect((fetchMock.mock.calls[1][1] as RequestInit).method).toBe("DELETE");
  });
});
