import type { CapabilitySource } from "@/config/capabilities";
import type { Agent } from "@/modules/agents/types";

export type AssetSectionId =
  | "identity"
  | "knowledge"
  | "skills"
  | "memory"
  | "media"
  | "runtime"
  | "safety";

export interface AssetSection {
  id: AssetSectionId;
  label: string;
  description: string;
  score: number | null;
  state: "complete" | "partial" | "unavailable";
}

export interface ClientAdapter {
  id: string;
  name: string;
  version: string;
  status: "running" | "outdated" | "draft";
  publishedAt?: string;
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  detail: string;
  time: string;
  tone: "update" | "publish" | "warning";
}

export interface AgentAssetOverview {
  agent: Agent;
  versionLabel: string;
  completeness: number;
  completenessSource: CapabilitySource;
  sections: AssetSection[];
  adapters: ClientAdapter[];
  adapterSource: CapabilitySource;
  activities: ActivityItem[];
}

function scoreState(score: number): AssetSection["state"] {
  if (score >= 100) return "complete";
  return "partial";
}

export function mapAgentToAssetOverview(
  agent: Agent,
  options: {
    adapters?: ClientAdapter[];
    activities?: ActivityItem[];
    adapterSource?: CapabilitySource;
    completenessOverride?: number;
  } = {},
): AgentAssetOverview {
  const identityScore =
    (agent.name ? 25 : 0) +
    (agent.description ? 25 : 0) +
    (agent.system_prompt || agent.config?.system_prompt ? 35 : 0) +
    (agent.config?.examples?.length ? 15 : 0);
  const knowledgeScore = agent.knowledge_base_id ? 100 : 0;
  const skillsScore = agent.config?.skills?.length ? 100 : 0;
  const memoryScore = agent.memory_enabled ? 80 : 0;
  const mediaScore =
    agent.config?.metadata?.avatar || agent.config?.metadata?.character_design_sheet
      ? 100
      : 0;
  const runtimeScore = agent.llm_model_name || agent.llm_provider || agent.model ? 90 : 0;

  const sections: AssetSection[] = [
    {
      id: "identity",
      label: "身份与人设",
      description: "角色定位、说话风格、行为准则、价值观",
      score: identityScore,
      state: scoreState(identityScore),
    },
    {
      id: "runtime",
      label: "运行配置",
      description: "模型、参数、提示词、开关配置",
      score: runtimeScore,
      state: scoreState(runtimeScore),
    },
    {
      id: "skills",
      label: "技能",
      description: "内置技能、工作流、工具集",
      score: skillsScore,
      state: scoreState(skillsScore),
    },
    {
      id: "knowledge",
      label: "知识",
      description: "知识库、术语表、数据集",
      score: knowledgeScore,
      state: scoreState(knowledgeScore),
    },
    {
      id: "memory",
      label: "记忆策略",
      description: "记忆策略、摘要规则、保留周期",
      score: memoryScore,
      state: scoreState(memoryScore),
    },
    {
      id: "media",
      label: "媒体资产",
      description: "图片、音频、视频、文档",
      score: mediaScore,
      state: scoreState(mediaScore),
    },
    {
      id: "safety",
      label: "安全边界",
      description: "内容安全、权限控制、合规策略",
      score: null,
      state: "unavailable",
    },
  ];

  const numericScores = sections.flatMap((section) =>
    section.score === null ? [] : [section.score],
  );
  const derivedCompleteness = Math.round(
    numericScores.reduce((sum, score) => sum + score, 0) /
      Math.max(numericScores.length, 1),
  );

  return {
    agent,
    versionLabel: `v${agent.version || 1}.0`,
    completeness: options.completenessOverride ?? derivedCompleteness,
    completenessSource: "derived",
    sections,
    adapters: options.adapters || [],
    adapterSource: options.adapterSource || "unavailable",
    activities: options.activities || [],
  };
}
