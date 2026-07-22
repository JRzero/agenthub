"use client";

import { useParams, usePathname } from "next/navigation";
import { useAssetOverview } from "@/modules/agent-assets/use-asset-overview";
import { AssetWorkspaceHeader } from "@/modules/agent-assets/asset-workspace-header";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";

export default function AssetWorkspaceLayout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ agentId: string }>();
  const pathname = usePathname();
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

  const buildRoute = pathname === `/assets/${agentId}/build`;

  return (
    <div className={buildRoute ? "flex h-full min-h-0 flex-col" : undefined}>
      <AssetWorkspaceHeader overview={query.overview} />
      <div className={buildRoute ? "min-h-0 min-w-0 flex-1 pt-4" : "pt-4"}>{children}</div>
    </div>
  );
}
