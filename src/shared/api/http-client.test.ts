import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiRequest, getApiBaseUrl } from "./http-client";

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
  });

  it("preserves Retry-After for understandable rate-limit recovery", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ success: false, data: { code: "WORLD_RATE_LIMIT", error: "slow down" } }),
        { status: 429, headers: { "Retry-After": "7" } },
      ),
    );

    await expect(apiRequest("/worlds/accept/schedule", { method: "POST" })).rejects.toMatchObject({
      status: 429,
      details: expect.objectContaining({ retry_after: "7" }),
    });
  });
});
