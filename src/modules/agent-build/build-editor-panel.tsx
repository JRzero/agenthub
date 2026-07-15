import type { Agent } from "@/modules/agents/types";
import type { KnowledgeBaseOption } from "./api";
import {
  BasicSectionFields,
  ExamplesEditor,
  RuntimeDisplaySettings,
} from "./build-fields";
import { MediaAssetsPanel } from "./media-assets-panel";
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
  const special = section === "media";

  return (
    <section className="min-w-0 bg-surface">
      <div className="p-5 sm:p-7">
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

        {!special && (
          <>
            <BasicSectionFields
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
