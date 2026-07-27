import { describe, expect, it } from "vitest";
import type { AgentClient } from "@/modules/agent-versions/types";
import type { Agent } from "@/modules/agents/types";
import {
  createWorkspaceAgentClient,
  filterWorkspaceAgentClients,
  resolveClientSyncStatus,
} from "./model";

const agent = {
  id: 32,
  name: "林月",
  current_version_id: 104,
} as Agent;

function client(
  input: Partial<AgentClient> & Pick<AgentClient, "id" | "name">,
): AgentClient {
  return {
    uuid: `client-${input.id}`,
    agent_id: 32,
    client_key: `key-${input.id}`,
    client_type: "web_chat",
    status: "enabled",
    config: null,
    capability_manifest: null,
    capability_hash: "hash",
    created_at: "",
    updated_at: "",
    ...input,
  };
}

describe("workspace AgentClient model", () => {
  it("resolves sync states without merging repeated labels", () => {
    const rows = [
      client({ id: 1, name: "OyiiOyii", last_ack_version_id: 104 }),
      client({ id: 2, name: "OyiiOyii", last_ack_version_id: 103 }),
    ].map((item) => createWorkspaceAgentClient(agent, item));

    expect(rows.map((row) => row.client.id)).toEqual([1, 2]);
    expect(rows.map((row) => row.syncStatus)).toEqual(["synced", "pending"]);
  });

  it("treats disabled and never-confirmed records explicitly", () => {
    expect(
      resolveClientSyncStatus(
        client({ id: 1, name: "本地端", status: "disabled" }),
        104,
      ),
    ).toBe("disabled");
    expect(
      resolveClientSyncStatus(client({ id: 2, name: "新端" }), 104),
    ).toBe("unconfirmed");
  });

  it("filters by text, Agent, type, state and sync state", () => {
    const rows = [
      createWorkspaceAgentClient(
        agent,
        client({ id: 1, name: "OyiiOyii", last_ack_version_id: 104 }),
      ),
      createWorkspaceAgentClient(
        { ...agent, id: 19, name: "知识向导" },
        client({
          id: 2,
          agent_id: 19,
          name: "本地体验端",
          client_type: "local_desktop",
          status: "disabled",
        }),
      ),
    ];

    expect(
      filterWorkspaceAgentClients(rows, {
        query: "知识",
        agentId: 19,
        clientType: "local_desktop",
        status: "disabled",
        syncStatus: "disabled",
      }).map((row) => row.client.id),
    ).toEqual([2]);
  });
});
