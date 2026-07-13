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
});
