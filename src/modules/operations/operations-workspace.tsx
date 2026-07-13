"use client";

import { useEffect, useMemo, useState } from "react";
import { LockKey } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { useAuth } from "@/modules/auth/auth-provider";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { SourceBadge } from "@/shared/ui/source-badge";
import {
  getSessionMessages,
  getUserAgentPrompt,
  listSharedSessions,
  pushCreatorComment,
  setUserAgentPrompt,
  updateSessionPrompt,
  verifySession,
} from "./api";
import { ConversationPanel } from "./conversation-panel";
import { DEMO_MESSAGES, DEMO_SHARED_SESSIONS } from "./fixtures";
import { PromptDialog } from "./prompt-dialog";
import { SessionInspector } from "./session-inspector";
import { SessionList } from "./session-list";
import type { PromptScope, SessionMessage, SharedSessionRow } from "./types";

const tabs = [
  ["sessions", "会话管理"],
  ["feedback", "用户反馈"],
  ["memory", "记忆问题"],
  ["campaign", "活动与渠道"],
  ["binding", "应用端配置"],
] as const;

export function OperationsWorkspace() {
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const demo = DATA_MODE === "demo";
  const [tab, setTab] = useState<(typeof tabs)[number][0]>("sessions");
  const [rows, setRows] = useState<SharedSessionRow[]>(demo ? DEMO_SHARED_SESSIONS : []);
  const [selected, setSelected] = useState<SharedSessionRow | null>(demo ? DEMO_SHARED_SESSIONS[0] : null);
  const [messages, setMessages] = useState<SessionMessage[]>(demo ? DEMO_MESSAGES[DEMO_SHARED_SESSIONS[0].session.id] : []);
  const [query, setQuery] = useState("");
  const [agentId, setAgentId] = useState<number | "">("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(!demo);
  const [messageLoading, setMessageLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [promptScope, setPromptScope] = useState<PromptScope | null>(null);
  const [promptValue, setPromptValue] = useState("");
  const [sessionPrompt, setSessionPrompt] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [promptSaving, setPromptSaving] = useState(false);

  useEffect(() => {
    if (demo || !session?.apiKey) return;
    setLoading(true);
    listSharedSessions(session.apiKey, workspaceCode)
      .then((items) => { setRows(items); setSelected(items[0] || null); })
      .catch((err: Error) => setError(err.message || "无法加载共享会话"))
      .finally(() => setLoading(false));
  }, [demo, session?.apiKey, workspaceCode]);

  useEffect(() => {
    if (!selected) { setMessages([]); return; }
    setSessionPrompt(selected.session.custom_prompt_patch || "");
    if (demo) { setMessages(DEMO_MESSAGES[selected.session.id] || []); setUserPrompt(""); return; }
    if (!session?.apiKey) return;
    setMessageLoading(true);
    Promise.all([
      getSessionMessages(session.apiKey, workspaceCode, selected.session.id),
      getUserAgentPrompt(session.apiKey, workspaceCode, selected.agent.id, selected.human.id),
    ]).then(([nextMessages, prompt]) => { setMessages(nextMessages); setUserPrompt(prompt?.prompt || ""); })
      .catch((err: Error) => setError(err.message || "无法读取会话详情"))
      .finally(() => setMessageLoading(false));
  }, [demo, selected, session?.apiKey, workspaceCode]);

  const counts = useMemo(() => ({ total: rows.length, review: rows.filter((row) => row.session.status === "review").length, verified: rows.filter((row) => row.session.verified).length }), [rows]);

  async function toggleVerify() {
    if (!selected || !session?.apiKey) return;
    const verified = !selected.session.verified;
    try {
      if (!demo) await verifySession(session.apiKey, workspaceCode, selected.session.id, verified);
      const update = (row: SharedSessionRow) => row.session.id === selected.session.id ? { ...row, session: { ...row.session, verified } } : row;
      setRows((current) => current.map(update)); setSelected(update(selected));
    } catch (err) { setError(err instanceof Error ? err.message : "认证操作失败"); }
  }

  async function sendComment(content: string) {
    if (!selected || !session?.apiKey || !content.trim()) return;
    setSending(true);
    try {
      const result = demo ? { message_id: `demo-${Date.now()}`, session_id: selected.session.id } : await pushCreatorComment(session.apiKey, workspaceCode, selected, content);
      setMessages((current) => [...current, { id: Date.now(), uuid: result.message_id, session_id: selected.session.id, role: "assistant", content: `[创作者评论] ${content.trim()}`, content_type: "text", created_at: new Date().toISOString(), sender_agent_id: selected.agent.id, sender_name: "创作者" }]);
    } catch (err) { setError(err instanceof Error ? err.message : "评论发送失败"); }
    finally { setSending(false); }
  }

  function openPrompt(scope: PromptScope) {
    setPromptScope(scope); setPromptValue(scope === "session" ? sessionPrompt : userPrompt); setError("");
  }

  async function savePrompt() {
    if (!selected || !session?.apiKey || !promptScope) return;
    setPromptSaving(true);
    try {
      if (!demo) {
        if (promptScope === "session") await updateSessionPrompt(session.apiKey, workspaceCode, selected.session.id, promptValue);
        else await setUserAgentPrompt(session.apiKey, workspaceCode, selected.agent.id, selected.human.id, promptValue);
      }
      if (promptScope === "session") setSessionPrompt(promptValue); else setUserPrompt(promptValue);
      setPromptScope(null);
    } catch (err) { setError(err instanceof Error ? err.message : "Prompt 保存失败"); }
    finally { setPromptSaving(false); }
  }

  return (
    <div className="-mx-4 -mt-6 bg-surface sm:-mx-6 lg:-mx-7">
      <header className="border-b border-border px-4 pt-6 sm:px-6 lg:px-7">
        <div className="flex items-center gap-3"><h1 className="text-2xl font-bold tracking-tight">应用运营</h1><SourceBadge source={demo ? "demo" : "live"} /></div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3"><nav className="flex gap-7 overflow-x-auto" aria-label="应用运营模块">{tabs.map(([id, label]) => <button key={id} type="button" onClick={() => setTab(id)} className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium ${tab === id ? "border-primary text-primary" : "border-transparent text-text-muted"}`}>{label}</button>)}</nav>{tab === "sessions" && <p className="pb-3 text-xs text-text-muted">{counts.total} 条共享 · {counts.review} 条需复核 · {counts.verified} 条已认证</p>}</div>
      </header>
      {error && <div className="mx-4 mt-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-danger sm:mx-6">{error}</div>}
      {tab === "sessions" ? loading ? <div className="py-24 text-center text-text-muted">正在加载共享会话…</div> : <div className="grid min-h-[720px] lg:grid-cols-[320px_minmax(0,1fr)] min-[1400px]:grid-cols-[320px_minmax(0,1fr)_300px]"><SessionList rows={rows} selectedId={selected?.session.id} query={query} agentId={agentId} status={status} onQuery={setQuery} onAgent={setAgentId} onStatus={setStatus} onSelect={setSelected} /><ConversationPanel row={selected} messages={messages} loading={messageLoading} sending={sending} onVerify={() => void toggleVerify()} onComment={(content) => void sendComment(content)} /><SessionInspector row={selected} demo={demo} onPrompt={openPrompt} /></div> : <UnavailableOperation label={tabs.find(([id]) => id === tab)?.[1] || "运营模块"} />}
      {promptScope && <PromptDialog scope={promptScope} value={promptValue} saving={promptSaving} error={error} onChange={setPromptValue} onClose={() => setPromptScope(null)} onSave={() => void savePrompt()} />}
    </div>
  );
}

function UnavailableOperation({ label }: { label: string }) {
  return <div className="flex min-h-[650px] items-center justify-center p-6"><div className="max-w-lg text-center"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary-soft text-primary"><LockKey size={26} /></span><h2 className="mt-4 text-xl font-semibold">{label}</h2><p className="mt-2 text-sm leading-6 text-text-muted">旧 Creator 没有独立的工作空间级数据契约；当前保留产品入口，不把会话字段或演示样本扩张成生产事实。</p></div></div>;
}
