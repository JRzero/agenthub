"use client";

import { useParams } from "next/navigation";
import { useAgent } from "@/modules/agents/queries";
import { VersionsWorkspace } from "@/modules/agent-versions/versions-workspace";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";

export default function VersionsPage() {
  const params = useParams<{ agentId: string }>();
  const agentId = Number(params.agentId);
  const query = useAgent(Number.isFinite(agentId) ? agentId : null);

  if (query.isLoading) return <LoadingState label="正在读取版本信息…" />;
  if (query.isError || !query.data) {
    return <ErrorState message={query.error?.message || "没有找到版本信息"} onRetry={() => void query.refetch()} />;
  }

  return <VersionsWorkspace agent={query.data} />;
}
