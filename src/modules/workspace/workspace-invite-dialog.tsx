"use client";

import { useEffect, useState } from "react";
import { ArrowsClockwise, Copy, X } from "@phosphor-icons/react";
import { useAuth } from "@/modules/auth/auth-provider";
import { getWorkspaceInviteCode, refreshWorkspaceInviteCode } from "./api";

export function WorkspaceInviteDialog({ open, workspaceCode, workspaceName, onClose }: { open: boolean; workspaceCode: string; workspaceName: string; onClose: () => void }) {
  const { session, demo } = useAuth();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open || !session?.apiKey) return;
    setBusy(true); setError("");
    (demo ? Promise.resolve({ invite_code: "XINGHAI-DEMO" }) : getWorkspaceInviteCode(session.apiKey, workspaceCode))
      .then((result) => setCode(result.invite_code))
      .catch((reason) => setError(reason instanceof Error ? reason.message : "加载邀请码失败"))
      .finally(() => setBusy(false));
  }, [demo, open, session?.apiKey, workspaceCode]);

  const refresh = async () => {
    if (!session?.apiKey) return;
    setBusy(true); setError("");
    try {
      const result = demo ? { invite_code: `DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}` } : await refreshWorkspaceInviteCode(session.apiKey, workspaceCode);
      setCode(result.invite_code);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "刷新邀请码失败");
    } finally { setBusy(false); }
  };

  const copy = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  if (!open) return null;
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 p-4" onMouseDown={onClose}><section role="dialog" aria-modal="true" aria-labelledby="workspace-invite-title" onMouseDown={(event) => event.stopPropagation()} className="w-full max-w-md rounded-xl bg-surface shadow-2xl"><header className="flex items-center justify-between border-b border-border px-5 py-4"><div><h2 id="workspace-invite-title" className="font-semibold">邀请成员</h2><p className="mt-1 text-xs text-text-muted">{workspaceName}</p></div><button type="button" onClick={onClose} aria-label="关闭邀请成员" className="p-2"><X size={18} /></button></header><div className="p-5"><p className="text-sm text-text-muted">将邀请码安全地发送给需要加入此工作空间的 Creator。</p><div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-subtle p-3"><code className="min-w-0 flex-1 truncate text-lg font-semibold tracking-widest">{busy ? "加载中…" : code || "—"}</code><button type="button" onClick={() => void copy()} disabled={!code || busy} className="rounded-md p-2 text-primary hover:bg-primary-soft" aria-label="复制邀请码"><Copy size={19} /></button></div>{copied && <p className="mt-2 text-sm text-success">邀请码已复制</p>}{error && <p className="mt-2 text-sm text-danger">{error}</p>}<button type="button" onClick={() => void refresh()} disabled={busy} className="button-secondary mt-5 w-full"><ArrowsClockwise size={18} />刷新邀请码</button><p className="mt-3 text-xs leading-5 text-text-muted">刷新后，旧邀请码将立即失效。</p></div></section></div>;
}
