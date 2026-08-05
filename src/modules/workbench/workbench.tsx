"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, Plus, Warning } from "@phosphor-icons/react";
import { useAgents } from "@/modules/agents/queries";
import { resolveAgentLifecycle } from "@/modules/agents/lifecycle";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import { assetHref } from "@/modules/agent-assets/library-model";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";
import { deriveWorkbenchTasks, readiness } from "./model";

export function Workbench() {
  const query = useAgents();
  const router = useRouter();
  const agents = useMemo(() => query.data || [], [query.data]);
  const focusAgent = agents.find((agent) => resolveAgentLifecycle(agent).state !== "published") || agents[0];
  const recentAgents = useMemo(() => [...agents].sort((left, right) => (Date.parse(right.updated_at || "") || 0) - (Date.parse(left.updated_at || "") || 0)).slice(0, 6), [agents]);
  const tasks = useMemo(() => deriveWorkbenchTasks(agents), [agents]);

  if (query.isLoading) return <LoadingState label="正在加载工作台…" />;
  if (query.isError) return <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />;

  return (
    <div className="mx-auto w-full max-w-[1760px] space-y-7 pb-8">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
        <div><p className="text-sm font-medium text-primary">创作工作台</p><h1 className="mt-1 text-3xl font-bold tracking-tight">你的 Agent，正在生长</h1><p className="mt-2 text-sm text-text-secondary">从最近的进度继续，完成构建、测试与发布。</p></div>
        <button type="button" onClick={() => router.push("/assets/create")} className="button-primary"><Plus size={17} weight="bold" />创建 Agent</button>
      </header>

      <section aria-labelledby="continue-heading">
        <div className="mb-3 flex items-center justify-between"><h2 id="continue-heading" className="text-xl font-semibold">继续创作</h2>{focusAgent && <span className="text-xs text-text-muted">完成度来自当前真实配置</span>}</div>
        {focusAgent ? <div className="panel grid overflow-hidden xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
          <div className="flex min-w-0 items-center gap-5 p-5 sm:p-6"><AgentAvatar agent={focusAgent} size={96} className="shrink-0 rounded-xl ring-1 ring-border" /><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className={`status-badge ${resolveAgentLifecycle(focusAgent).badgeClassName}`}>{resolveAgentLifecycle(focusAgent).label}</span><span className="text-xs text-text-muted">{focusAgent.current_version_id ? `v${focusAgent.version}` : "未发布草稿"}</span></div><h3 className="mt-3 truncate text-2xl font-semibold" title={focusAgent.name}>{focusAgent.name}</h3><p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-6 text-text-secondary">{focusAgent.description || "继续完善身份、人设与运行配置。"}</p></div></div>
          <div className="flex flex-col justify-center border-t border-border p-5 xl:border-l xl:border-t-0"><div className="flex items-center justify-between text-sm"><span>配置完成度</span><strong className="text-primary">{readiness(focusAgent)}%</strong></div><span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-subtle"><span className="block h-full rounded-full bg-primary" style={{ width: `${readiness(focusAgent)}%` }} /></span><div className="mt-5 flex flex-wrap gap-2"><Link href={`/assets/${focusAgent.id}/build`} className="button-primary flex-1">打开工作区<ArrowRight size={16} /></Link><Link href={`/assets/${focusAgent.id}/test`} className="button-secondary">测试</Link></div></div>
        </div> : <div className="panel grid min-h-52 place-items-center px-6 text-center"><div><h3 className="font-semibold">从第一个 Agent 开始</h3><p className="mt-2 text-sm text-text-muted">沿用现有四步创建流程，完成后仍是未发布草稿。</p><button type="button" onClick={() => router.push("/assets/create")} className="button-primary mt-5"><Plus size={16} />创建 Agent</button></div></div>}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.6fr)]">
        <section aria-labelledby="recent-heading"><div className="mb-3 flex items-center justify-between"><h2 id="recent-heading" className="text-xl font-semibold">最近 Agent</h2><Link href="/assets" className="inline-flex items-center gap-1 text-sm font-medium text-primary">查看全部<ArrowRight size={14} /></Link></div>{recentAgents.length ? <div className="grid gap-3 sm:grid-cols-2">{recentAgents.map((agent) => <Link key={agent.id} href={assetHref(agent)} className="panel group flex min-w-0 items-center gap-3 p-3 transition hover:border-primary/45"><AgentAvatar agent={agent} size={52} className="shrink-0 rounded-lg" /><span className="min-w-0 flex-1"><strong className="block truncate" title={agent.name}>{agent.name}</strong><span className="mt-1 block truncate text-xs text-text-muted">{agent.description || agent.code}</span></span><span className={`status-badge shrink-0 ${resolveAgentLifecycle(agent).badgeClassName}`}>{resolveAgentLifecycle(agent).label}</span><ArrowRight size={15} className="shrink-0 text-text-muted group-hover:text-primary" /></Link>)}</div> : <div className="panel p-8 text-center text-sm text-text-muted">创建后，最近编辑的 Agent 会出现在这里。</div>}</section>

        <section aria-labelledby="tasks-heading"><div className="mb-3 flex items-center justify-between"><h2 id="tasks-heading" className="text-xl font-semibold">待处理事项</h2><span className="text-xs text-text-muted">{tasks.length} 项</span></div><div className="panel divide-y divide-border overflow-hidden">{tasks.length ? tasks.map((task) => <div key={task.id} className="flex items-center gap-3 p-4"><span className={`grid size-9 shrink-0 place-items-center rounded-full ${task.tone === "warning" ? "bg-warning/10 text-warning" : "bg-info/10 text-info"}`}>{task.tone === "warning" ? <Warning size={17} /> : <Clock size={17} />}</span><p className="min-w-0 flex-1 text-sm"><strong className="block truncate">{task.agentName}</strong><span className="block truncate text-xs text-text-muted">{task.title}</span></p><Link href={task.href} className="button-secondary control-compact shrink-0">{task.action}</Link></div>) : <div className="p-8 text-center"><p className="text-sm font-medium">当前没有待处理事项</p><p className="mt-1 text-xs text-text-muted">这里只根据 Agent 当前真实字段生成行动建议。</p></div>}</div></section>
      </div>
    </div>
  );
}
