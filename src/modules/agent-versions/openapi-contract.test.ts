import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  expectTypeOf,
  it,
  vi,
} from "vitest";
import { ApiError, apiRequest } from "@/shared/api/http-client";
import {
  createAgentClient,
  createAgentClientExport,
  createAgentExport,
  createDraftFromVersion,
  disableAgentClient,
  downloadAgentExport,
  enableAgentClient,
  getAgentClientRuntimeVersion,
  getAgentVersion,
  listAgentClients,
  listAgentVersions,
  publishAgentVersion,
  relistAgent,
  unpublishAgent,
  updateAgentClient,
} from "./api";
import { versionErrorMessage } from "./model";
import type {
  AgentClientExport,
  AgentClientRuntimeVersion,
  AgentVersion,
  CreateDraftFromVersionInput,
  PublishAgentVersionInput,
  UpdateAgentClientInput,
} from "./types";

vi.mock("@/shared/api/http-client", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/shared/api/http-client")>()),
  apiRequest: vi.fn(),
}));

interface ContractOperation {
  id: string;
  method: string;
  path: string;
  query_required: string[];
  request_required: string[];
}

interface ConsumerContract {
  schema_version: number;
  authority: {
    source_ref: string;
    binding_status: string;
    producer_task: string;
    producer_baseline: string;
    producer_sha256: string;
    producer_status: string;
  };
  consumer: { baseline: string; task_id: string };
  coverage: {
    producer: { paths: number; operations: number };
    consumer: { paths: number; operations: number };
    producer_operations_not_consumed: string[];
    consumer_operations_outside_producer_candidate: string[];
  };
  operations: ContractOperation[];
  stable_error_codes: string[];
  error_envelopes: {
    version_lifecycle: { code: string; message: string };
    export_and_respond_error_code: { code: string; message: string };
  };
  type_contracts: {
    publish_input_required: string[];
    restore_input_required: string[];
    client_update_required: string[];
    runtime_version_required: string[];
    export_record_required: string[];
  };
  semantic_invariants: {
    client_runtime_version: string;
    generic_export: string;
    client_export: string;
    export_download: string;
  };
}

const moduleDirectory = join(process.cwd(), "src/modules/agent-versions");
const contractBytes = readFileSync(
  join(moduleDirectory, "openapi-consumer-contract.json"),
);
const contract = JSON.parse(contractBytes.toString("utf8")) as ConsumerContract;
const expectedDigest = readFileSync(
  join(moduleDirectory, "openapi-consumer-contract.sha256"),
  "utf8",
).trim();
const auth = { apiKey: "et_test_openapi", workspaceCode: "studio" };

const version: AgentVersion = {
  id: 35,
  agent_id: 12,
  version_no: 4,
  version_hash: "version-hash-4",
  hash_schema_version: 1,
  config_snapshot: {},
  resource_manifest: {},
  required_capabilities: [],
  change_summary: null,
  release_note: "契约候选",
  availability: "available",
  created_by: 2,
  created_at: "2026-08-14T00:00:00Z",
};

function operation(id: string): ContractOperation {
  const selected = contract.operations.find((item) => item.id === id);
  if (!selected) throw new Error(`Missing projected operation: ${id}`);
  return selected;
}

function materializePath(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{([^}]+)\}/g, (_, key: string) =>
    String(values[key]),
  );
}

async function expectApiOperation(
  id: string,
  values: Record<string, string | number>,
  response: unknown,
  invoke: () => Promise<unknown>,
) {
  vi.mocked(apiRequest).mockReset();
  vi.mocked(apiRequest).mockResolvedValue(response as never);

  await invoke();

  expect(apiRequest).toHaveBeenCalledTimes(1);
  const [requestPath, requestOptions = {}] = vi.mocked(apiRequest).mock.calls[0] as [
    string,
    { method?: string; body?: string },
  ];
  const observed = new URL(`/api/v1${requestPath}`, "http://contract.test");
  const expected = operation(id);

  expect(
    {
      id,
      method: requestOptions.method || "GET",
      path: observed.pathname,
      query: [...observed.searchParams.keys()].sort(),
    },
    id,
  ).toEqual({
    id,
    method: expected.method,
    path: materializePath(expected.path, values),
    query: [...expected.query_required].sort(),
  });

  return requestOptions;
}

describe("Agent version authoritative OpenAPI consumer candidate", () => {
  beforeEach(() => {
    vi.mocked(apiRequest).mockReset();
    vi.stubGlobal("localStorage", {
      getItem: vi.fn().mockReturnValue(null),
    });
  });

  afterEach(() => vi.unstubAllGlobals());

  it("binds to the exact uncommitted producer candidate without claiming active status", () => {
    expect(contract).toMatchObject({
      schema_version: 1,
      authority: {
        source_ref: "linkyun-agent:docs/openapi/openapi.yaml",
        producer_task: "LYN-HAR-001-HAR-06C-LA",
        producer_baseline: "1a15df62f4954ca0fbb13c35b58f62df5a506cee",
        producer_sha256:
          "e80b042cc1cf81f4da388073351d364c594e8d92541439c6a3499a84f4ac2b26",
        producer_status: "candidate_uncommitted",
        binding_status: "candidate-bound-to-uncommitted-producer",
      },
      consumer: {
        baseline: "2fc749a9691129fd5437491f67a93709a5499d87",
        task_id: "LYN-HAR-001-HAR-06C-AH",
      },
    });
    expect(contract.authority.binding_status).not.toMatch(/active|committed$/);
    expect(contract.coverage).toEqual({
      producer: { paths: 14, operations: 16 },
      consumer: { paths: 12, operations: 14 },
      producer_operations_not_consumed: [
        "Agent Client heartbeat",
        "Agent Client acknowledgement",
      ],
      consumer_operations_outside_producer_candidate: [],
    });
  });

  it("reproduces the deterministic consumer projection digest offline", () => {
    expect(createHash("sha256").update(contractBytes).digest("hex")).toBe(
      expectedDigest,
    );
    expect(expectedDigest).toMatch(/^[a-f0-9]{64}$/);
  });

  it("discovers every version, listing, Client runtime and export API operation", async () => {
    await expectApiOperation(
      "listAgentVersions",
      { agent_id: 12 },
      { versions: [] },
      () => listAgentVersions(auth, 12),
    );
    await expectApiOperation(
      "getAgentVersion",
      { agent_id: 12, version_no: 4 },
      version,
      () => getAgentVersion(auth, 12, 4),
    );
    await expectApiOperation(
      "publishAgentVersion",
      { agent_id: 12 },
      { agent: { id: 12 }, version },
      () =>
        publishAgentVersion(auth, 12, {
          expected_draft_revision: 9,
          expected_current_version_id: 35,
          release_note: "契约候选",
          request_key: "request-key-1",
        }),
    );
    await expectApiOperation(
      "unpublishAgent",
      { agent_id: 12 },
      { agent: { id: 12 } },
      () => unpublishAgent(auth, 12),
    );
    await expectApiOperation(
      "relistAgent",
      { agent_id: 12 },
      { agent: { id: 12 } },
      () => relistAgent(auth, 12),
    );
    await expectApiOperation(
      "createDraftFromVersion",
      { agent_id: 12, version_no: 4 },
      { agent: { id: 12 } },
      () =>
        createDraftFromVersion(auth, 12, 4, {
          expected_draft_revision: 9,
          confirm_replace: true,
        }),
    );
    await expectApiOperation(
      "listAgentClients",
      { agent_id: 12 },
      { clients: [] },
      () => listAgentClients(auth, 12),
    );
    await expectApiOperation(
      "createAgentClient",
      { agent_id: 12 },
      {},
      () =>
        createAgentClient(auth, 12, {
          client_key: "web-primary",
          client_type: "web_chat",
          name: "Web",
        }),
    );
    await expectApiOperation(
      "updateAgentClient",
      { client_id: 7 },
      {},
      () => updateAgentClient(auth, 7, { expected_capability_hash: "cap-1" }),
    );
    await expectApiOperation(
      "disableAgentClient",
      { client_id: 7 },
      undefined,
      () => disableAgentClient(auth, 7),
    );
    await expectApiOperation(
      "getAgentClientRuntimeVersion",
      { client_id: 7 },
      { version, client_config: null },
      () => getAgentClientRuntimeVersion(auth, 7),
    );
    await expectApiOperation(
      "createAgentClientExport",
      { client_id: 7 },
      {},
      () => createAgentClientExport(auth, 7),
    );
    await expectApiOperation(
      "createAgentExport",
      { agent_id: 12 },
      {},
      () => createAgentExport(auth, 12),
    );

    expect(contract.operations.map((item) => item.id)).toHaveLength(14);
  });

  it("preserves projected concurrency, idempotency and Client update fields", async () => {
    const publishInput: PublishAgentVersionInput = {
      expected_draft_revision: 9,
      expected_current_version_id: 35,
      release_note: "契约候选",
      request_key: "request-key-1",
    };
    const publishOptions = await expectApiOperation(
      "publishAgentVersion",
      { agent_id: 12 },
      {},
      () => publishAgentVersion(auth, 12, publishInput),
    );
    expect(Object.keys(JSON.parse(publishOptions.body || "{}")).sort()).toEqual(
      [...operation("publishAgentVersion").request_required].sort(),
    );

    const restoreInput: CreateDraftFromVersionInput = {
      expected_draft_revision: 9,
      confirm_replace: true,
    };
    const restoreOptions = await expectApiOperation(
      "createDraftFromVersion",
      { agent_id: 12, version_no: 4 },
      { agent: {} },
      () => createDraftFromVersion(auth, 12, 4, restoreInput),
    );
    expect(Object.keys(JSON.parse(restoreOptions.body || "{}")).sort()).toEqual(
      [...operation("createDraftFromVersion").request_required].sort(),
    );

    const updateInput: UpdateAgentClientInput = {
      expected_capability_hash: "cap-1",
    };
    const updateOptions = await expectApiOperation(
      "updateAgentClient",
      { client_id: 7 },
      {},
      () => updateAgentClient(auth, 7, updateInput),
    );
    expect(Object.keys(JSON.parse(updateOptions.body || "{}"))).toEqual(
      operation("updateAgentClient").request_required,
    );

    const enableOptions = await expectApiOperation(
      "updateAgentClient",
      { client_id: 7 },
      {},
      () => enableAgentClient(auth, { id: 7, capability_hash: "cap-1" }),
    );
    expect(JSON.parse(enableOptions.body || "{}")).toEqual({
      expected_capability_hash: "cap-1",
      status: "enabled",
    });
  });

  it("keeps all projected stable version errors actionable", () => {
    expect(contract.stable_error_codes).toEqual([
      "CLIENT_CAPABILITIES_CHANGED",
      "CLIENT_INCOMPATIBLE",
      "CURRENT_VERSION_CHANGED",
      "DRAFT_CONFLICT",
      "DRAFT_HAS_UNPUBLISHED_CHANGES",
      "IDEMPOTENCY_CONFLICT",
      "NO_VERSION_CHANGES",
      "VERSION_NOT_FOUND",
      "VERSION_REVOKED",
    ]);

    for (const code of contract.stable_error_codes) {
      expect(
        versionErrorMessage(new ApiError("__unmapped_version_error__", 409, code)),
        code,
      ).not.toBe("__unmapped_version_error__");
    }
    expect(contract.error_envelopes).toEqual({
      version_lifecycle: { code: "data.code", message: "data.error" },
      export_and_respond_error_code: {
        code: "error.code",
        message: "error.message",
      },
    });
  });

  it("binds the compile-time request, runtime and export record shapes", () => {
    const publishKeys = [
      "expected_draft_revision",
      "expected_current_version_id",
      "release_note",
      "request_key",
    ] as const satisfies ReadonlyArray<keyof PublishAgentVersionInput>;
    const restoreKeys = [
      "expected_draft_revision",
      "confirm_replace",
    ] as const satisfies ReadonlyArray<keyof CreateDraftFromVersionInput>;
    const clientUpdateKeys = [
      "expected_capability_hash",
    ] as const satisfies ReadonlyArray<keyof UpdateAgentClientInput>;
    const runtimeKeys = [
      "version",
      "client_config",
      "current_version_id",
      "current_version_no",
      "current_version_hash",
    ] as const satisfies ReadonlyArray<keyof AgentClientRuntimeVersion>;
    const exportKeys = [
      "id",
      "uuid",
      "agent_id",
      "agent_version_id",
      "package_hash",
      "storage_path",
      "file_size",
      "exported_by",
      "exported_at",
    ] as const satisfies ReadonlyArray<keyof AgentClientExport>;

    expect(contract.type_contracts).toEqual({
      publish_input_required: publishKeys,
      restore_input_required: restoreKeys,
      client_update_required: clientUpdateKeys,
      runtime_version_required: runtimeKeys,
      export_record_required: exportKeys,
    });
    expectTypeOf<PublishAgentVersionInput>().toEqualTypeOf<{
      expected_draft_revision: number;
      expected_current_version_id: number | null;
      release_note: string;
      request_key: string;
    }>();
    expectTypeOf<AgentClientRuntimeVersion["version"]>().toEqualTypeOf<AgentVersion>();
    expectTypeOf<AgentClientExport["agent_client_id"]>().toEqualTypeOf<
      number | null | undefined
    >();
  });

  it("keeps runtime aliases derived from the platform current version", async () => {
    vi.mocked(apiRequest).mockResolvedValue({
      version,
      client_config: { channel: "web" },
    } as never);

    await expect(getAgentClientRuntimeVersion(auth, 7)).resolves.toEqual({
      version,
      client_config: { channel: "web" },
      current_version_id: version.id,
      current_version_no: version.version_no,
      current_version_hash: version.version_hash,
    });
    expect(contract.semantic_invariants.client_runtime_version).toContain(
      "platform current Agent version",
    );
  });

  it("keeps generic and Client-specific export creation semantics distinct", async () => {
    const generic = await expectApiOperation(
      "createAgentExport",
      { agent_id: 12 },
      {},
      () => createAgentExport(auth, 12),
    );
    const compatible = await expectApiOperation(
      "createAgentClientExport",
      { client_id: 7 },
      {},
      () => createAgentClientExport(auth, 7),
    );

    expect(generic.body).toBeUndefined();
    expect(compatible.body).toBeUndefined();
    expect(contract.semantic_invariants.generic_export).toContain(
      "no required Client association",
    );
    expect(contract.semantic_invariants.client_export).toContain(
      "compatibility operation",
    );
  });

  it("downloads the authenticated ZIP from the projected public endpoint", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(new Blob(["zip"]), {
          status: 200,
          headers: {
            "Content-Type": "application/zip",
            "Content-Disposition": 'attachment; filename="agent-12-v4.zip"',
          },
        }),
      ),
    );

    await expect(downloadAgentExport(auth, 128)).resolves.toMatchObject({
      filename: "agent-12-v4.zip",
    });
    const [url, options] = vi.mocked(fetch).mock.calls[0] as [
      string,
      { headers: Record<string, string>; method?: string },
    ];
    expect(new URL(url).pathname).toBe(
      materializePath(operation("downloadAgentExport").path, { export_id: 128 }),
    );
    expect(options.method || "GET").toBe(operation("downloadAgentExport").method);
    expect(options.headers).toMatchObject({
      "X-API-Key": "et_test_openapi",
      "X-Workspace-Code": "studio",
    });
    expect(url).not.toContain("storage_path");
    expect(contract.semantic_invariants.export_download).toContain(
      "storage_path remains internal",
    );
  });
});
