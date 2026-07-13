"use client";

import { useParams } from "next/navigation";
import { AssetSectionPlaceholder } from "@/modules/agent-assets/asset-section-placeholder";

export default function TestPage() {
  const { agentId } = useParams<{ agentId: string }>();
  return <AssetSectionPlaceholder agentId={agentId} title="测试与评估迁移中" description="现有 simulateAgent 和流式会话接口保持可用；新测试场景、评估结果与跨 Client 对比不会在后端接口就绪前伪造为真实能力。" />;
}
