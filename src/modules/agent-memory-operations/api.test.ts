import { beforeEach, describe, expect, it, vi } from "vitest";
import { demoAgentMemoryAnalytics } from "@/fixtures/agent-memory-operations";
import { apiRequest } from "@/shared/api/http-client";
import { getAgentMemoryAnalytics } from "./api";

vi.mock("@/shared/api/http-client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/shared/api/http-client")>()),
  apiRequest: vi.fn(),
}));

describe("Agent memory analytics API contract", () => {
  beforeEach(() => {
    vi.mocked(apiRequest).mockReset();
  });

  it("uses the Agent-level anonymous aggregate endpoint and shared auth context", async () => {
    vi.mocked(apiRequest).mockResolvedValue(demoAgentMemoryAnalytics(9));

    await getAgentMemoryAnalytics(
      { apiKey: "et_test_memory", workspaceCode: "studio" },
      9,
    );

    expect(apiRequest).toHaveBeenCalledWith("/agents/9/memory-analytics", {
      apiKey: "et_test_memory",
      workspaceCode: "studio",
    });
    expect(apiRequest).toHaveBeenCalledTimes(1);
  });

  it("keeps the Demo aggregate free of identity and single-Memory fields", () => {
    const serialized = JSON.stringify(demoAgentMemoryAnalytics(9));
    const forbiddenFields = [
      "binding_uuid",
      "memory_id",
      "user_id",
      "username",
      "email",
      "message",
      "fact_content",
      "api_key",
    ];

    for (const field of forbiddenFields) {
      expect(serialized).not.toContain(`"${field}"`);
    }
  });
});
