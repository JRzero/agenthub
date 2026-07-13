"use client";

import { useParams } from "next/navigation";
import { AssetSectionPlaceholder } from "@/modules/agent-assets/asset-section-placeholder";

export default function DistributionPage() {
  const { agentId } = useParams<{ agentId: string }>();
  return <AssetSectionPlaceholder agentId={agentId} title="多端发行待接入" description="公开分享链接可以在后续迁移为首个真实发行渠道；Client Adapter、分层导出与 License Manifest 暂不执行生产写入。" />;
}
