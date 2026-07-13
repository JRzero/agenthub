"use client";

import { useState } from "react";
import { CheckCircle, MagicWand, NotePencil } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { useAuth } from "@/modules/auth/auth-provider";
import { optimizeNarrative } from "./co-creation-api";
import type { AgentBuildDraft } from "./types";

type Feedback = { tone: "success" | "error"; text: string } | null;

export function NarrativeOptimizerPanel({ agentId, draft, onPatch }: { agentId: number; draft: AgentBuildDraft; onPatch: (patch: Partial<AgentBuildDraft>) => void }) {
  const { session } = useAuth();
  const demo = DATA_MODE === "demo";
  const [instruction, setInstruction] = useState("");
  const [optimized, setOptimized] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);

  const optimize = async () => {
    if (!session?.apiKey) return;
    setBusy(true);
    setFeedback(null);
    try {
      const result = demo
        ? { optimized_prompt: `${draft.systemPrompt}\n\n补充规则：先确认用户感受，再明确边界并给出下一步建议。` }
        : await optimizeNarrative(session.apiKey, agentId, draft.systemPrompt, instruction);
      setOptimized(result.optimized_prompt);
      setFeedback({ tone: "success", text: "优化版本已生成，你可以先编辑，再应用到角色提示词。" });
    } catch (error) {
      setFeedback({ tone: "error", text: error instanceof Error ? error.message : "叙事优化失败" });
    } finally {
      setBusy(false);
    }
  };

  const apply = () => {
    if (!optimized.trim()) return;
    onPatch({ systemPrompt: optimized });
    setFeedback({ tone: "success", text: "已应用到角色提示词草稿，请点击页面顶部的“保存草稿”完成保存。" });
  };

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface">
      <header className="flex items-start gap-3 border-b border-border px-5 py-4 sm:px-6">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><NotePencil size={20} /></span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2"><span className="status-badge bg-primary-soft text-primary">第 2 步</span><h3 className="font-semibold">整理为角色提示词</h3></div>
          <p className="mt-1 text-sm leading-6 text-text-muted">结合当前角色提示词和上方共创记录，生成一份可以继续编辑的优化版本。</p>
        </div>
      </header>

      <div className="p-5 sm:p-6">
        <label className="block text-sm font-medium" htmlFor="motherland-optimization-focus">本次想重点优化什么？<span className="ml-1 font-normal text-text-muted">选填</span></label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input id="motherland-optimization-focus" value={instruction} onChange={(event) => setInstruction(event.target.value)} placeholder="例如：边界表达更自然，语气更温和" className="h-10 min-w-0 flex-1 rounded-md border border-border px-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />
          <button type="button" onClick={() => void optimize()} disabled={busy || !draft.systemPrompt.trim()} className="button-secondary shrink-0 whitespace-nowrap"><MagicWand size={17} />{busy ? "生成中…" : optimized ? "重新生成" : "生成优化版本"}</button>
        </div>

        {!optimized && (
          <div className="mt-5 rounded-lg border border-dashed border-border bg-canvas/30 px-5 py-7 text-center">
            <NotePencil size={24} className="mx-auto text-primary" />
            <h4 className="mt-3 text-sm font-semibold">共创内容不会自动修改 Agent</h4>
            <p className="mx-auto mt-1 max-w-lg text-xs leading-5 text-text-muted">生成优化版本后，你可以先检查和编辑，再主动应用到当前角色提示词草稿。</p>
          </div>
        )}

        {optimized && (
          <div className="mt-5 rounded-lg border border-border bg-canvas/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2"><h4 className="text-sm font-semibold">可编辑的优化版本</h4><span className="status-badge bg-amber-50 text-amber-700">尚未应用</span></div>
            <textarea value={optimized} onChange={(event) => setOptimized(event.target.value)} rows={10} aria-label="Motherland 优化后的角色提示词" className="mt-3 w-full resize-y rounded-lg border border-border bg-surface p-3 leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-5 text-text-muted">应用后只更新本地草稿，还需要使用页面顶部的保存操作。</p><button type="button" onClick={apply} disabled={!optimized.trim()} className="button-primary shrink-0"><CheckCircle size={17} />应用到角色提示词</button></div>
          </div>
        )}

        {feedback && <p className={`mt-4 rounded-md border px-4 py-3 text-sm ${feedback.tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-danger/20 bg-red-50 text-danger"}`}>{feedback.text}</p>}
      </div>
    </section>
  );
}
