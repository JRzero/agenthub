"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { CaretRight, MagnifyingGlass, Plus } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import { useAgents } from "@/modules/agents/queries";
import type { Agent } from "@/modules/agents/types";
import { useAuth } from "@/modules/auth/auth-provider";
import { createAgent, type CreateAgentInput } from "@/modules/workbench/api";
import { CreateAgentDialog } from "@/modules/workbench/create-agent-dialog";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";

type StatusFilter = "all" | "active" | "draft" | "archived";

export default function AssetLibraryPage() {
  const query = useAgents();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const { workspaceCode } = useWorkspace();
  const demo = DATA_MODE === "demo";
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [createError, setCreateError] = useState("");
  const agents = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return (query.data || []).filter((agent) => {
      const matchesSearch = !keyword || `${agent.name} ${agent.code} ${agent.description}`.toLowerCase().includes(keyword);
      const matchesStatus = status === "all" || agent.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [query.data, search, status]);

  async function submitCreate(input: CreateAgentInput) {
    if (!session?.apiKey) return;
    setSaving(true); setCreateError("");
    try {
      const created: Agent = demo ? { id: Math.max(0, ...(query.data || []).map((agent) => agent.id)) + 1, uuid: `demo-${Date.now()}`, code: input.code, name: input.name, description: input.description, model: input.model, status: "draft", agent_type: "cloud", edge_status: "online", memory_enabled: false, version: 1, system_prompt: "你是一个有帮助的助手。", config: {} } : await createAgent(session.apiKey, workspaceCode, input);
      queryClient.setQueryData<Agent[]>(["agents", workspaceCode, demo], (current) => [created, ...(current || [])]);
      queryClient.setQueryData(["agent", created.id, workspaceCode, demo], created);
      setDialogOpen(false);
      router.push(`/assets/${created.id}/build`);
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : "创建 Agent 失败");
    } finally { setSaving(false); }
  }

  if (query.isLoading) return <LoadingState label="正在加载 Agent 资产…" />;
  if (query.isError) return <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />;

  return <div><div className="mb-6 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm text-text-muted">工作空间 / Agent 资产库</p><h1 className="mt-2 text-2xl font-bold tracking-tight">Agent 资产库</h1><p className="mt-2 text-sm text-text-muted">管理可构建、测试和发行的 Agent 源资产。</p></div><button type="button" className="button-primary" onClick={() => setDialogOpen(true)}><Plus size={17} />新建 Agent</button></div><section className="panel overflow-hidden"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4"><div className="flex w-full flex-wrap gap-3 sm:w-auto"><label className="relative w-full sm:w-80"><span className="sr-only">搜索 Agent</span><MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="搜索 Agent 名称或编码" className="h-10 w-full rounded-md border border-border bg-surface pl-10 pr-3 outline-none transition focus:border-primary" /></label><select value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)} aria-label="Agent 状态" className="h-10 rounded-md border border-border bg-surface px-3"><option value="all">全部状态</option><option value="active">已发布</option><option value="draft">草稿</option><option value="archived">已归档</option></select></div><span className="text-sm text-text-muted">共 {agents.length} 项</span></div>{agents.length === 0 ? <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center"><h2 className="font-semibold">没有匹配的 Agent 资产</h2><p className="mt-2 text-sm text-text-muted">清除搜索条件或切换工作空间后重试。</p></div> : <div className="divide-y divide-border">{agents.map((agent) => <Link key={agent.id} href={`/assets/${agent.id}/overview`} className="grid min-h-[86px] grid-cols-[minmax(0,1.5fr)_100px_110px_minmax(140px,0.7fr)_24px] items-center gap-4 px-5 transition hover:bg-subtle"><span className="flex min-w-0 items-center gap-3"><AgentAvatar agent={agent} size={48} /><span className="min-w-0"><strong className="block truncate text-sm font-semibold">{agent.name}</strong><span className="mt-1 block truncate text-xs text-text-muted">{agent.description || agent.code}</span></span></span><span className="text-sm text-text-muted">v{agent.version || 1}.0</span><span><span className={`status-badge ${agent.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{agent.status === "active" ? "已发布" : agent.status === "archived" ? "已归档" : "草稿"}</span></span><span className="truncate text-sm text-text-muted">{agent.llm_model_name || agent.model}</span><CaretRight size={18} className="text-text-muted" /></Link>)}</div>}</section><CreateAgentDialog open={dialogOpen} saving={saving} error={createError} onClose={() => setDialogOpen(false)} onSubmit={(input) => void submitCreate(input)} /></div>;
}
