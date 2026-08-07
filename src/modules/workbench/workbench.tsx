"use client";

import Link from "next/link";
import { useCallback, useMemo, useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CaretLeft, CaretRight, Clock, Cpu, Plus } from "@phosphor-icons/react";
import { useAgents } from "@/modules/agents/queries";
import type { Agent } from "@/modules/agents/types";
import { resolveAgentLifecycle, type AgentLifecycleState } from "@/modules/agents/lifecycle";
import { AgentArtwork, AgentAvatar } from "@/modules/agents/agent-avatar";
import { assetHref } from "@/modules/agent-assets/library-model";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";
import { countAgentLifecycles, deriveWorkbenchTasks, orderWorkbenchAgents, readiness, selectWorkbenchStage } from "./model";
import motionStyles from "./workbench-transition.module.css";
import { boundedCarouselSlot, circularAgentSlot, useWorkbenchAgentTransition } from "./workbench-transition";
import { useDocumentHidden, usePrefersReducedMotion, useWorkbenchAutoplay } from "./workbench-autoplay";

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
  const orderedAgentIds = useMemo(() => orderedAgents.map((agent) => agent.id), [orderedAgents]);
  const transition = useWorkbenchAgentTransition(orderedAgentIds);
  const { request, requestRelative } = transition;
  const [stageHovered, setStageHovered] = useState(false);
  const [stageFocusWithin, setStageFocusWithin] = useState(false);
  const [autoplayResetGeneration, resetAutoplay] = useReducer((generation: number) => generation + 1, 0);
  const reducedMotion = usePrefersReducedMotion();
  const documentHidden = useDocumentHidden();
  const requestAutomaticNext = useCallback(() => requestRelative(1), [requestRelative]);
  const requestManualRelative = useCallback((offset: number) => {
    resetAutoplay();
    requestRelative(offset);
  }, [requestRelative]);
  const requestManualAgent = useCallback((id: number, direction: -1 | 1) => {
    resetAutoplay();
    request(id, direction);
  }, [request]);
  useWorkbenchAutoplay({
    agentCount: orderedAgents.length,
    phase: transition.phase,
    hovered: stageHovered,
    focusWithin: stageFocusWithin,
    documentHidden,
    reducedMotion,
  }, autoplayResetGeneration, requestAutomaticNext);
  const stage = useMemo(() => selectWorkbenchStage(orderedAgents, transition.displayedId), [orderedAgents, transition.displayedId]);
  const focusAgent = stage.focus;
  const recentAgents = useMemo(() => [...agents].sort((left, right) => (Date.parse(right.updated_at || "") || 0) - (Date.parse(left.updated_at || "") || 0)).slice(0, 3), [agents]);
  const tasks = useMemo(() => deriveWorkbenchTasks(agents), [agents]);
  const focusTask = focusAgent ? tasks.find((task) => task.agentId === focusAgent.id) : undefined;
  const stableStageHeight = tasks.length > 0 ? 522 : 460;
  const lifecycleCounts = useMemo(() => {
    const counts = countAgentLifecycles(agents);
    return lifecycleOrder.map((state) => ({
    state,
    label: state === "published" ? "已发布" : state === "draft" ? "草稿" : state === "creating" ? "创建中" : state === "unpublished" ? "已下架" : "已归档",
    count: counts[state],
  })).filter((item) => item.count > 0 || ["published", "draft", "creating"].includes(item.state));
  }, [agents]);

  if (query.isLoading) return <LoadingState label="正在加载工作台…" />;
  if (query.isError) return <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />;

  return (
    <div className="mx-auto w-full max-w-[1760px] pb-8" data-testid="workbench-stage-page">
      <header className="flex flex-wrap items-end justify-between gap-4 pb-4">
        <div><h1 className="text-3xl font-bold tracking-tight">你的 Agent，正在生长</h1><p className="mt-1.5 text-sm text-text-secondary">在角色舞台浏览当前资产，回到创作的下一步。</p></div>
        <button type="button" onClick={() => router.push("/assets/create")} className="button-primary"><Plus size={17} weight="bold" />创建 Agent</button>
      </header>

      {focusAgent ? <>
        <section aria-label="Agent 舞台" className="grid gap-4 min-[1180px]:grid-cols-[minmax(0,1fr)_280px]" data-transition-phase={transition.phase} data-transition-direction={transition.direction < 0 ? "previous" : "next"}>
          <div
            data-testid="workbench-agent-stage"
            className="panel relative overflow-hidden px-4 py-5 sm:px-6"
            style={{ minHeight: stableStageHeight }}
            onMouseEnter={() => setStageHovered(true)}
            onMouseLeave={() => setStageHovered(false)}
            onFocusCapture={() => setStageFocusWithin(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setStageFocusWithin(false);
            }}
          >
            {orderedAgents.length > 1 && <>
              <button type="button" aria-label="上一个 Agent" onClick={() => requestManualRelative(-1)} className="absolute left-3 top-1/2 z-[60] grid size-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-surface/95 text-text-secondary shadow-lg hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"><CaretLeft size={20} /></button>
              <button type="button" aria-label="下一个 Agent" onClick={() => requestManualRelative(1)} className="absolute right-3 top-1/2 z-[60] grid size-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-surface/95 text-text-secondary shadow-lg hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"><CaretRight size={20} /></button>
            </>}
            <div className={`${motionStyles.viewport} mx-auto min-h-[420px] w-full max-w-[900px]`} data-testid="workbench-carousel-viewport">
              <LayeredStage
                agents={orderedAgents}
                agentIds={orderedAgentIds}
                displayedId={transition.displayedId}
                visualFocusId={transition.phase === "sliding" ? transition.targetId : transition.displayedId}
                sliding={transition.phase === "sliding"}
                onSelect={requestManualAgent}
              />
            </div>
          </div>

          <aside className="panel overflow-hidden p-5" aria-label="当前 Agent 详情" data-testid="workbench-agent-detail" style={{ minHeight: stableStageHeight }}>
            <div className="flex h-full min-h-0 flex-col">
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
            </div>
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

function LayeredStage({
  agents,
  agentIds,
  displayedId,
  visualFocusId,
  sliding,
  onSelect,
}: {
  agents: Agent[];
  agentIds: number[];
  displayedId: number | null;
  visualFocusId: number | null;
  sliding: boolean;
  onSelect: (id: number, direction: -1 | 1) => void;
}) {
  return (
    <div className={motionStyles.layer} data-testid="workbench-carousel-layer">
      {agents.map((agent) => {
        const committedSlot = boundedCarouselSlot(circularAgentSlot(agentIds, displayedId, agent.id));
        const visualSlot = boundedCarouselSlot(circularAgentSlot(agentIds, visualFocusId, agent.id));
        const visible = Math.abs(committedSlot) <= 2 || Math.abs(visualSlot) <= 2;
        const primary = !sliding && agent.id === displayedId;
        const selectable = !sliding && visible && visualSlot !== 0;
        return (
          <LayeredStageCard
            key={agent.id}
            agent={agent}
            slot={visualSlot}
            visible={visible}
            primary={primary}
            selectable={selectable}
            onSelect={() => onSelect(agent.id, visualSlot < 0 ? -1 : 1)}
          />
        );
      })}
    </div>
  );
}

function LayeredStageCard({
  agent,
  slot,
  visible,
  primary,
  selectable,
  onSelect,
}: {
  agent: Agent;
  slot: -3 | -2 | -1 | 0 | 1 | 2 | 3;
  visible: boolean;
  primary: boolean;
  selectable: boolean;
  onSelect: () => void;
}) {
  return (
    <article
      className={motionStyles.card}
      data-agent-id={agent.id}
      data-primary={primary}
      data-slot={slot}
      data-visible={visible}
      data-testid={`workbench-carousel-card-${agent.id}`}
      aria-hidden={visible ? undefined : true}
      inert={visible ? undefined : true}
    >
      <AgentArtwork agent={agent} />
      {selectable && <button type="button" onClick={onSelect} aria-label={`切换到 ${agent.name}`} className={motionStyles.sideSelect} />}
      <div className={motionStyles.cardCopy}>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`status-badge ${resolveAgentLifecycle(agent).badgeClassName}`}>{resolveAgentLifecycle(agent).label}</span>
          {agent.current_version_id && <span className="text-xs text-text-secondary">v{agent.version}</span>}
        </div>
        <h2 className={motionStyles.cardTitle} title={agent.name}>{agent.name}</h2>
        <div className={motionStyles.centerOnly}>
          <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-text-secondary">{agent.description || agent.tagline || "暂无描述，进入工作区完善 Agent。"}</p>
          <Link href={continueHref(agent)} tabIndex={primary ? undefined : -1} aria-hidden={primary ? undefined : true} className="button-primary mt-4 w-full">打开工作区<ArrowRight size={16} /></Link>
        </div>
      </div>
    </article>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const Icon = label === "运行模型" ? Cpu : label === "最近更新" ? Clock : null;
  return <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] items-center gap-3"><dt className="flex items-center gap-1.5 text-xs text-text-muted">{Icon && <Icon size={14} />}{label}</dt><dd className="truncate text-right font-medium" title={value}>{value}</dd></div>;
}
