import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "@/shared/api/http-client";
import {
  createAgentClientExport,
  createDraftFromVersion,
  getAgentVersion,
  listAgentClients,
  listAgentVersions,
  publishAgentVersion,
} from "./api";

vi.mock("@/shared/api/http-client", () => ({ apiRequest: vi.fn() }));

const auth = { apiKey: "et_test_version", workspaceCode: "studio" };

describe("Agent version API contracts", () => {
  beforeEach(() => vi.mocked(apiRequest).mockReset());

  it("uses version_no for list detail and restore", async () => {
    vi.mocked(apiRequest).mockResolvedValue({} as never);
    await listAgentVersions(auth, 12);
    await getAgentVersion(auth, 12, 4);
    await createDraftFromVersion(auth, 12, 2, {
      expected_draft_revision: 8,
      confirm_replace: true,
    });

    expect(apiRequest).toHaveBeenNthCalledWith(
      1,
      "/agents/12/versions?limit=20&offset=0",
      auth,
    );
    expect(apiRequest).toHaveBeenNthCalledWith(2, "/agents/12/versions/4", auth);
    expect(apiRequest).toHaveBeenNthCalledWith(
      3,
      "/agents/12/versions/2/create-draft",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          expected_draft_revision: 8,
          confirm_replace: true,
        }),
      }),
    );
  });

  it("unwraps the Agent returned by history restore", async () => {
    vi.mocked(apiRequest).mockResolvedValue({ agent: { id: 12, draft_revision: 9 } } as never);

    await expect(
      createDraftFromVersion(auth, 12, 2, {
        expected_draft_revision: 8,
        confirm_replace: true,
      }),
    ).resolves.toMatchObject({ id: 12, draft_revision: 9 });
  });

  it("preserves publish concurrency and idempotency fields", async () => {
    vi.mocked(apiRequest).mockResolvedValue({} as never);
    const input = {
      expected_draft_revision: 9,
      expected_current_version_id: 35,
      release_note: "更新能力",
      request_key: "08cb839c-6c2e-4e51-9d6f-c62c5df616df",
    };
    await publishAgentVersion(auth, 12, input);
    expect(apiRequest).toHaveBeenCalledWith(
      "/agents/12/publish",
      expect.objectContaining({ method: "POST", body: JSON.stringify(input) }),
    );
  });

  it("lists clients and exports only the platform current version", async () => {
    vi.mocked(apiRequest).mockResolvedValue({} as never);
    await listAgentClients(auth, 12);
    await createAgentClientExport(auth, 7);
    expect(apiRequest).toHaveBeenNthCalledWith(1, "/agents/12/clients", auth);
    expect(apiRequest).toHaveBeenNthCalledWith(
      2,
      "/agent-clients/7/exports",
      expect.objectContaining({ method: "POST" }),
    );
  });
});
