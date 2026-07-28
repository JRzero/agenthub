"use client";

import { useQuery } from "@tanstack/react-query";
import { DATA_MODE } from "@/config/capabilities";
import {
  demoClients,
  demoRuntime,
  demoVersion,
  demoVersions,
} from "@/fixtures/demo-version-management";
import { useAuth } from "@/modules/auth/auth-provider";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import {
  getAgentClientRuntimeVersion,
  getAgentVersion,
  listAgentClients,
  listAgentVersions,
} from "./api";

function useVersionAuth() {
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  return {
    apiKey: session?.apiKey || "",
    workspaceCode,
    enabled: Boolean(session?.apiKey) || DATA_MODE === "demo",
  };
}

export function useAgentVersions(agentId: number) {
  const { enabled, ...auth } = useVersionAuth();
  return useQuery({
    queryKey: ["agent-versions", agentId, auth.workspaceCode, DATA_MODE],
    queryFn: () =>
      DATA_MODE === "demo"
        ? Promise.resolve({ versions: demoVersions(agentId) })
        : listAgentVersions(auth, agentId),
    enabled: enabled && agentId > 0,
  });
}

export function useAgentVersion(agentId: number, versionNo: number | null) {
  const { enabled, ...auth } = useVersionAuth();
  return useQuery({
    queryKey: [
      "agent-version",
      agentId,
      versionNo,
      auth.workspaceCode,
      DATA_MODE,
    ],
    queryFn: () => {
      if (DATA_MODE !== "demo")
        return getAgentVersion(auth, agentId, versionNo || 0);
      const version = demoVersion(agentId, versionNo || 0);
      if (!version) throw new Error("未找到 Demo 版本");
      return Promise.resolve(version);
    },
    enabled: enabled && agentId > 0 && versionNo !== null,
  });
}

export function useAgentClients(agentId: number, queryEnabled = true) {
  const { enabled, ...auth } = useVersionAuth();
  return useQuery({
    queryKey: ["agent-version-clients", agentId, auth.workspaceCode, DATA_MODE],
    queryFn: () =>
      DATA_MODE === "demo"
        ? Promise.resolve({ clients: demoClients(agentId) })
        : listAgentClients(auth, agentId),
    enabled: enabled && queryEnabled && agentId > 0,
  });
}

export function useAgentClientRuntimeVersion(clientId: number | null) {
  const { enabled, ...auth } = useVersionAuth();
  return useQuery({
    queryKey: [
      "agent-client-runtime-version",
      clientId,
      auth.workspaceCode,
      DATA_MODE,
    ],
    queryFn: () => {
      if (DATA_MODE !== "demo")
        return getAgentClientRuntimeVersion(auth, clientId || 0);
      const runtime = demoRuntime(clientId || 0);
      if (!runtime) throw new Error("未找到 Demo Client");
      return Promise.resolve(runtime);
    },
    enabled: enabled && clientId !== null,
  });
}
