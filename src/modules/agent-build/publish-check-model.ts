import type { AgentClient } from "@/modules/agent-versions/types";
import type { PublishTestSummary } from "@/modules/agent-test/publish-test-summary";
import type { KnowledgeBaseOption } from "./api";
import {
  validateBuildDraft,
  type AgentBuildDraft,
  type BuildSectionId,
} from "./types";

export type PublishCheckState =
  | "passed"
  | "blocked"
  | "pending"
  | "informational";

export type PublishCheckAction =
  | { label: string; kind: "section"; target: BuildSectionId }
  | { label: string; kind: "test"; target: "test" };

export interface PublishCheckItem {
  id: "basics" | "resources" | "testing" | "impact";
  label: string;
  state: PublishCheckState;
  status: string;
  detail?: string;
  blocking: boolean;
  action?: PublishCheckAction;
}

export interface PublishCheckResult {
  items: PublishCheckItem[];
  blockers: number;
  canContinue: boolean;
}

export interface PublishActionState {
  label: "发布为新版本" | "查看发布检查" | "继续发布";
  intent: "open-check" | "continue";
  disabled: boolean;
  title: string;
}

interface PublishCheckInput {
  draft: AgentBuildDraft;
  dirty: boolean;
  knowledgeBases: KnowledgeBaseOption[];
  knowledgeLoading: boolean;
  knowledgeError: boolean;
  testSummary: PublishTestSummary | null;
  clients: AgentClient[];
  clientsLoading: boolean;
  clientsError: boolean;
}

function resolveBasicCheck(
  draft: AgentBuildDraft,
  dirty: boolean,
): PublishCheckItem {
  if (dirty) {
    return {
      id: "basics",
      label: "基础配置",
      state: "blocked",
      status: "1 项待处理",
      detail: "请先保存当前更改",
      blocking: true,
    };
  }

  const errors = validateBuildDraft(draft);
  const entries = Object.entries(errors);
  if (!entries.length) {
    return {
      id: "basics",
      label: "基础配置",
      state: "passed",
      status: "已通过",
      blocking: false,
    };
  }

  const [field, detail] = entries[0];
  const target: BuildSectionId =
    field === "systemPrompt"
      ? "persona"
      : field === "llmTemperature"
        ? "runtime"
        : "identity";
  return {
    id: "basics",
    label: "基础配置",
    state: "blocked",
    status: `${entries.length} 项待处理`,
    detail,
    blocking: true,
    action: { label: "去完善", kind: "section", target },
  };
}

function resolveResourceCheck(
  draft: AgentBuildDraft,
  knowledgeBases: KnowledgeBaseOption[],
  loading: boolean,
  failed: boolean,
): PublishCheckItem {
  if (loading) {
    return {
      id: "resources",
      label: "能力与资源",
      state: "pending",
      status: "检查中",
      blocking: false,
    };
  }
  if (failed) {
    return {
      id: "resources",
      label: "能力与资源",
      state: "informational",
      status: "暂无法确认",
      detail: "发布时仍会执行服务端检查",
      blocking: false,
    };
  }
  if (
    draft.knowledgeBaseId !== null &&
    !knowledgeBases.some((item) => item.id === draft.knowledgeBaseId)
  ) {
    return {
      id: "resources",
      label: "能力与资源",
      state: "blocked",
      status: "1 项待处理",
      detail: "已绑定的知识库不可用",
      blocking: true,
      action: { label: "去完善", kind: "section", target: "knowledge" },
    };
  }
  return {
    id: "resources",
    label: "能力与资源",
    state: "passed",
    status: "已通过",
    blocking: false,
  };
}

function resolveTestCheck(
  summary: PublishTestSummary | null,
): PublishCheckItem {
  if (!summary) {
    return {
      id: "testing",
      label: "测试与安全",
      state: "informational",
      status: "尚未测试",
      detail: "建议发布前测试当前草稿",
      blocking: false,
      action: { label: "前往测试", kind: "test", target: "test" },
    };
  }
  if (!summary.safetyPassed) {
    return {
      id: "testing",
      label: "测试与安全",
      state: "blocked",
      status: "1 项待处理",
      detail: `已通过 ${summary.passed} / ${summary.total}，安全边界待完善`,
      blocking: true,
      action: { label: "查看结果", kind: "test", target: "test" },
    };
  }
  return {
    id: "testing",
    label: "测试与安全",
    state: "passed",
    status: "已通过",
    detail: `通过 ${summary.passed} / ${summary.total}`,
    blocking: false,
    action: { label: "查看结果", kind: "test", target: "test" },
  };
}

function resolveImpactCheck(
  clients: AgentClient[],
  loading: boolean,
  failed: boolean,
): PublishCheckItem {
  if (loading) {
    return {
      id: "impact",
      label: "线上影响",
      state: "pending",
      status: "确认中",
      blocking: false,
    };
  }
  if (failed) {
    return {
      id: "impact",
      label: "线上影响",
      state: "informational",
      status: "暂无法确认",
      detail: "发布时仍会执行服务端检查",
      blocking: false,
    };
  }
  const enabled = clients.filter((client) => client.status === "enabled").length;
  return {
    id: "impact",
    label: "线上影响",
    state: "informational",
    status: `${enabled} 个 Client`,
    detail: enabled ? "发布后使用新版本" : "当前没有已启用 Client",
    blocking: false,
  };
}

export function derivePublishCheck({
  draft,
  dirty,
  knowledgeBases,
  knowledgeLoading,
  knowledgeError,
  testSummary,
  clients,
  clientsLoading,
  clientsError,
}: PublishCheckInput): PublishCheckResult {
  const items = [
    resolveBasicCheck(draft, dirty),
    resolveResourceCheck(
      draft,
      knowledgeBases,
      knowledgeLoading,
      knowledgeError,
    ),
    resolveTestCheck(testSummary),
    resolveImpactCheck(clients, clientsLoading, clientsError),
  ];
  const blockers = items.filter((item) => item.blocking).length;
  return { items, blockers, canContinue: blockers === 0 };
}

export function resolvePublishActionState({
  publishCheckEnabled,
  panelMode,
  dirty,
  saving,
  canContinue,
}: {
  publishCheckEnabled: boolean;
  panelMode: "preview" | "publish-check";
  dirty: boolean;
  saving: boolean;
  canContinue: boolean;
}): PublishActionState {
  const inCheck = publishCheckEnabled && panelMode === "publish-check";
  const label = inCheck
    ? "继续发布"
    : publishCheckEnabled
      ? "查看发布检查"
      : "发布为新版本";
  const disabled = saving || dirty || (inCheck && !canContinue);
  const title = dirty
    ? "请先保存当前草稿"
    : inCheck && !canContinue
      ? "请先完成发布检查中的待处理项"
      : inCheck
        ? "继续前往版本管理发布"
        : "先检查当前草稿是否可发布";
  return {
    label,
    intent: inCheck ? "continue" : "open-check",
    disabled,
    title,
  };
}
