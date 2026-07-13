"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { DotsThreeVertical, Trash, X, ArrowsLeftRight } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { deleteAgent, transferAgent } from "@/modules/agents/api";
import type { Agent } from "@/modules/agents/types";
import { useAuth } from "@/modules/auth/auth-provider";
import { useWorkspace } from "@/modules/workspace/workspace-provider";

export function AssetActions({ agent }: { agent: Agent }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const { workspaces, workspaceCode } = useWorkspace();
  const demo = DATA_MODE === "demo";
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialog, setDialog] = useState<"transfer" | "delete" | null>(null);
  const [workspaceId, setWorkspaceId] = useState<number | "">("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const targets = workspaces.filter((workspace) => workspace.code !== workspaceCode);

  const finish = () => {
    queryClient.setQueryData<Agent[]>(["agents", workspaceCode, demo], (current) => (current || []).filter((item) => item.id !== agent.id));
    void queryClient.invalidateQueries({ queryKey: ["agents"] });
    setDialog(null);
    router.push("/assets");
  };

  const transfer = async () => {
    if (!session?.apiKey || workspaceId === "") return;
    setBusy(true); setError("");
    try {
      if (!demo) await transferAgent(session.apiKey, agent.id, workspaceId);
      finish();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "迁移失败");
    } finally { setBusy(false); }
  };

  const remove = async () => {
    if (!session?.apiKey || confirmation !== agent.name) return;
    setBusy(true); setError("");
    try {
      if (!demo) await deleteAgent(session.apiKey, agent.id);
      finish();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "删除失败");
    } finally { setBusy(false); }
  };

  return <div className="relative" onMouseLeave={() => setMenuOpen(false)}><button type="button" onClick={() => setMenuOpen((value) => !value)} className="rounded-md p-2.5 text-text-muted hover:bg-subtle" aria-label="更多资产操作" aria-expanded={menuOpen}><DotsThreeVertical size={21} weight="bold" /></button>{menuOpen && <div className="absolute right-0 top-full z-20 w-48 pt-2"><div className="rounded-lg border border-border bg-surface p-1.5 shadow-xl"><button type="button" onClick={() => { setDialog("transfer"); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-subtle"><ArrowsLeftRight size={17} />迁移工作空间</button><button type="button" onClick={() => { setDialog("delete"); setMenuOpen(false); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-danger hover:bg-danger/5"><Trash size={17} />删除 Agent</button></div></div>}
    {dialog === "transfer" && <Dialog title="迁移到其他工作空间" onClose={() => setDialog(null)}><p className="text-sm leading-6 text-text-muted">迁移「{agent.name}」后，它将从当前工作空间移除并出现在目标工作空间。</p><div className="mt-4 space-y-2">{targets.length ? targets.map((workspace) => <label key={workspace.id} className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 ${workspaceId === workspace.id ? "border-primary bg-primary-soft" : "border-border"}`}><input type="radio" name="target-workspace" checked={workspaceId === workspace.id} onChange={() => setWorkspaceId(workspace.id)} /><span><strong className="block">{workspace.name}</strong><small className="text-text-muted">{workspace.code}</small></span></label>) : <p className="rounded-lg bg-subtle p-4 text-sm text-text-muted">暂无其他可迁移的工作空间。</p>}</div>{error && <p className="mt-3 text-sm text-danger">{error}</p>}<footer className="mt-5 flex justify-end gap-3"><button type="button" className="button-secondary" onClick={() => setDialog(null)}>取消</button><button type="button" className="button-primary" disabled={workspaceId === "" || busy} onClick={() => void transfer()}>{busy ? "迁移中…" : "确认迁移"}</button></footer></Dialog>}
    {dialog === "delete" && <Dialog title="删除 Agent" onClose={() => setDialog(null)}><p className="text-sm leading-6 text-text-muted">此操作会删除 Agent 及其运行配置。请输入 Agent 名称 <strong>{agent.name}</strong> 以确认。</p><input autoFocus value={confirmation} onChange={(event) => setConfirmation(event.target.value)} className="mt-4 h-10 w-full rounded-md border border-border px-3" placeholder={agent.name} />{error && <p className="mt-3 text-sm text-danger">{error}</p>}<footer className="mt-5 flex justify-end gap-3"><button type="button" className="button-secondary" onClick={() => setDialog(null)}>取消</button><button type="button" className="inline-flex min-h-10 items-center justify-center rounded-md bg-danger px-5 font-semibold text-white disabled:opacity-50" disabled={confirmation !== agent.name || busy} onClick={() => void remove()}>{busy ? "删除中…" : "确认删除"}</button></footer></Dialog>}
  </div>;
}

function Dialog({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" onMouseDown={onClose}><section role="dialog" aria-modal="true" aria-labelledby="asset-action-title" onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-xl bg-surface shadow-2xl"><header className="flex items-center justify-between border-b border-border px-5 py-4"><h2 id="asset-action-title" className="font-semibold">{title}</h2><button type="button" onClick={onClose} aria-label="关闭资产操作" className="p-2"><X size={18} /></button></header><div className="p-5">{children}</div></section></div>;
}
