"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChatCircleDots,
  DeviceMobile,
  LockKey,
} from "@phosphor-icons/react";
import type { Agent } from "@/modules/agents/types";
import { DATA_MODE } from "@/config/capabilities";
import { useAuth } from "@/modules/auth/auth-provider";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { SourceBadge } from "@/shared/ui/source-badge";
import {
  getSessionMessages,
  getUserAgentPrompt,
  listAgentUserSharedSessions,
  listOperationAgents,
  listSharedSessions,
  listSharedUsers,
  pushCreatorComment,
  setUserAgentPrompt,
  updateSessionPrompt,
  verifySession,
} from "./api";
import { ConversationPanel } from "./conversation-panel";
import { DEMO_MESSAGES, DEMO_SHARED_SESSIONS } from "./fixtures";
import {
  OPERATIONS_TABS,
  operationsModuleLabel,
  resolveOperationsModule,
  sessionLabel,
  type OperationsModule,
} from "./model";
import { SessionInspector } from "./session-inspector";
import { SessionList } from "./session-list";
import { MomentsWorkspace } from "./moments/moments-workspace";
import type { SessionMessage, SharedSessionRow, SharedUser } from "./types";

type ViewMode = "by-agent" | "all";

function demoAgentFromRow(row: SharedSessionRow): Agent {
  return {
    id: row.agent.id,
    uuid: row.agent.uuid,
    code: row.agent.code || `agent-${row.agent.id}`,
    name: row.agent.name,
    description: "",
    model: "",
    status: "active",
    agent_type: row.agent.agent_type === "edge" ? "edge" : "cloud",
    edge_status: row.agent.online ? "online" : "offline",
    memory_enabled: true,
    version: 1,
    config: { metadata: { avatar: row.agent.avatar } },
  };
}

function uniqueDemoAgents(rows: SharedSessionRow[]): Agent[] {
  return Array.from(new Map(rows.map((row) => [row.agent.id, demoAgentFromRow(row)])).values());
}

function usersForAgent(rows: SharedSessionRow[], agentId: number): SharedUser[] {
  const map = new Map<number, SharedUser>();
  rows.filter((row) => row.agent.id === agentId).forEach((row) => {
    const current = map.get(row.human.id);
    map.set(row.human.id, {
      user_id: row.human.id,
      username: row.human.username,
      display_name: row.human.display_name,
      uuid: row.human.uuid,
      avatar: row.human.avatar,
      session_count: (current?.session_count || 0) + 1,
    });
  });
  return Array.from(map.values());
}

export function OperationsWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const demo = DATA_MODE === "demo";
  const tab = resolveOperationsModule(searchParams.get("module"));
  const [viewMode, setViewMode] = useState<ViewMode>("by-agent");
  const [rows, setRows] = useState<SharedSessionRow[]>(demo ? DEMO_SHARED_SESSIONS : []);
  const [agents, setAgents] = useState<Agent[]>(demo ? uniqueDemoAgents(DEMO_SHARED_SESSIONS) : []);
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(demo ? DEMO_SHARED_SESSIONS[0]?.agent.id ?? null : null);
  const [sharedUsers, setSharedUsers] = useState<SharedUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(demo ? DEMO_SHARED_SESSIONS[0]?.human.id ?? null : null);
  const [agentSessions, setAgentSessions] = useState<SharedSessionRow[]>([]);
  const [selected, setSelected] = useState<SharedSessionRow | null>(demo ? DEMO_SHARED_SESSIONS[0] : null);
  const [messages, setMessages] = useState<SessionMessage[]>(demo ? DEMO_MESSAGES[DEMO_SHARED_SESSIONS[0].session.id] : []);
  const [query, setQuery] = useState("");
  const [agentId, setAgentId] = useState<number | "">("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(!demo);
  const [agentLoading, setAgentLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [messageLoading, setMessageLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sessionPrompt, setSessionPrompt] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [promptSaving, setPromptSaving] = useState(false);

  useEffect(() => {
    if (tab !== "sessions" || demo || !session?.apiKey) return;
    setLoading(true);
    Promise.all([listSharedSessions(session.apiKey, workspaceCode), listOperationAgents(session.apiKey, workspaceCode)])
      .then(([items, nextAgents]) => {
        const mergedAgents = Array.from(new Map([...uniqueDemoAgents(items), ...nextAgents].map((agent) => [agent.id, agent])).values());
        setRows(items);
        setAgents(mergedAgents);
        setSelectedAgentId((current) => current ?? items[0]?.agent.id ?? mergedAgents[0]?.id ?? null);
      })
      .catch((err: Error) => setError(err.message || "无法加载共享会话"))
      .finally(() => setLoading(false));
  }, [demo, session?.apiKey, tab, workspaceCode]);

  useEffect(() => {
    if (tab !== "sessions" || viewMode !== "by-agent") return;
    if (!selectedAgentId) { setSharedUsers([]); setSelectedUserId(null); setAgentSessions([]); setSelected(null); return; }
    if (demo) {
      const nextUsers = usersForAgent(rows, selectedAgentId);
      setSharedUsers(nextUsers);
      setSelectedUserId((current) => nextUsers.some((user) => user.user_id === current) ? current : nextUsers[0]?.user_id ?? null);
      return;
    }
    if (!session?.apiKey) return;
    setAgentLoading(true);
    listSharedUsers(session.apiKey, workspaceCode, selectedAgentId)
      .then((nextUsers) => {
        setSharedUsers(nextUsers);
        setSelectedUserId((current) => nextUsers.some((user) => user.user_id === current) ? current : nextUsers[0]?.user_id ?? null);
      })
      .catch((err: Error) => setError(err.message || "无法加载共享用户"))
      .finally(() => setAgentLoading(false));
  }, [demo, rows, selectedAgentId, session?.apiKey, tab, viewMode, workspaceCode]);

  useEffect(() => {
    if (tab !== "sessions" || viewMode !== "by-agent") return;
    const selectedAgent = agents.find((agent) => agent.id === selectedAgentId);
    const selectedUser = sharedUsers.find((user) => user.user_id === selectedUserId);
    if (!selectedAgent || !selectedUser) { setAgentSessions([]); setSelected(null); return; }
    if (demo) {
      const nextSessions = rows.filter((row) => row.agent.id === selectedAgent.id && row.human.id === selectedUser.user_id);
      setAgentSessions(nextSessions);
      setSelected((current) => nextSessions.find((row) => row.session.id === current?.session.id) || nextSessions[0] || null);
      return;
    }
    if (!session?.apiKey) return;
    setSessionLoading(true);
    listAgentUserSharedSessions(session.apiKey, workspaceCode, selectedAgent, selectedUser)
      .then((nextSessions) => {
        setAgentSessions(nextSessions);
        setSelected((current) => nextSessions.find((row) => row.session.id === current?.session.id) || nextSessions[0] || null);
      })
      .catch((err: Error) => setError(err.message || "无法加载用户会话"))
      .finally(() => setSessionLoading(false));
  }, [agents, demo, rows, selectedAgentId, selectedUserId, session?.apiKey, sharedUsers, tab, viewMode, workspaceCode]);

  useEffect(() => {
    if (tab !== "sessions" || viewMode !== "all") return;
    setSelected((current) => rows.find((row) => row.session.id === current?.session.id) || rows[0] || null);
  }, [rows, tab, viewMode]);

  useEffect(() => {
    if (tab !== "sessions") return;
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
  }, [demo, selected, session?.apiKey, tab, workspaceCode]);

  const counts = useMemo(() => ({ total: rows.length, review: rows.filter((row) => row.session.status === "review").length, verified: rows.filter((row) => row.session.verified).length }), [rows]);

  async function toggleVerify() {
    if (!selected || !session?.apiKey) return;
    const verified = !selected.session.verified;
    try {
      if (!demo) await verifySession(session.apiKey, workspaceCode, selected.session.id, verified);
      const update = (row: SharedSessionRow) => row.session.id === selected.session.id ? { ...row, session: { ...row.session, verified } } : row;
      setRows((current) => current.map(update));
      setAgentSessions((current) => current.map(update));
      setSelected(update(selected));
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

  async function savePrompt(scope: "session" | "user") {
    if (!selected || !session?.apiKey) return;
    const value = scope === "session" ? sessionPrompt : userPrompt;
    setPromptSaving(true);
    try {
      if (!demo) {
        if (scope === "session") await updateSessionPrompt(session.apiKey, workspaceCode, selected.session.id, value);
        else await setUserAgentPrompt(session.apiKey, workspaceCode, selected.agent.id, selected.human.id, value);
      }
      if (scope === "session") {
        const update = (row: SharedSessionRow) => row.session.id === selected.session.id ? { ...row, session: { ...row.session, custom_prompt_patch: value } } : row;
        setRows((current) => current.map(update));
        setAgentSessions((current) => current.map(update));
        setSelected(update(selected));
      }
    } catch (err) { setError(err instanceof Error ? err.message : "Prompt 保存失败"); }
    finally { setPromptSaving(false); }
  }
  function selectAllRow(row: SharedSessionRow) {
    setSelected(row);
    setSelectedAgentId(row.agent.id);
    setSelectedUserId(row.human.id);
  }

  function selectTab(next: OperationsModule) {
    setError("");
    const params = new URLSearchParams(searchParams.toString());
    params.set("module", next);
    params.delete("view");
    params.delete("step");
    router.push(`/operations?${params.toString()}`);
  }

  return (
    <div className="-mx-4 -mt-6 bg-surface sm:-mx-6 lg:-mx-7">
      <header className="border-b border-border px-4 pt-6 sm:px-6 lg:px-7">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">应用运营</h1>
          <SourceBadge source={demo ? "demo" : "live"} />
          <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-subtle px-2.5 py-1 text-xs font-medium">
            <DeviceMobile size={15} className="text-primary" />
            OyiiOyii
          </span>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-3"><nav className="flex gap-7 overflow-x-auto" aria-label="应用运营模块">{OPERATIONS_TABS.map(([id, label]) => <button key={id} type="button" onClick={() => selectTab(id)} className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-medium ${tab === id ? "border-primary text-primary" : "border-transparent text-text-muted"}`}>{label}</button>)}</nav>{tab === "sessions" && <p className="pb-3 text-xs text-text-muted">{counts.total} 条共享 · {counts.review} 条需复核 · {counts.verified} 条已认证</p>}</div>
      </header>
      {tab === "sessions" && error && <div className="mx-4 mt-3 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-danger dark:border-rose-400/20 dark:bg-rose-400/10 dark:text-rose-200 sm:mx-6">{error}</div>}
      {tab === "sessions" ? loading ? <div className="py-24 text-center text-text-muted">正在加载共享会话…</div> : <div>
        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface px-4 py-3 sm:px-6 lg:px-7"><span className="text-xs text-text-muted">视图</span><button type="button" onClick={() => setViewMode("by-agent")} className={`rounded-md px-3 py-1.5 text-xs font-medium ${viewMode === "by-agent" ? "bg-primary text-white" : "border border-border text-text-muted hover:bg-subtle"}`}>按 Agent 查看</button><button type="button" onClick={() => setViewMode("all")} className={`rounded-md px-3 py-1.5 text-xs font-medium ${viewMode === "all" ? "bg-primary text-white" : "border border-border text-text-muted hover:bg-subtle"}`}>全部共享 H2A</button></div>
        <div className="overflow-hidden">
          <div className={`grid h-[calc(100vh-226px)] min-h-[640px] ${viewMode === "by-agent" ? "grid-cols-[minmax(500px,580px)_minmax(0,1fr)_minmax(300px,320px)]" : "grid-cols-[280px_minmax(0,1fr)_minmax(300px,320px)]"}`}>
          {viewMode === "by-agent" ? <AgentSessionNavigator agents={agents} users={sharedUsers} sessions={agentSessions} selectedAgentId={selectedAgentId} selectedUserId={selectedUserId} selectedSessionId={selected?.session.id} loadingUsers={agentLoading} loadingSessions={sessionLoading} onAgent={setSelectedAgentId} onUser={setSelectedUserId} onSession={setSelected} /> : <SessionList rows={rows} selectedId={selected?.session.id} query={query} agentId={agentId} status={status} onQuery={setQuery} onAgent={setAgentId} onStatus={setStatus} onSelect={selectAllRow} />}
          <ConversationPanel row={selected} messages={messages} loading={messageLoading} sending={sending} onVerify={() => void toggleVerify()} onComment={(content) => void sendComment(content)} />
          <SessionInspector row={selected} demo={demo} sessionPrompt={sessionPrompt} userPrompt={userPrompt} saving={promptSaving} onSessionPromptChange={setSessionPrompt} onUserPromptChange={setUserPrompt} onSaveSessionPrompt={() => void savePrompt("session")} onSaveUserPrompt={() => void savePrompt("user")} />
          </div>
        </div>
      </div> : tab === "moments" ? <MomentsWorkspace /> : (
        <UnavailableOperation label={operationsModuleLabel(tab)} />
      )}
    </div>
  );
}

function AgentSessionNavigator({ agents, users, sessions, selectedAgentId, selectedUserId, selectedSessionId, loadingUsers, loadingSessions, onAgent, onUser, onSession }: { agents: Agent[]; users: SharedUser[]; sessions: SharedSessionRow[]; selectedAgentId: number | null; selectedUserId: number | null; selectedSessionId?: number; loadingUsers: boolean; loadingSessions: boolean; onAgent: (value: number) => void; onUser: (value: number) => void; onSession: (row: SharedSessionRow) => void }) {
  return <aside className="grid min-h-0 grid-cols-[190px_170px_minmax(0,1fr)] border-r border-border bg-surface">
    <Column title="我的 Agent">{agents.length ? agents.map((agent) => <button key={agent.id} type="button" onClick={() => onAgent(agent.id)} className={`mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm ${selectedAgentId === agent.id ? "bg-primary-soft font-medium text-primary" : "hover:bg-subtle"}`}><Avatar label={agent.name} /><span className="min-w-0 flex-1 truncate">{agent.name}</span></button>) : <Empty label="暂无 Agent" />}</Column>
    <Column title="共享用户">{loadingUsers ? <Empty label="加载中…" /> : users.length ? users.map((user) => <button key={user.user_id} type="button" onClick={() => onUser(user.user_id)} className={`mb-1 flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm ${selectedUserId === user.user_id ? "bg-primary-soft font-medium text-primary" : "hover:bg-subtle"}`}><Avatar label={user.display_name || user.username} /><span className="min-w-0 flex-1"><span className="block truncate">{user.display_name || user.username}</span><span className="text-[11px] text-text-muted">{user.session_count} 个会话</span></span></button>) : <Empty label={selectedAgentId ? "暂无共享用户" : "请先选择 Agent"} />}</Column>
    <Column title="会话列表">{loadingSessions ? <Empty label="加载中…" /> : sessions.length ? sessions.map((row) => <button key={row.session.id} type="button" onClick={() => onSession(row)} className={`mb-1 w-full rounded-lg px-2 py-2 text-left text-sm ${selectedSessionId === row.session.id ? "bg-primary-soft font-medium text-primary" : "hover:bg-subtle"}`}><span className="flex items-center gap-1 truncate">{sessionLabel(row)}{row.session.is_group && <span className="rounded bg-primary-soft px-1 text-[10px] text-primary">群</span>}{row.session.verified && <span className="text-success">✓</span>}</span><span className="mt-1 block text-xs text-text-muted">{row.session.message_count} 条 · {row.session.status}</span></button>) : <Empty label={selectedUserId ? "暂无共享会话" : "请先选择用户"} />}</Column>
  </aside>;
}

function Column({ title, children }: { title: string; children: ReactNode }) {
  return <div className="flex min-h-0 flex-col border-r border-border last:border-r-0"><div className="border-b border-border px-3 py-2 text-xs font-semibold text-text-muted">{title}</div><div className="min-h-0 flex-1 overflow-y-auto p-2">{children}</div></div>;
}

function Avatar({ label }: { label: string }) {
  return <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">{label.slice(0, 1).toUpperCase()}</span>;
}

function Empty({ label }: { label: string }) {
  return <div className="flex min-h-24 flex-col items-center justify-center text-center text-xs text-text-muted"><ChatCircleDots size={24} className="mb-2 text-primary" />{label}</div>;
}

function UnavailableOperation({ label }: { label: string }) {
  return (
    <div className="flex min-h-[650px] items-center justify-center p-6">
      <div className="max-w-lg text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <LockKey size={26} />
        </span>
        <span className="status-badge mt-4">规划中</span>
        <h2 className="mt-3 text-xl font-semibold">{label}</h2>
        <p className="mt-2 text-sm leading-6 text-text-muted">
          该模块入口暂时保留，当前后端尚未提供稳定的数据契约。正式接入前不会请求不支持的接口，也不会使用演示数据冒充生产能力。
        </p>
      </div>
    </div>
  );
}
