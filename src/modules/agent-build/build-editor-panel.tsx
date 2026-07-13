import type { Agent } from "@/modules/agents/types";
import type { KnowledgeBaseOption } from "./api";
import { AgentAvatarEditor } from "./agent-avatar-editor";
import { AdvancedRulesEditor, BasicSectionFields, ExamplesEditor } from "./build-fields";
import { BUILD_SECTIONS } from "./build-section-rail";
import { CharacterDesignPanel } from "./character-design-panel";
import { MomentsPanel } from "./moments-panel";
import { MotherlandChatPanel } from "./motherland-chat-panel";
import { RuntimeCapabilitiesPanel } from "./runtime-capabilities-panel";
import { StagedSkillsPanel } from "./staged-skills-panel";
import type { AgentBuildDraft, BuildSectionId, DraftValidationErrors, EditorTabId } from "./types";

const tabs: Array<{ id: EditorTabId; label: string }> = [
  { id: "basics", label: "基础设定" }, { id: "examples", label: "示例对话" }, { id: "advanced", label: "高级规则" },
];

export function BuildEditorPanel({ section, tab, agent, draft, errors, knowledgeBases, knowledgeLoading, onTabChange, onPatch, onAgentUpdated }: { section: BuildSectionId; tab: EditorTabId; agent: Agent; draft: AgentBuildDraft; errors: DraftValidationErrors; knowledgeBases: KnowledgeBaseOption[]; knowledgeLoading: boolean; onTabChange: (tab: EditorTabId) => void; onPatch: (patch: Partial<AgentBuildDraft>) => void; onAgentUpdated: (agent: Agent) => void }) {
  const sectionLabel = BUILD_SECTIONS.find((item) => item.id === section)?.label;
  const special = section === "media" || section === "moments" || section === "motherland";
  return <section className="min-w-0 bg-surface"><div className="border-b border-border px-5 sm:px-7"><div className="flex gap-8 overflow-x-auto">{tabs.map((item) => <button key={item.id} type="button" aria-pressed={tab === item.id} onClick={() => onTabChange(item.id)} className={`relative whitespace-nowrap px-1 py-4 text-sm font-medium ${tab === item.id ? "text-primary" : "text-text-muted hover:text-text-strong"}`}>{item.label}{tab === item.id && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-primary" />}</button>)}</div></div><div className="p-5 sm:p-7"><div className="mb-6"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Build section</p><h2 className="mt-2 text-xl font-semibold">{tab === "basics" ? sectionLabel : tabs.find((item) => item.id === tab)?.label}</h2></div>{tab === "basics" && section === "media" && <AgentAvatarEditor agent={agent} onUpdated={onAgentUpdated} />}{tab === "basics" && section === "moments" && <MomentsPanel agentId={agent.id} agentName={agent.name} />}{tab === "basics" && section === "motherland" && <div className="space-y-7"><MotherlandChatPanel agentId={agent.id} draft={draft} onPatch={onPatch} /><CharacterDesignPanel agent={agent} draft={draft} onAgentUpdated={onAgentUpdated} /></div>}{tab === "basics" && !special && <><BasicSectionFields section={section} draft={draft} errors={errors} knowledgeBases={knowledgeBases} knowledgeLoading={knowledgeLoading} onPatch={onPatch} />{section === "runtime" && <RuntimeCapabilitiesPanel agent={agent} draft={draft} onPatch={onPatch} onAgentUpdated={onAgentUpdated} />}{section === "skills" && <div className="mt-7 border-t border-border pt-7"><StagedSkillsPanel agentId={agent.id} /></div>}</>}{tab === "examples" && <ExamplesEditor draft={draft} onPatch={onPatch} />}{tab === "advanced" && <AdvancedRulesEditor draft={draft} onPatch={onPatch} />}</div></section>;
}
