import type { Agent } from "@/modules/agents/types";
import type { KnowledgeBaseOption } from "./api";
import {
  BasicSectionFields,
  ExamplesEditor,
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
  onDraftConflict: () => Promise<void>;
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
  onDraftConflict,
}: BuildEditorPanelProps) {
  const special = section === "media";

  return (
    <section className="scrollbar-hidden min-h-0 min-w-0 bg-canvas lg:h-full lg:overflow-y-auto lg:overscroll-contain">
      <div className="mx-auto max-w-[920px] p-5 sm:p-7">
        <div className="mb-5">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-primary">Agent Studio</p>
          <h2 className="mt-1 text-2xl font-semibold">
            {BUILD_SECTION_LABELS[section]}
          </h2>
        </div>

        {section === "media" && (
          <MediaAssetsPanel
            agent={agent}
            draft={draft}
            onAgentUpdated={onAgentUpdated}
            onDraftConflict={onDraftConflict}
          />
        )}

        {!special && (
          <>
            {section !== "skills" && (
              <BasicSectionFields
                agentId={agent.id}
                section={section}
                draft={draft}
                errors={errors}
                knowledgeBases={knowledgeBases}
                knowledgeLoading={knowledgeLoading}
                onPatch={onPatch}
              />
            )}

            {section === "persona" && (
              <SectionGroup
                title="对话设定"
                description="配置新对话开场白，并用示例对话示范表达方式。"
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
              </>
            )}

            {section === "skills" && (
              <div>
                <StagedSkillsPanel agentId={agent.id} />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
