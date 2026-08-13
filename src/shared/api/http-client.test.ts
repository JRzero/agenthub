import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiRequest, getApiBaseUrl, resolveApiBaseOverride } from "./http-client";

describe("AgentHub HTTP client", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("preserves API-base override and scoped headers", async () => {
    window.localStorage.setItem("linkyun-api-url-override", "https://api.example.com/");
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: { agents: [] } }), {
        status: 200,
      }),
    );

    await apiRequest("/agents", {
      apiKey: "secret-test-key",
      workspaceCode: "studio",
    });

    expect(getApiBaseUrl()).toBe("https://api.example.com");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.example.com/api/v1/agents",
      expect.objectContaining({
        headers: expect.objectContaining({
          "X-API-Key": "secret-test-key",
          "X-Workspace-Code": "studio",
        }),
      }),
    );
  });

  it("does not send the default workspace header", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true, data: {} }), { status: 200 }),
    );
    await apiRequest("/profile", { apiKey: "test", workspaceCode: "default" });
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(init.headers).not.toHaveProperty("X-Workspace-Code");
  });
  it("blocks arbitrary production overrides but permits loopback and an explicit origin allowlist", () => {
    const fallback = "https://api.linkyun.example";
    expect(resolveApiBaseOverride("https://attacker.example/collect", fallback, true, "")).toBe(fallback);
    expect(resolveApiBaseOverride("http://127.0.0.1:8080/", fallback, true, "")).toBe("http://127.0.0.1:8080");
    expect(resolveApiBaseOverride("https://staging.example/api/", fallback, true, "https://staging.example")).toBe("https://staging.example/api");
    expect(resolveApiBaseOverride("javascript:alert(1)", fallback, false, "")).toBe(fallback);
  });
  it("normalizes version business errors from data", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: false,
          data: {
            code: "DRAFT_CONFLICT",
            error: "draft revision mismatch",
            current_draft_revision: 9,
          },
        }),
        { status: 409 },
      ),
    );

    await expect(apiRequest("/agents/12", { method: "PUT" })).rejects.toMatchObject({
      code: "DRAFT_CONFLICT",
      status: 409,
      details: expect.objectContaining({ current_draft_revision: 9 }),
    });
  });});
