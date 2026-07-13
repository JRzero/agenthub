import type { Agent } from "@/modules/agents/types";
import type { VersionDifference, VersionSnapshot } from "./types";

function snapshotFromAgent(agent: Agent): VersionSnapshot["snapshot"] {
  return {
    description: agent.description || "",
    model: agent.llm_model_name || agent.model || "系统默认",
    prompt: agent.system_prompt || agent.config?.system_prompt || "",
    temperature: agent.temperature ?? agent.config?.temperature ?? 0.7,
    memoryEnabled: agent.memory_enabled,
    knowledgeBaseId: agent.knowledge_base_id ?? null,
    skills: agent.config?.skills || [],
  };
}

export function buildCurrentVersion(agent: Agent): VersionSnapshot {
  return {
    id: `current-${agent.version}`,
    version: agent.version,
    label: `v${agent.version}.0`,
    status: "current",
    createdAt: agent.updated_at || "当前版本",
    createdBy: "当前 Creator",
    summary: "后端返回的 Agent 当前版本快照",
    snapshot: snapshotFromAgent(agent),
  };
}

export function buildDemoVersionHistory(agent: Agent): VersionSnapshot[] {
  const current = buildCurrentVersion(agent);
  const previousVersion = Math.max(1, agent.version - 1);
  const firstVersion = Math.max(1, previousVersion - 1);

  const previous: VersionSnapshot = {
    ...current,
    id: `demo-${previousVersion}`,
    version: previousVersion,
    label: `v${previousVersion}.0`,
    status: "published",
    createdAt: "2026-07-08 16:42",
    createdBy: "李然",
    summary: "优化安全边界与情绪承接策略",
    snapshot: {
      ...current.snapshot,
      prompt: "温柔、敏锐，善于承接用户情绪，并明确保持安全边界。",
      temperature: 0.65,
      skills: current.snapshot.skills.filter((skill) => skill !== "image_generation"),
    },
  };

  const initial: VersionSnapshot = {
    ...current,
    id: `demo-${firstVersion}`,
    version: firstVersion,
    label: `v${firstVersion}.0`,
    status: "archived",
    createdAt: "2026-07-05 11:18",
    createdBy: "李然",
    summary: "完成角色身份与基础对话能力",
    snapshot: {
      ...current.snapshot,
      description: "星海内容工作室的陪伴型数字角色",
      prompt: "以温和、清晰的方式陪伴用户对话。",
      temperature: 0.8,
      memoryEnabled: false,
      knowledgeBaseId: null,
      skills: [],
    },
  };

  if (previousVersion === firstVersion) return [current, previous];
  return [current, previous, initial];
}

function display(value: unknown): string {
  if (Array.isArray(value)) return value.length ? value.join("、") : "无";
  if (typeof value === "boolean") return value ? "开启" : "关闭";
  if (value === null || value === undefined || value === "") return "未设置";
  return String(value);
}

export function compareVersions(
  before: VersionSnapshot,
  after: VersionSnapshot,
): VersionDifference[] {
  const fields: Array<[keyof VersionSnapshot["snapshot"], string]> = [
    ["description", "资产描述"],
    ["model", "模型"],
    ["prompt", "系统提示词"],
    ["temperature", "温度"],
    ["memoryEnabled", "Memory"],
    ["knowledgeBaseId", "知识库"],
    ["skills", "技能"],
  ];

  return fields.map(([field, label]) => {
    const previous = display(before.snapshot[field]);
    const next = display(after.snapshot[field]);
    return { field, label, before: previous, after: next, changed: previous !== next };
  });
}

export function createDemoDraft(source: VersionSnapshot, version: number): VersionSnapshot {
  return {
    ...source,
    id: `demo-draft-${version}-${Date.now()}`,
    version,
    label: `v${version}.0-draft`,
    status: "draft",
    createdAt: "刚刚",
    createdBy: "李然",
    summary: `基于 ${source.label} 创建的演示草稿`,
    snapshot: { ...source.snapshot, skills: [...source.snapshot.skills] },
  };
}
