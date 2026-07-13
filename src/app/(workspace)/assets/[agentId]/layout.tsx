"use client";

import { useParams } from "next/navigation";
import { useAssetOverview } from "@/modules/agent-assets/use-asset-overview";
import { AssetWorkspaceHeader } from "@/modules/agent-assets/asset-workspace-header";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";

export default function AssetWorkspaceLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ agentId: string }>();
  const agentId = Number(params.agentId);
  const query = useAssetOverview(Number.isFinite(agentId) ? agentId : null);

  if (query.isLoading) return <LoadingState label="正在打开 Agent Asset…" />;
  if (query.isError || !query.overview) {
    return (
      <ErrorState
        message={query.error?.message || "没有找到这个 Agent Asset"}
        onRetry={() => void query.refetch()}
      />
    );
  }

  return (
    <div>
      <AssetWorkspaceHeader overview={query.overview} />
      {children}
    </div>
  );
}
