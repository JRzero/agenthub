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
  const [applied, setApplied] = useState(false);

  const optimize = async () => {
    if (!session?.apiKey) return;
    setBusy(true);
    setFeedback(null);
    setApplied(false);
    try {
      const result = demo
        ? { optimized_prompt: `${draft.systemPrompt}\n\n补充规则：先确认用户感受，再明确边界并给出下一步建议。` }
        : await optimizeNarrative(session.apiKey, agentId, draft.systemPrompt, instruction);
      setOptimized(result.optimized_prompt);
      setFeedback({ tone: "success", text: "已生成优化版本，可先检查和微调，满意后再应用到草稿。" });
    } catch (error) {
      setFeedback({ tone: "error", text: error instanceof Error ? error.message : "优化失败，请稍后重试" });
    } finally {
      setBusy(false);
    }
  };

  const apply = () => {
    if (!optimized.trim()) return;
    onPatch({ systemPrompt: optimized });
    setApplied(true);
    setFeedback({ tone: "success", text: "已应用到上方草稿，请点击页面顶部“保存草稿”完成保存。" });
  };

  return (
    <section className="overflow-hidden rounded-xl border border-border bg-surface">
      <header className="flex items-start gap-3 border-b border-border px-5 py-4 sm:px-6">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-soft text-primary"><NotePencil size={20} /></span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">生成优化建议</h3></div>
          <p className="mt-1 text-sm leading-6 text-text-muted">会参考当前角色设定，生成更清晰、稳定、适合对话的版本；不会直接覆盖已有内容。</p>
        </div>
      </header>

      <div className="p-5 sm:p-6">
        <label className="block text-sm font-medium" htmlFor="system-prompt-optimization-focus">希望这次重点改进什么？<span className="ml-1 font-normal text-text-muted">选填</span></label>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <input id="system-prompt-optimization-focus" value={instruction} onChange={(event) => setInstruction(event.target.value)} placeholder="例如：语气更亲切、边界更自然、回答更简洁" className="h-10 min-w-0 flex-1 rounded-md border border-border px-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />
          <button type="button" onClick={() => void optimize()} disabled={busy || !draft.systemPrompt.trim()} className="button-secondary shrink-0 whitespace-nowrap"><MagicWand size={17} />{busy ? "生成中…" : optimized ? "重新优化" : "生成优化版本"}</button>
        </div>

        {!optimized && (
          <div className="mt-5 rounded-lg border border-dashed border-border bg-canvas/30 px-5 py-7 text-center">
            <NotePencil size={24} className="mx-auto text-primary" />
            <h4 className="mt-3 text-sm font-semibold">先生成，再决定是否使用</h4>
            <p className="mx-auto mt-1 max-w-lg text-xs leading-5 text-text-muted">结果会显示在这里。确认满意后，点击“应用到草稿”才会更新上方内容。</p>
          </div>
        )}

        {optimized && (
          <div className="mt-5 rounded-lg border border-border bg-canvas/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2"><h4 className="text-sm font-semibold">优化后的角色设定</h4><span className={`status-badge ${applied ? "status-success" : "status-warning"}`}>{applied ? "已应用" : "待确认"}</span></div>
            <textarea value={optimized} onChange={(event) => { setOptimized(event.target.value); setApplied(false); }} rows={10} aria-label="优化后的角色系统提示词" className="mt-3 w-full resize-y rounded-lg border border-border bg-surface p-3 leading-6 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-5 text-text-muted">应用后会更新上方草稿，仍需点击页面顶部“保存草稿”才会正式保存。</p><button type="button" onClick={apply} disabled={!optimized.trim() || applied} className="button-primary shrink-0 disabled:cursor-not-allowed disabled:opacity-60"><CheckCircle size={17} />{applied ? "已应用" : "应用到草稿"}</button></div>
          </div>
        )}

        {feedback && <p className={`mt-4 rounded-md border px-4 py-3 text-sm ${feedback.tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200" : "border-danger/20 bg-red-50 text-danger dark:bg-red-400/10 dark:text-red-200"}`}>{feedback.text}</p>}
      </div>
    </section>
  );
}
