"use client";

import { useParams } from "next/navigation";
import { ActivityPanel } from "@/modules/agent-assets/activity-panel";
import { AdapterPanel } from "@/modules/agent-assets/adapter-panel";
import { AssetCompositionPanel } from "@/modules/agent-assets/asset-composition-panel";
import { useAssetOverview } from "@/modules/agent-assets/use-asset-overview";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";

export default function AgentAssetOverviewPage() {
  const params = useParams<{ agentId: string }>();
  const agentId = Number(params.agentId);
  const query = useAssetOverview(Number.isFinite(agentId) ? agentId : null);

  if (query.isLoading) return <LoadingState />;
  if (query.isError || !query.overview) {
    return (
      <ErrorState
        message={query.error?.message || "没有找到这个 Agent Asset"}
        onRetry={() => void query.refetch()}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.45fr)_minmax(380px,0.8fr)]">
      <AssetCompositionPanel sections={query.overview.sections} />
      <AdapterPanel adapters={query.overview.adapters} source={query.overview.adapterSource} />
      <ActivityPanel activities={query.overview.activities} />
    </div>
  );
}
