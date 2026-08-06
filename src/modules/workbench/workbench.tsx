"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CaretLeft, CaretRight, Clock, Cpu, Plus } from "@phosphor-icons/react";
import { useAgents } from "@/modules/agents/queries";
import type { Agent } from "@/modules/agents/types";
import { resolveAgentLifecycle, type AgentLifecycleState } from "@/modules/agents/lifecycle";
import { AgentArtwork, AgentAvatar } from "@/modules/agents/agent-avatar";
import { assetHref } from "@/modules/agent-assets/library-model";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";
import { countAgentLifecycles, deriveWorkbenchTasks, orderWorkbenchAgents, readiness, selectWorkbenchStage } from "./model";

const lifecycleOrder: AgentLifecycleState[] = ["published", "draft", "creating", "unpublished", "archived"];

function continueHref(agent: Agent): string {
  return agent.creation_completed === false ? assetHref(agent) : `/assets/${agent.id}/build`;
}

function updatedLabel(value?: string): string {
  if (!value || Number.isNaN(Date.parse(value))) return "暂无更新时间";
  return new Intl.DateTimeFormat("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

export function Workbench() {
  const query = useAgents();
  const router = useRouter();
  const agents = useMemo(() => query.data || [], [query.data]);
  const orderedAgents = useMemo(() => orderWorkbenchAgents(agents), [agents]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    if (!orderedAgents.length) {
      setSelectedId(null);
      return;
    }
    if (!orderedAgents.some((agent) => agent.id === selectedId)) setSelectedId(orderedAgents[0].id);
  }, [orderedAgents, selectedId]);

  const stage = useMemo(() => selectWorkbenchStage(orderedAgents, selectedId), [orderedAgents, selectedId]);
  const selectedIndex = stage.index;
  const focusAgent = stage.focus;
  const recentAgents = useMemo(() => [...agents].sort((left, right) => (Date.parse(right.updated_at || "") || 0) - (Date.parse(left.updated_at || "") || 0)).slice(0, 3), [agents]);
  const tasks = useMemo(() => deriveWorkbenchTasks(agents), [agents]);
  const focusTask = focusAgent ? tasks.find((task) => task.agentId === focusAgent.id) : undefined;
  const lifecycleCounts = useMemo(() => {
    const counts = countAgentLifecycles(agents);
    return lifecycleOrder.map((state) => ({
    state,
    label: state === "published" ? "已发布" : state === "draft" ? "草稿" : state === "creating" ? "创建中" : state === "unpublished" ? "已下架" : "已归档",
    count: counts[state],
  })).filter((item) => item.count > 0 || ["published", "draft", "creating"].includes(item.state));
  }, [agents]);

  const selectRelative = (offset: number) => {
    if (orderedAgents.length < 2) return;
    const nextIndex = (selectedIndex + offset + orderedAgents.length) % orderedAgents.length;
    setSelectedId(orderedAgents[nextIndex].id);
  };

  if (query.isLoading) return <LoadingState label="正在加载工作台…" />;
  if (query.isError) return <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />;

  return (
    <div className="mx-auto w-full max-w-[1760px] pb-8" data-testid="workbench-stage-page">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-4">
        <div><h1 className="text-3xl font-bold tracking-tight">你的 Agent，正在生长</h1><p className="mt-1.5 text-sm text-text-secondary">在角色舞台浏览当前资产，回到创作的下一步。</p></div>
        <button type="button" onClick={() => router.push("/assets/create")} className="button-primary"><Plus size={17} weight="bold" />创建 Agent</button>
      </header>

      {focusAgent ? <>
        <section aria-label="Agent 舞台" className="grid gap-4 min-[1180px]:grid-cols-[minmax(0,1fr)_280px]">
          <div data-testid="workbench-agent-stage" className="panel relative min-h-[460px] overflow-hidden px-4 py-5 sm:px-6">
            {orderedAgents.length > 1 && <>
              <button type="button" aria-label="上一个 Agent" onClick={() => selectRelative(-1)} className="absolute left-3 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-surface/90 text-text-secondary shadow-lg hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"><CaretLeft size={20} /></button>
              <button type="button" aria-label="下一个 Agent" onClick={() => selectRelative(1)} className="absolute right-3 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-surface/90 text-text-secondary shadow-lg hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"><CaretRight size={20} /></button>
            </>}
            <div className={`mx-auto grid min-h-[420px] max-w-[900px] items-end justify-center gap-3 ${orderedAgents.length === 1 ? "grid-cols-[minmax(260px,360px)]" : orderedAgents.length === 2 ? "grid-cols-[minmax(180px,270px)_minmax(270px,360px)]" : "grid-cols-[minmax(150px,0.78fr)_minmax(270px,1.08fr)_minmax(150px,0.78fr)]"}`}>
              {stage.previous && <StageSideCard agent={stage.previous} onSelect={setSelectedId} />}
              <StageFocusCard agent={focusAgent} />
              {stage.next && <StageSideCard agent={stage.next} onSelect={setSelectedId} />}
            </div>
          </div>

          <aside className="panel flex min-h-[460px] flex-col p-5" aria-label="当前 Agent 详情" data-testid="workbench-agent-detail">
            <div className="flex items-center justify-between gap-3"><span className={`status-badge ${resolveAgentLifecycle(focusAgent).badgeClassName}`}>{resolveAgentLifecycle(focusAgent).label}</span><span className="text-xs text-text-muted">{focusAgent.current_version_id ? `v${focusAgent.version}` : "尚未发布版本"}</span></div>
            <h2 className="mt-5 truncate text-xl font-semibold" title={focusAgent.name}>{focusAgent.name}</h2>
            <p className="mt-2 line-clamp-3 min-h-[3.75rem] text-sm leading-5 text-text-secondary">{focusAgent.description || focusAgent.tagline || "暂无描述，进入工作区完善 Agent。"}</p>
            <dl className="mt-5 space-y-3 border-y border-border py-4 text-sm">
              <DetailRow label="配置完成度" value={`${readiness(focusAgent)}%`} />
              <DetailRow label="Agent 编码" value={focusAgent.code || `agent-${focusAgent.id}`} />
              <DetailRow label="运行模型" value={focusAgent.llm_model_name || focusAgent.model || "尚未配置"} />
              <DetailRow label="最近更新" value={updatedLabel(focusAgent.updated_at)} />
            </dl>
            {focusTask && <div className="mt-4 rounded-lg bg-subtle p-3"><p className="text-[11px] font-medium uppercase tracking-[0.12em] text-text-muted">下一步</p><p className="mt-1.5 text-sm font-medium">{focusTask.title}</p><Link href={focusTask.href} className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary">{focusTask.action}<ArrowRight size={13} /></Link></div>}
            <div className="mt-auto grid grid-cols-[1fr_auto] gap-2 pt-5"><Link href={continueHref(focusAgent)} className="button-primary">打开工作区<ArrowRight size={16} /></Link><Link href={`/assets/${focusAgent.id}/test`} className="button-secondary">测试</Link></div>
          </aside>
        </section>

        <section aria-label="Agent 状态汇总" className="mt-4 grid divide-y divide-border border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {lifecycleCounts.slice(0, 3).map((item) => <button key={item.state} type="button" onClick={() => router.push(`/assets`)} className="flex min-h-12 items-center justify-center gap-2 px-4 text-sm text-text-secondary hover:bg-subtle hover:text-text-strong"><span className={`size-2 rounded-full ${item.state === "published" ? "bg-success" : item.state === "creating" ? "bg-info" : "bg-warning"}`} aria-hidden="true" /><span>{item.label}</span><strong>{item.count}</strong><CaretRight size={14} className="text-text-muted" /></button>)}
        </section>

        <section aria-labelledby="recent-heading" className="mt-4">
          <div className="mb-2 flex items-center justify-between"><h2 id="recent-heading" className="text-lg font-semibold">最近继续</h2><Link href="/assets" className="inline-flex items-center gap-1 text-sm font-medium text-primary">查看全部<ArrowRight size={14} /></Link></div>
          <div className="space-y-2">{recentAgents.map((agent) => <Link key={agent.id} href={continueHref(agent)} className="panel group grid min-h-12 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-3 py-2 transition hover:border-primary/45 sm:grid-cols-[auto_minmax(160px,1fr)_minmax(140px,0.8fr)_auto]"><AgentAvatar agent={agent} size={38} className="rounded-lg" /><strong className="truncate text-sm" title={agent.name}>{agent.name}</strong><span className="hidden truncate text-xs text-text-muted sm:block">{updatedLabel(agent.updated_at)}</span><span className="flex items-center gap-2"><span className={`status-badge ${resolveAgentLifecycle(agent).badgeClassName}`}>{resolveAgentLifecycle(agent).label}</span><CaretRight size={15} className="text-text-muted group-hover:text-primary" /></span></Link>)}</div>
        </section>
      </> : <div className="panel grid min-h-72 place-items-center px-6 text-center"><div><h2 className="font-semibold">从第一个 Agent 开始</h2><p className="mt-2 text-sm text-text-muted">沿用现有四步创建流程，完成后仍是未发布草稿。</p><button type="button" onClick={() => router.push("/assets/create")} className="button-primary mt-5"><Plus size={16} />创建 Agent</button></div></div>}
    </div>
  );
}

function StageSideCard({ agent, onSelect }: { agent: Agent; onSelect: (id: number) => void }) {
  return <button type="button" onClick={() => onSelect(agent.id)} aria-label={`切换到 ${agent.name}`} className="group relative mb-5 hidden h-[350px] min-w-0 overflow-hidden rounded-xl border border-border bg-surface text-left transition hover:-translate-y-1 hover:border-primary/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary sm:block"><AgentArtwork agent={agent} /><span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-canvas via-canvas/90 to-transparent p-4 pt-16"><strong className="block truncate text-lg">{agent.name}</strong><span className="mt-1 block text-xs text-text-secondary">{resolveAgentLifecycle(agent).label}{agent.current_version_id ? ` · v${agent.version}` : ""}</span></span></button>;
}

function StageFocusCard({ agent }: { agent: Agent }) {
  return <article className="relative z-10 h-[420px] min-w-0 overflow-hidden rounded-xl border border-primary/45 bg-surface shadow-2xl" data-testid="workbench-agent-hero"><AgentArtwork agent={agent} /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-canvas via-canvas/95 to-transparent px-5 pb-5 pt-24"><div className="flex flex-wrap items-center gap-2"><span className={`status-badge ${resolveAgentLifecycle(agent).badgeClassName}`}>{resolveAgentLifecycle(agent).label}</span>{agent.current_version_id && <span className="text-xs text-text-secondary">v{agent.version}</span>}</div><h2 className="mt-3 truncate text-2xl font-semibold" title={agent.name}>{agent.name}</h2><p className="mt-1.5 line-clamp-2 text-sm leading-5 text-text-secondary">{agent.description || agent.tagline || "暂无描述，进入工作区完善 Agent。"}</p><Link href={continueHref(agent)} className="button-primary pointer-events-auto mt-4 w-full">打开工作区<ArrowRight size={16} /></Link></div></article>;
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const Icon = label === "运行模型" ? Cpu : label === "最近更新" ? Clock : null;
  return <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] items-center gap-3"><dt className="flex items-center gap-1.5 text-xs text-text-muted">{Icon && <Icon size={14} />}{label}</dt><dd className="truncate text-right font-medium" title={value}>{value}</dd></div>;
}
