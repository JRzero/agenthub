import type { Agent, ExampleMessage } from "@/modules/agents/types";

export type BuildSectionId = "identity" | "persona" | "knowledge" | "skills" | "memory" | "runtime" | "safety" | "media" | "moments" | "motherland";
export type EditorTabId = "basics" | "examples" | "advanced";
export type BuildAgent = Agent;

export interface AgentBuildDraft {
  code: string;
  name: string;
  description: string;
  systemPrompt: string;
  examples: ExampleMessage[];
  skills: string[];
  knowledgeBaseId: number | null;
  memoryEnabled: boolean;
  agentType: "cloud" | "edge";
  llmProvider: string;
  llmProviderType: string;
  llmBaseUrl: string;
  llmModelName: string;
  llmTemperature: number | null;
  showReasoning: boolean;
  showTools: boolean;
  hidden: boolean;
}

export interface AgentBuildUpdateInput {
  code: string;
  name: string;
  description: string;
  system_prompt: string;
  examples: ExampleMessage[];
  skills: string[];
  knowledge_base_id: number | null;
  memory_enabled: boolean;
  agent_type: "cloud" | "edge";
  llm_provider: string;
  llm_provider_type: string;
  llm_base_url: string;
  llm_model_name: string;
  llm_temperature: number | null;
  show_reasoning: boolean;
  show_tools: boolean;
  hidden: boolean;
  status?: string;
}

export type DraftValidationErrors = Partial<Record<"name" | "code" | "systemPrompt" | "llmTemperature", string>>;

export function createBuildDraft(agent: BuildAgent): AgentBuildDraft {
  return { code: agent.code || "", name: agent.name || "", description: agent.description || "", systemPrompt: agent.system_prompt || agent.config?.system_prompt || "", examples: Array.isArray(agent.config?.examples) ? agent.config.examples : [], skills: Array.isArray(agent.config?.skills) ? agent.config.skills : [], knowledgeBaseId: agent.knowledge_base_id ?? null, memoryEnabled: Boolean(agent.memory_enabled), agentType: agent.agent_type || "cloud", llmProvider: agent.llm_provider || "", llmProviderType: agent.llm_provider_type || "", llmBaseUrl: agent.llm_base_url || "", llmModelName: agent.llm_model_name || agent.model || "", llmTemperature: agent.llm_temperature ?? agent.temperature ?? agent.config?.temperature ?? null, showReasoning: agent.config?.show_reasoning !== false, showTools: agent.config?.show_tools !== false, hidden: Boolean(agent.hidden) };
}

export function validateBuildDraft(draft: AgentBuildDraft): DraftValidationErrors {
  const errors: DraftValidationErrors = {};
  if (!draft.name.trim()) errors.name = "Agent 名称不能为空";
  if (!/^[a-z0-9_-]{2,64}$/.test(draft.code.trim().toLowerCase())) errors.code = "使用 2–64 位小写字母、数字、下划线或短横线";
  if (!draft.systemPrompt.trim()) errors.systemPrompt = "角色系统提示词不能为空";
  if (draft.llmTemperature !== null && (draft.llmTemperature < 0 || draft.llmTemperature > 2)) errors.llmTemperature = "Temperature 必须位于 0–2";
  return errors;
}

export function serializeBuildDraft(draft: AgentBuildDraft, status?: string): AgentBuildUpdateInput {
  return { code: draft.code.trim().toLowerCase(), name: draft.name.trim(), description: draft.description.trim(), system_prompt: draft.systemPrompt, examples: draft.examples.filter((item) => item.content.trim()), skills: draft.skills.map((item) => item.trim()).filter(Boolean), knowledge_base_id: draft.knowledgeBaseId, memory_enabled: draft.memoryEnabled, agent_type: draft.agentType, llm_provider: draft.llmProvider, llm_provider_type: draft.llmProviderType.trim(), llm_base_url: draft.llmBaseUrl.trim(), llm_model_name: draft.llmModelName.trim(), llm_temperature: draft.llmTemperature, show_reasoning: draft.showReasoning, show_tools: draft.showTools, hidden: draft.hidden, ...(status ? { status } : {}) };
}

export function draftsEqual(a: AgentBuildDraft, b: AgentBuildDraft): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
