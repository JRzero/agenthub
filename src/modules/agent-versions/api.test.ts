import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiRequest } from "@/shared/api/http-client";
import {
  createAgentClient,
  createAgentExport,
  createAgentClientExport,
  createDraftFromVersion,
  disableAgentClient,
  downloadAgentExport,
  enableAgentClient,
  getAgentVersion,
  listAgentClients,
  listAgentVersions,
  publishAgentVersion,
  relistAgent,
  unpublishAgent,
  updateAgentClient,
} from "./api";

vi.mock("@/shared/api/http-client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/shared/api/http-client")>()),
  apiRequest: vi.fn(),
}));

const EXPECTED_API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const auth = { apiKey: "et_test_version", workspaceCode: "studio" };

describe("Agent version API contracts", () => {
  beforeEach(() => {
    vi.mocked(apiRequest).mockReset();
    vi.stubGlobal("localStorage", {
      getItem: vi.fn().mockReturnValue(null),
    });
  });
  afterEach(() => vi.unstubAllGlobals());

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

  it("uses dedicated listing lifecycle endpoints and unwraps Agent responses", async () => {
    vi.mocked(apiRequest)
      .mockResolvedValueOnce({ agent: { id: 12, status: "private" } } as never)
      .mockResolvedValueOnce({ agent: { id: 12, status: "active" } } as never);

    await expect(unpublishAgent(auth, 12)).resolves.toMatchObject({
      status: "private",
    });
    await expect(relistAgent(auth, 12)).resolves.toMatchObject({
      status: "active",
    });
    expect(apiRequest).toHaveBeenNthCalledWith(1, "/agents/12/unpublish", {
      ...auth,
      method: "POST",
    });
    expect(apiRequest).toHaveBeenNthCalledWith(2, "/agents/12/relist", {
      ...auth,
      method: "POST",
    });
  });

  it("lists clients and creates generic or Client-specific current-version exports", async () => {
    vi.mocked(apiRequest).mockResolvedValue({} as never);
    await listAgentClients(auth, 12);
    await createAgentExport(auth, 12);
    await createAgentClientExport(auth, 7);
    expect(apiRequest).toHaveBeenNthCalledWith(1, "/agents/12/clients", auth);
    expect(apiRequest).toHaveBeenNthCalledWith(
      2,
      "/agents/12/exports",
      expect.objectContaining({ method: "POST" }),
    );
    expect(apiRequest).toHaveBeenNthCalledWith(
      3,
      "/agent-clients/7/exports",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("creates, updates, disables and re-enables AgentClient records", async () => {
    const client = {
      id: 51,
      capability_hash: "cap-old",
    } as import("./types").AgentClient;
    vi.mocked(apiRequest).mockResolvedValue(client as never);

    await createAgentClient(auth, 12, {
      client_key: "web-primary",
      client_type: "web_chat",
      name: "官网聊天",
      config: { theme: "light" },
    });
    await updateAgentClient(auth, 51, {
      expected_capability_hash: "cap-old",
      name: "官网聊天 v2",
    });
    await disableAgentClient(auth, 51);
    await enableAgentClient(auth, client);

    expect(apiRequest).toHaveBeenNthCalledWith(1, "/agents/12/clients", {
      ...auth,
      method: "POST",
      body: JSON.stringify({
        client_key: "web-primary",
        client_type: "web_chat",
        name: "官网聊天",
        config: { theme: "light" },
      }),
    });
    expect(apiRequest).toHaveBeenNthCalledWith(2, "/agent-clients/51", {
      ...auth,
      method: "PATCH",
      body: JSON.stringify({
        expected_capability_hash: "cap-old",
        name: "官网聊天 v2",
      }),
    });
    expect(apiRequest).toHaveBeenNthCalledWith(3, "/agent-clients/51", {
      ...auth,
      method: "DELETE",
    });
    expect(apiRequest).toHaveBeenNthCalledWith(4, "/agent-clients/51", {
      ...auth,
      method: "PATCH",
      body: JSON.stringify({
        expected_capability_hash: "cap-old",
        status: "enabled",
      }),
    });
  });

  it("downloads the generated export as ZIP bytes", async () => {
    const zip = new Blob(["zip-bytes"], { type: "application/zip" });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(zip, {
          status: 200,
          headers: {
            "Content-Type": "application/zip",
            "Content-Disposition": 'attachment; filename="agent-12-v3.zip"',
            "X-Package-SHA256": "package-hash",
          },
        }),
      ),
    );

    await expect(
      downloadAgentExport({ ...auth, username: "creator" }, 128),
    ).resolves.toMatchObject({
      filename: "agent-12-v3.zip",
      packageHash: "package-hash",
    });
    expect(fetch).toHaveBeenCalledWith(
      `${EXPECTED_API_BASE}/api/v1/agent-exports/128/download`,
      {
        headers: {
          "X-API-Key": "et_test_version",
          "X-Username": "creator",
          "X-Workspace-Code": "studio",
        },
      },
    );
  });

  it("rejects a successful response that is not a ZIP", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
      ),
    );

    await expect(downloadAgentExport(auth, 128)).rejects.toMatchObject({
      code: "EXPORT_RESPONSE_INVALID",
    });
  });
});
