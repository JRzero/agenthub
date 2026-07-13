"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowCounterClockwise, CheckCircle, FloppyDisk, Play } from "@phosphor-icons/react";
import { BuildEditorPanel } from "./build-editor-panel";
import { BuildPreview } from "./build-preview";
import { BuildSectionRail } from "./build-section-rail";
import { useBuildEditor } from "./use-build-editor";
import type { BuildSectionId, EditorTabId } from "./types";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";
import { SourceBadge } from "@/shared/ui/source-badge";

export function BuildWorkspace() {
  const params = useParams<{ agentId: string }>();
  const router = useRouter();
  const agentId = Number(params.agentId);
  const editor = useBuildEditor(Number.isFinite(agentId) ? agentId : null);
  const [section, setSection] = useState<BuildSectionId>("persona");
  const [tab, setTab] = useState<EditorTabId>("basics");
  const [previewCollapsed, setPreviewCollapsed] = useState(false);

  if (editor.isLoading || !editor.draft) return <LoadingState label="正在加载构建草稿…" />;
  if (editor.isError || !editor.data) return <ErrorState message={editor.error?.message || "无法加载构建工作区"} onRetry={() => void editor.refetch()} />;

  const saveAndTest = async () => {
    const saved = await editor.save();
    if (saved) router.push(`/assets/${agentId}/test`);
  };

  return <div className="-mx-4 -mt-5 sm:-mx-6 lg:-mx-7"><div className="flex flex-wrap items-center gap-3 border-b border-border bg-surface px-4 py-3 sm:px-6 lg:px-7"><div className="mr-auto min-w-0"><div className="flex items-center gap-3"><h1 className="text-lg font-semibold">构建 Agent</h1><SourceBadge source={editor.demo ? "demo" : "live"} /></div><div className="mt-1 flex items-center gap-2 text-xs text-text-muted" aria-live="polite">{editor.dirty ? <><span className="h-2 w-2 rounded-full bg-warning" />有未保存更改</> : <><CheckCircle size={14} className="text-success" />{editor.savedAt ? `已保存于 ${editor.savedAt.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}` : "已同步最新版本"}</>}{editor.demo && <span>· 仅保存在当前演示会话</span>}</div></div>{editor.saveError && <p className="w-full text-xs text-danger sm:w-auto">{editor.saveError}</p>}<button type="button" onClick={editor.reset} disabled={!editor.dirty || editor.saving} className="button-secondary min-h-9 px-3"><ArrowCounterClockwise size={16} />重置</button><button type="button" onClick={() => void editor.save("draft")} disabled={!editor.dirty || editor.saving} className="button-secondary min-h-9 px-3"><FloppyDisk size={16} />{editor.saving ? "保存中…" : "保存草稿"}</button><button type="button" onClick={() => void saveAndTest()} disabled={editor.saving} className="button-primary min-h-9 px-3"><Play size={16} />保存并测试</button></div><div className={`grid min-h-[720px] grid-cols-1 border-b border-border lg:grid-cols-[180px_minmax(0,1fr)] ${previewCollapsed ? "xl:grid-cols-[180px_minmax(0,1fr)_52px]" : "xl:grid-cols-[180px_minmax(0,1fr)_360px]"}`}><BuildSectionRail active={section} onChange={(next) => { setSection(next); setTab("basics"); }} /><BuildEditorPanel section={section} tab={tab} agent={editor.data} draft={editor.draft} errors={editor.validationErrors} knowledgeBases={editor.knowledgeBases} knowledgeLoading={editor.knowledgeLoading} onTabChange={setTab} onPatch={editor.patchDraft} onAgentUpdated={editor.applyAgentUpdate} /><BuildPreview agent={editor.data} draft={editor.draft} dirty={editor.dirty} collapsed={previewCollapsed} onToggle={() => setPreviewCollapsed((value) => !value)} /></div></div>;
}
