import type { Agent } from "@/modules/agents/types";
import type { KnowledgeBaseOption } from "./api";
import {
  BasicSectionFields,
  ExamplesEditor,
  RuntimeDisplaySettings,
} from "./build-fields";
import { MediaAssetsPanel } from "./media-assets-panel";
import { MomentsPanel } from "./moments-panel";
import { BUILD_SECTION_LABELS } from "./professional-navigation";
import { RuntimeCapabilitiesPanel } from "./runtime-capabilities-panel";
import { StagedSkillsPanel } from "./staged-skills-panel";
import type {
  AgentBuildDraft,
  BuildSectionId,
  DraftValidationErrors,
} from "./types";

interface BuildEditorPanelProps {
  section: BuildSectionId;
  agent: Agent;
  draft: AgentBuildDraft;
  errors: DraftValidationErrors;
  knowledgeBases: KnowledgeBaseOption[];
  knowledgeLoading: boolean;
  onPatch: (patch: Partial<AgentBuildDraft>) => void;
  onAgentUpdated: (agent: Agent) => void;
}

function SectionGroup({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 border-t border-border pt-7">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-text-strong">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-text-muted">{description}</p>
      </div>
      {children}
    </div>
  );
}

export function BuildEditorPanel({
  section,
  agent,
  draft,
  errors,
  knowledgeBases,
  knowledgeLoading,
  onPatch,
  onAgentUpdated,
}: BuildEditorPanelProps) {
  const special = section === "media" || section === "moments";

  return (
    <section className="min-w-0 bg-surface">
      <div className="p-5 sm:p-7">
        <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <span className="font-medium">
            {agent.current_version_id
              ? "平台仍运行 v" +
                agent.version +
                "；草稿发布前不会影响 Client 或已有会话"
              : "当前尚未发布；草稿发布前不会被 Client 或新会话使用"}
          </span>
          <span className="ml-auto text-xs text-blue-600">
            草稿 Hash：发布后生成
          </span>
        </div>
        <div className="mb-5">
          <h2 className="text-xl font-semibold">
            {BUILD_SECTION_LABELS[section]}
          </h2>
        </div>

        {section === "media" && (
          <MediaAssetsPanel
            agent={agent}
            draft={draft}
            onAgentUpdated={onAgentUpdated}
          />
        )}

        {section === "moments" && (
          <MomentsPanel agentId={agent.id} agentName={agent.name} />
        )}

        {!special && (
          <>
            <BasicSectionFields
              agentId={agent.id}
              section={section}
              draft={draft}
              errors={errors}
              knowledgeBases={knowledgeBases}
              knowledgeLoading={knowledgeLoading}
              onPatch={onPatch}
            />

            {section === "persona" && (
              <SectionGroup
                title="示例对话"
                description="用典型的用户与 Agent 对话示范表达方式。"
              >
                <ExamplesEditor draft={draft} onPatch={onPatch} />
              </SectionGroup>
            )}

            {section === "runtime" && (
              <>
                <RuntimeCapabilitiesPanel
                  agent={agent}
                  draft={draft}
                  onPatch={onPatch}
                  onAgentUpdated={onAgentUpdated}
                />
                <SectionGroup
                  title="输出与调试显示"
                  description="控制运行端是否展示推理过程和工具调用，不改变模型本身的生成能力。"
                >
                  <RuntimeDisplaySettings draft={draft} onPatch={onPatch} />
                </SectionGroup>
              </>
            )}

            {section === "skills" && (
              <div className="mt-7 border-t border-border pt-7">
                <StagedSkillsPanel agentId={agent.id} />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
