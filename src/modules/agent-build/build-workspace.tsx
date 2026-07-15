"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useRouter } from "next/navigation";
import { ArrowCounterClockwise, FloppyDisk, Play } from "@phosphor-icons/react";
import { BuildEditorPanel } from "./build-editor-panel";
import { resolveBuildPreviewLayout } from "./build-layout";
import { BuildPreview } from "./build-preview";
import { BuildSectionRail } from "./build-section-rail";
import { useBuildEditor } from "./use-build-editor";
import type { BuildSectionId } from "./types";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";
import { BUILD_HEADER_ACTIONS_ID } from "@/modules/agent-assets/asset-workspace-header";

export function BuildWorkspace() {
  const params = useParams<{ agentId: string }>();
  const router = useRouter();
  const agentId = Number(params.agentId);
  const editor = useBuildEditor(Number.isFinite(agentId) ? agentId : null);
  const [section, setSection] = useState<BuildSectionId>("persona");
  const [previewCollapsed, setPreviewCollapsed] = useState(false);
  const [actionsTarget, setActionsTarget] = useState<HTMLElement | null>(null);
  const previewLayout = resolveBuildPreviewLayout(previewCollapsed);

  useEffect(() => {
    setActionsTarget(document.getElementById(BUILD_HEADER_ACTIONS_ID));
  }, []);

  if (editor.isLoading || !editor.draft)
    return <LoadingState label="正在加载构建草稿…" />;
  if (editor.isError || !editor.data)
    return (
      <ErrorState
        message={editor.error?.message || "无法加载构建工作区"}
        onRetry={() => void editor.refetch()}
      />
    );

  const saveAndTest = async () => {
    const saved = await editor.save();
    if (saved) router.push(`/assets/${agentId}/test`);
  };

  return (
    <>
      {actionsTarget &&
        createPortal(
          <div className="flex items-center gap-2">
            <span className="sr-only" aria-live="polite">
              {editor.dirty ? "有未保存更改" : "已同步最新版本"}
            </span>
            {editor.saveError && (
              <p className="hidden max-w-48 text-xs text-danger xl:block">
                {editor.saveError}
              </p>
            )}
            <button
              type="button"
              onClick={editor.reset}
              disabled={!editor.dirty || editor.saving}
              className="button-secondary min-h-9 px-3"
            >
              <ArrowCounterClockwise size={16} />
              重置
            </button>
            <button
              type="button"
              onClick={() => void editor.save("draft")}
              disabled={!editor.dirty || editor.saving}
              className="button-secondary min-h-9 px-3"
            >
              <FloppyDisk size={16} />
              {editor.saving ? "保存中…" : "保存草稿"}
            </button>
            <button
              type="button"
              onClick={() => void saveAndTest()}
              disabled={editor.saving}
              className="button-primary min-h-9 px-3"
            >
              <Play size={16} />
              保存并测试
            </button>
          </div>,
          actionsTarget,
        )}
      <div className="-mx-4 min-w-0 sm:-mx-6 lg:-mx-7">
        <div
          className={`grid min-w-0 grid-cols-1 border-b border-border transition-[grid-template-columns] duration-200 lg:grid-cols-[196px_minmax(0,1fr)] ${previewLayout.gridClass}`}
        >
          <BuildSectionRail
            agentId={agentId}
            active={section}
            onChange={setSection}
          />
          <BuildEditorPanel
            section={section}
            agent={editor.data}
            draft={editor.draft}
            errors={editor.validationErrors}
            knowledgeBases={editor.knowledgeBases}
            knowledgeLoading={editor.knowledgeLoading}
            onPatch={editor.patchDraft}
            onAgentUpdated={editor.applyAgentUpdate}
          />
          <BuildPreview
            agent={editor.data}
            draft={editor.draft}
            dirty={editor.dirty}
            collapsed={previewCollapsed}
            onToggleCollapsed={() => setPreviewCollapsed((current) => !current)}
          />
        </div>
      </div>
    </>
  );
}
