"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowCounterClockwise,
  ChatCircle,
  FloppyDisk,
  PaperPlaneTilt,
  Play,
} from "@phosphor-icons/react";
import { BuildEditorPanel } from "./build-editor-panel";
import { resolveBuildPreviewLayout } from "./build-layout";
import { BuildPreview } from "./build-preview";
import { BuildSectionRail } from "./build-section-rail";
import {
  derivePublishCheck,
  resolvePublishActionState,
} from "./publish-check-model";
import { resolveRequestedBuildSection } from "./professional-navigation";
import { useBuildEditor } from "./use-build-editor";
import type { BuildSectionId } from "./types";
import type { PublishCheckAction } from "./publish-check-model";
import { DATA_MODE } from "@/config/capabilities";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";
import { BUILD_HEADER_ACTIONS_ID } from "@/modules/agent-assets/asset-workspace-header";
import { useAgentClients } from "@/modules/agent-versions/queries";
import {
  readPublishTestSummary,
  type PublishTestSummary,
} from "@/modules/agent-test/publish-test-summary";

export function BuildWorkspace() {
  const params = useParams<{ agentId: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentId = Number(params.agentId);
  const editor = useBuildEditor(Number.isFinite(agentId) ? agentId : null);
  const [section, setSection] = useState<BuildSectionId>("identity");
  const [previewCollapsed, setPreviewCollapsed] = useState(false);
  const [publishCheckEnabled, setPublishCheckEnabled] = useState(false);
  const [panelMode, setPanelMode] = useState<"preview" | "publish-check">(
    "preview",
  );
  const [testSummary, setTestSummary] = useState<PublishTestSummary | null>(
    null,
  );
  const [momentsMigrated, setMomentsMigrated] = useState(false);
  const [actionsTarget, setActionsTarget] = useState<HTMLElement | null>(null);
  const clientsQuery = useAgentClients(
    Number.isFinite(agentId) ? agentId : 0,
    publishCheckEnabled,
  );
  const previewLayout = resolveBuildPreviewLayout(previewCollapsed);

  useEffect(() => {
    const requested = resolveRequestedBuildSection(searchParams.get("section"));
    if (requested.momentsMigrated) {
      setSection(requested.section || "media");
      setMomentsMigrated(true);
      router.replace(`/assets/${agentId}/build?section=media`);
      return;
    }
    if (requested.section) setSection(requested.section);
  }, [agentId, router, searchParams]);

  useEffect(() => {
    setActionsTarget(document.getElementById(BUILD_HEADER_ACTIONS_ID));
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px) and (max-width: 1279px)");
    const sync = () => setPreviewCollapsed(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (!editor.data || !Number.isFinite(agentId)) {
      setTestSummary(null);
      return;
    }
    setTestSummary(
      readPublishTestSummary(
        window.sessionStorage,
        DATA_MODE,
        agentId,
        editor.data.draft_revision ?? 0,
      ),
    );
  }, [agentId, editor.data]);

  const publishCheck = useMemo(
    () =>
      editor.draft
        ? derivePublishCheck({
            draft: editor.draft,
            dirty: editor.dirty,
            knowledgeBases: editor.knowledgeBases,
            knowledgeLoading: editor.knowledgeLoading,
            knowledgeError: editor.knowledgeError,
            testSummary,
            clients: clientsQuery.data?.clients || [],
            clientsLoading: clientsQuery.isLoading,
            clientsError: clientsQuery.isError,
          })
        : { items: [], blockers: 0, canContinue: false },
    [
      clientsQuery.data?.clients,
      clientsQuery.isError,
      clientsQuery.isLoading,
      editor.dirty,
      editor.draft,
      editor.knowledgeBases,
      editor.knowledgeError,
      editor.knowledgeLoading,
      testSummary,
    ],
  );
  const publishAction = useMemo(
    () =>
      resolvePublishActionState({
        publishCheckEnabled,
        panelMode,
        dirty: editor.dirty,
        saving: editor.saving,
        canContinue: publishCheck.canContinue,
      }),
    [
      editor.dirty,
      editor.saving,
      panelMode,
      publishCheck.canContinue,
      publishCheckEnabled,
    ],
  );

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

  const handlePublish = () => {
    if (publishAction.intent === "open-check") {
      setPublishCheckEnabled(true);
      setPanelMode("publish-check");
      setPreviewCollapsed(false);
      return;
    }
    if (publishCheck.canContinue) {
      router.push(`/assets/${agentId}/versions`);
    }
  };

  const handlePublishCheckAction = (action: PublishCheckAction) => {
    if (action.kind === "section") {
      setSection(action.target);
      return;
    }
    router.push(`/assets/${agentId}/test`);
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
              className="button-secondary control-compact"
            >
              <ArrowCounterClockwise size={16} />
              放弃修改
            </button>
            <button
              type="button"
              onClick={() => void editor.save("draft")}
              disabled={!editor.dirty || editor.saving}
              className="button-secondary control-compact"
            >
              <FloppyDisk size={16} />
              {editor.saving ? "保存中…" : "保存草稿"}
            </button>
            <button
              type="button"
              onClick={() => void saveAndTest()}
              disabled={editor.saving}
              className="button-secondary control-compact"
            >
              <Play size={16} />
              测试当前草稿
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={publishAction.disabled}
              className="button-primary control-compact"
              title={publishAction.title}
            >
              <PaperPlaneTilt size={16} />
              {publishAction.label}
            </button>
          </div>,
          actionsTarget,
        )}
      <div className="-mx-4 flex h-full min-w-0 flex-col sm:-mx-6 lg:-mx-7">
        {momentsMigrated && (
          <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-blue-700 dark:border-blue-400/20 dark:bg-blue-400/10 dark:text-blue-200 sm:px-6">
            <ChatCircle size={17} />
            朋友圈已迁移至应用运营，不再影响 Agent 草稿和版本。
            <button
              type="button"
              className="ml-auto font-semibold text-primary hover:underline"
              onClick={() =>
                router.push(`/operations?module=moments&agentId=${agentId}`)
              }
            >
              前往朋友圈管理
            </button>
          </div>
        )}
        <div
          className={`grid min-h-0 min-w-0 flex-1 grid-cols-1 border-b border-border transition-[grid-template-columns] duration-200 lg:grid-cols-[184px_minmax(0,1fr)] lg:overflow-hidden ${previewLayout.gridClass}`}
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
            panelMode={panelMode}
            publishCheckEnabled={publishCheckEnabled}
            publishCheck={publishCheck}
            onPanelModeChange={setPanelMode}
            onPublishCheckAction={handlePublishCheckAction}
          />
        </div>
      </div>
    </>
  );
}
