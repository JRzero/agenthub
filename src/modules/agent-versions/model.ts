import type { Agent } from "@/modules/agents/types";
import type { CreatorProfile } from "@/modules/settings/types";
import { ApiError } from "@/shared/api/http-client";
import type { AgentVersion, VersionDifference, VersionSnapshot } from "./types";

export function versionErrorMessage(error: unknown) {
  if (!(error instanceof ApiError)) {
    return error instanceof Error ? error.message : "操作失败，请重试";
  }
  const messages: Record<string, string> = {
    DRAFT_CONFLICT:
      "草稿内容已被其他操作更新，已刷新最新状态。请检查后重新发布。",
    DRAFT_HAS_UNPUBLISHED_CHANGES:
      "当前草稿有未发布修改，确认后可用所选历史版本替换草稿。",
    NO_VERSION_CHANGES: "当前草稿与平台当前版本没有差异，无需重复发布。",
    CURRENT_VERSION_CHANGED: "平台当前版本已变化，请刷新后重新确认发布。",
    IDEMPOTENCY_CONFLICT: "本次发布请求与先前内容不一致，请重新发起发布。",
    CLIENT_INCOMPATIBLE: "有 Client 与当前草稿不兼容，请先处理能力配置。",
    CLIENT_CAPABILITIES_CHANGED: "Client 能力已变化，请刷新后重新检查。",
    VERSION_REVOKED: "该历史版本已撤销，不能用于创建草稿。",
    VERSION_NOT_FOUND: "未找到该版本，请刷新列表。",
  };
  return (error.code && messages[error.code]) || error.message;
}

type SkillReference = {
  id?: number;
  skill_id?: number;
  skill_name?: string;
  name?: string;
};

function normalizeSkillName(value?: string) {
  return value?.trim().toLowerCase() || "";
}

export function countSkillReferences(
  configuredSkills: readonly string[] = [],
  boundSkills: readonly SkillReference[] = [],
): number {
  const references = new Set<string>();

  configuredSkills.forEach((skill) => {
    const name = normalizeSkillName(skill);
    if (name) references.add(`name:${name}`);
  });

  boundSkills.forEach((skill) => {
    const name = normalizeSkillName(skill.skill_name || skill.name);
    if (name) {
      references.add(`name:${name}`);
    } else if (skill.skill_id) {
      references.add(`skill:${skill.skill_id}`);
    } else if (skill.id) {
      references.add(`creator-skill:${skill.id}`);
    }
  });

  return references.size;
}

function arrayValue(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function recordValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function resolveVersionResourceCounts(version: AgentVersion) {
  const manifest = recordValue(version.resource_manifest);
  const snapshot = recordValue(version.config_snapshot);
  const config = recordValue(snapshot.config);
  const configuredSkills = arrayValue(config.skills).filter(
    (skill): skill is string => typeof skill === "string",
  );
  const manifestSkills = arrayValue(manifest.skills).filter(
    (skill): skill is SkillReference =>
      Boolean(skill && typeof skill === "object" && !Array.isArray(skill)),
  );
  const knowledgeDocuments = arrayValue(manifest.knowledge_documents);

  return {
    skillCount: countSkillReferences(configuredSkills, manifestSkills),
    knowledgeCount:
      knowledgeDocuments.length || (snapshot.knowledge_base_id ? 1 : 0),
    mediaCount: arrayValue(manifest.media).length,
  };
}

export function resolveVersionPublisher(
  version: Pick<
    AgentVersion,
    "created_by" | "created_by_name" | "created_by_username"
  >,
  profile?: CreatorProfile | null,
  sessionUsername?: string | null,
): string {
  const responseName =
    version.created_by_name?.trim() || version.created_by_username?.trim();
  if (responseName) return responseName;

  if (profile && version.created_by === profile.id) {
    return profile.metadata?.full_name?.trim() || profile.username;
  }

  if (!profile && sessionUsername?.trim()) return sessionUsername.trim();
  return "未知用户";
}

export function resolveDraftBaseVersionNumber(
  agent: Pick<
    Agent,
    "version" | "current_version_id" | "draft_base_version_id"
  >,
  versions: Array<Pick<AgentVersion, "id" | "version_no">>,
): number | null {
  if (!agent.draft_base_version_id) return null;
  const baseVersion = versions.find(
    (version) => version.id === agent.draft_base_version_id,
  );
  if (baseVersion) return baseVersion.version_no;
  if (agent.draft_base_version_id === agent.current_version_id) {
    return agent.version;
  }
  return null;
}

export function resolveVersionSummary(
  releaseNote?: string | null,
  changeSummary?: Record<string, unknown> | null,
): string {
  const note = releaseNote?.trim();
  if (note) return note;

  const summary = changeSummary?.summary;
  if (typeof summary === "string" && summary.trim()) {
    return summary.trim();
  }

  return "-";
}

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
      skills: current.snapshot.skills.filter(
        (skill) => skill !== "image_generation",
      ),
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
    return {
      field,
      label,
      before: previous,
      after: next,
      changed: previous !== next,
    };
  });
}

export function createDemoDraft(
  source: VersionSnapshot,
  version: number,
): VersionSnapshot {
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
