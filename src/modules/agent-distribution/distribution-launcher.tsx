"use client";

import Link from "next/link";
import { ArrowRight, PaperPlaneTilt } from "@phosphor-icons/react";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import { useAgents } from "@/modules/agents/queries";
import { resolveAgentLifecycle } from "@/modules/agents/lifecycle";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";

export function DistributionLauncher() {
  const query = useAgents();

  if (query.isLoading) return <LoadingState label="正在读取可发布的 Agent…" />;
  if (query.isError) return <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />;

  const agents = query.data || [];
  return (
    <div className="mx-auto w-full max-w-[1120px] pb-8">
      <header className="border-b border-border pb-5">
        <p className="text-sm font-medium text-primary">运营</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">发布中心</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">选择一个现有 Agent，进入其版本、Client 同步、公开分享与导出上下文。此处不创建新的发布流程。</p>
      </header>

      {agents.length ? (
        <section aria-label="选择要发布的 Agent" className="mt-6 grid gap-3 md:grid-cols-2">
          {agents.map((agent) => {
            const lifecycle = resolveAgentLifecycle(agent);
            return (
              <Link key={agent.id} href={`/assets/${agent.id}/distribution`} className="card group flex min-w-0 items-center gap-4 p-4">
                <AgentAvatar agent={agent} size={64} className="rounded-xl ring-1 ring-border" />
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-base" title={agent.name}>{agent.name}</strong>
                  <span className="mt-1 block truncate text-xs text-text-muted" title={agent.code}>{agent.code || `agent-${agent.id}`}</span>
                  <span className={`status-badge mt-2 ${lifecycle.badgeClassName}`}>{lifecycle.label}</span>
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary">进入发布<ArrowRight size={15} /></span>
              </Link>
            );
          })}
        </section>
      ) : (
        <section className="empty-state mt-6" aria-label="暂无可发布 Agent">
          <PaperPlaneTilt size={30} className="text-text-muted" />
          <h2 className="mt-4 font-semibold text-text-strong">暂无可选择的 Agent</h2>
          <p className="mt-2 max-w-md text-sm">创建并完成 Agent 配置后，再从这里进入其现有发布上下文。</p>
          <Link href="/assets/create" className="button-primary mt-5">创建 Agent</Link>
        </section>
      )}
    </div>
  );
}
