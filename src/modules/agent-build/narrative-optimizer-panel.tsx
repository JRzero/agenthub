"use client";

import { useState } from "react";
import { MagicWand } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { useAuth } from "@/modules/auth/auth-provider";
import { optimizeNarrative } from "./co-creation-api";
import type { AgentBuildDraft } from "./types";

export function NarrativeOptimizerPanel({ agentId, draft, onPatch }: { agentId: number; draft: AgentBuildDraft; onPatch: (patch: Partial<AgentBuildDraft>) => void }) {
  const { session } = useAuth();
  const demo = DATA_MODE === "demo";
  const [instruction, setInstruction] = useState("");
  const [optimized, setOptimized] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const optimize = async () => {
    if (!session?.apiKey) return;
    setBusy(true); setMessage("");
    try { setOptimized((demo ? { optimized_prompt: `${draft.systemPrompt}\n\n补充规则：先确认用户感受，再明确边界并给出下一步建议。` } : await optimizeNarrative(session.apiKey, agentId, draft.systemPrompt, instruction)).optimized_prompt); }
    catch (error) { setMessage(error instanceof Error ? error.message : "叙事优化失败"); }
    finally { setBusy(false); }
  };
  return <section className="rounded-xl border border-border p-5"><h3 className="font-semibold">Motherland 叙事优化</h3><p className="mt-1 text-sm text-text-muted">结合当前提示词草稿和共创对话，生成可编辑的优化版本。</p><input value={instruction} onChange={(event) => setInstruction(event.target.value)} placeholder="本次优化侧重（可选）" className="mt-4 h-10 w-full rounded-md border border-border px-3" /><button type="button" onClick={() => void optimize()} disabled={busy} className="button-secondary mt-3"><MagicWand size={17} />生成优化版本</button>{optimized && <div className="mt-4"><textarea value={optimized} onChange={(event) => setOptimized(event.target.value)} rows={10} className="w-full resize-y rounded-lg border border-border p-3 leading-6" /><button type="button" onClick={() => onPatch({ systemPrompt: optimized })} className="button-primary mt-3">应用到提示词草稿</button></div>}{message && <p className="mt-3 text-sm text-danger">{message}</p>}</section>;
}
