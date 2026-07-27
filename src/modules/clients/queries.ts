"use client";

import { useQueries } from "@tanstack/react-query";
import { DATA_MODE } from "@/config/capabilities";
import { demoClients } from "@/fixtures/demo-version-management";
import { listAgentClients } from "@/modules/agent-versions/api";
import { useAgents } from "@/modules/agents/queries";
import { useAuth } from "@/modules/auth/auth-provider";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { createWorkspaceAgentClient } from "./model";

export function useWorkspaceAgentClients() {
  const agentsQuery = useAgents();
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const agents = agentsQuery.data || [];
  const clientQueries = useQueries({
    queries: agents.map((agent) => ({
      queryKey: [
        "agent-version-clients",
        agent.id,
        workspaceCode,
        DATA_MODE,
      ],
      queryFn: () =>
        DATA_MODE === "demo"
          ? Promise.resolve({ clients: demoClients(agent.id) })
          : listAgentClients(
              { apiKey: session?.apiKey || "", workspaceCode },
              agent.id,
            ),
      enabled: Boolean(session?.apiKey),
    })),
  });

  const rows = clientQueries.flatMap((query, index) => {
    const agent = agents[index];
    if (!agent) return [];
    return (query.data?.clients || []).map((client) =>
      createWorkspaceAgentClient(agent, client),
    );
  });
  const failures = clientQueries.flatMap((query, index) => {
    const agent = agents[index];
    if (!agent || !query.isError) return [];
    return [
      {
        agent,
        message:
          query.error instanceof Error
            ? query.error.message
            : "Client 接入记录加载失败",
        retry: query.refetch,
      },
    ];
  });

  return {
    agents,
    rows,
    failures,
    isLoading:
      agentsQuery.isLoading ||
      clientQueries.some((query) => query.isLoading),
    isFetching: clientQueries.some((query) => query.isFetching),
    agentsError:
      agentsQuery.error instanceof Error ? agentsQuery.error : null,
    retryAgents: agentsQuery.refetch,
    refetchAll: () =>
      Promise.all(clientQueries.map((query) => query.refetch())),
  };
}
