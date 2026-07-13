"use client";

import { useParams } from "next/navigation";
import { AssetSectionPlaceholder } from "@/modules/agent-assets/asset-section-placeholder";

export default function BuildPage() {
  const { agentId } = useParams<{ agentId: string }>();
  return <AssetSectionPlaceholder agentId={agentId} title="构建工作区迁移中" description="旧 Creator 的身份、人设、知识、技能、Memory 与运行配置能力已经完成契约盘点，将在下一纵切拆分为独立构建模块。" />;
}
