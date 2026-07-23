import { ChatCircleDots, MagnifyingGlass } from "@phosphor-icons/react";
import { filterSessions, humanLabel, sessionLabel } from "./model";
import type { SharedSessionRow } from "./types";

export function SessionList({
  rows,
  selectedId,
  query,
  agentId,
  status,
  onQuery,
  onAgent,
  onStatus,
  onSelect,
}: {
  rows: SharedSessionRow[];
  selectedId?: number;
  query: string;
  agentId: number | "";
  status: string;
  onQuery: (value: string) => void;
  onAgent: (value: number | "") => void;
  onStatus: (value: string) => void;
  onSelect: (row: SharedSessionRow) => void;
}) {
  const agents = Array.from(new Map(rows.map((row) => [row.agent.id, row.agent])).values());
  const filtered = filterSessions(rows, query, agentId, status);
  return (
    <aside className="flex min-h-0 flex-col border-b border-border bg-surface lg:border-b-0 lg:border-r">
      <div className="space-y-3 border-b border-border p-3">
        <label className="relative block"><MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={17} /><input value={query} onChange={(e) => onQuery(e.target.value)} placeholder="搜索会话或脱敏用户" className="h-9 w-full rounded-md border border-border pl-9 pr-3 text-sm outline-none focus:border-primary" /></label>
        <div className="grid grid-cols-2 gap-2">
          <select value={agentId} onChange={(e) => onAgent(Number(e.target.value) || "")} className="h-9 rounded-md border border-border bg-surface px-2 text-xs"><option value="">全部 Agent</option>{agents.map((agent) => <option key={agent.id} value={agent.id}>{agent.name}</option>)}</select>
          <select value={status} onChange={(e) => onStatus(e.target.value)} className="h-9 rounded-md border border-border bg-surface px-2 text-xs"><option value="all">全部状态</option><option value="active">正常</option><option value="review">需复核</option></select>
        </div>
      </div>
      <div className="flex items-center justify-between border-b border-border px-4 py-3"><div><h2 className="font-semibold">会话列表</h2><p className="mt-1 text-xs text-text-muted">共 {filtered.length} 条共享会话</p></div><span className="text-xs text-text-muted">最新</span></div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {filtered.map((row) => {
          const active = row.session.id === selectedId;
          return <button key={row.session.id} type="button" onClick={() => onSelect(row)} className={`mb-1 w-full rounded-lg border px-3 py-3 text-left transition ${active ? "border-primary bg-primary-soft" : "border-transparent hover:bg-subtle"}`}><div className="flex items-start gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">{row.agent.name.slice(0, 1)}</span><span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><strong className="truncate text-sm">{humanLabel(row)} · {row.agent.name}</strong><span className="text-xs text-text-muted">{new Date(row.session.last_message_at || row.session.updated_at).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}</span></span><span className="mt-1 block truncate text-xs text-text-muted">{sessionLabel(row)} · {row.session.source}</span><span className="mt-2 flex items-center justify-between"><span className="text-[11px] text-text-muted">{row.session.message_count} 条消息</span><span className={`status-badge ${row.session.verified ? "status-success" : row.session.status === "review" ? "status-warning" : "status-neutral"}`}>{row.session.verified ? "已认证" : row.session.status === "review" ? "需复核" : "正常"}</span></span></span></div></button>;
        })}
        {!filtered.length && <div className="flex min-h-48 flex-col items-center justify-center text-center"><ChatCircleDots size={30} className="text-primary" /><p className="mt-3 text-sm text-text-muted">没有匹配的共享会话</p></div>}
      </div>
    </aside>
  );
}
