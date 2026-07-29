"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, Plus, Warning } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { useAgents } from "@/modules/agents/queries";
import { resolveAgentLifecycle } from "@/modules/agents/lifecycle";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import { ErrorState, LoadingState } from "@/shared/ui/request-state";
import { SourceBadge } from "@/shared/ui/source-badge";
import { deriveWorkbenchTasks, readiness } from "./model";

const demoMetrics = [
  { label: "活跃用户", value: "637", change: "+8.6%" },
  { label: "对话", value: "1,284", change: "+8.6%" },
  { label: "积分收入", value: "12,460", change: "+8.6%" },
];

export function Workbench() {
  const query = useAgents();
  const router = useRouter();
  const demo = DATA_MODE === "demo";
  const agents = useMemo(() => query.data || [], [query.data]);
  const focusAgent =
    agents.find(
      (agent) => resolveAgentLifecycle(agent).state !== "published",
    ) || agents[0];
  const tasks = useMemo(() => deriveWorkbenchTasks(agents), [agents]);
  const focusReadiness = focusAgent ? readiness(focusAgent) : 0;

  if (query.isLoading) return <LoadingState label="正在加载工作台…" />;
  if (query.isError) return <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />;

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">工作台</h1>
            <span className="text-xs text-text-muted">
              {new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <p className="mt-1 text-xs text-text-muted">欢迎回来，继续完成你的 Agent</p>
        </div>
        <button type="button" onClick={() => router.push("/assets/create")} className="button-primary">
          <Plus size={16} weight="bold" />
          新建 Agent
        </button>
      </div>

      {focusAgent ? (
        <section>
          <div className="panel grid overflow-hidden rounded-xl shadow-sm xl:grid-cols-[minmax(0,1fr)_auto]">
            <div className="flex min-w-0 items-center gap-4 px-5 py-4">
              <AgentAvatar agent={focusAgent} size={68} className="shrink-0 rounded-lg" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                  <strong className="text-lg">{focusAgent.name}</strong>
                  <span className="text-xs text-text-muted">v{focusAgent.version || 1}.0</span>
                  <span className={`status-badge ${resolveAgentLifecycle(focusAgent).badgeClassName}`}>
                    {resolveAgentLifecycle(focusAgent).label}
                  </span>
                </div>
                <p className="mt-2 max-h-10 max-w-3xl overflow-hidden text-xs leading-5 text-text-muted">
                  {focusAgent.description || "继续完善身份、人设与运行配置"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t border-border px-5 py-4 xl:min-w-[440px] xl:border-l xl:border-t-0">
              <div className="min-w-[170px] flex-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium">发布准备度</span>
                  <strong className="text-success">{focusReadiness}%</strong>
                </div>
                <span className="mt-2 block h-1.5 overflow-hidden rounded-full bg-subtle">
                  <span className="block h-full rounded-full bg-success" style={{ width: `${focusReadiness}%` }} />
                </span>
              </div>
              <Link href={`/assets/${focusAgent.id}/build`} className="button-primary">
                继续构建
              </Link>
              <Link href={`/assets/${focusAgent.id}/test`} className="button-secondary">
                进入测试
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="panel rounded-xl px-5 py-8 text-center">
          <h2 className="text-sm font-semibold">从第一个 Agent Asset 开始</h2>
          <p className="mt-1.5 text-xs text-text-muted">通过四步向导完成基础设定、头像、角色设定稿和技能。</p>
          <button type="button" onClick={() => router.push("/assets/create")} className="button-primary mt-3">
            <Plus size={16} />
            新建 Agent
          </button>
        </section>
      )}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(340px,0.8fr)]">
        <section className="panel overflow-hidden rounded-xl">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="text-lg font-semibold">待处理事项</h2>
            <span className="rounded-md border border-border px-2 py-0.5 text-xs text-text-muted">{tasks.length} 项</span>
          </div>
          <div className="divide-y divide-border">
            {tasks.length ? (
              tasks.map((task) => (
                <div key={task.id} className="flex items-center gap-3 px-5 py-3 transition hover:bg-subtle">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      task.tone === "warning" ? "bg-orange-50 text-warning dark:bg-orange-400/10" : "bg-primary-soft text-primary"
                    }`}
                  >
                    {task.tone === "warning" ? <Warning size={16} weight="fill" /> : <Clock size={16} weight="fill" />}
                  </span>
                  <p className="min-w-0 flex-1 truncate text-xs">
                    <strong>{task.agentName}</strong>
                    <span className="text-text-muted"> · {task.title}</span>
                  </p>
                  <Link
                    href={task.href}
                    className="group inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-primary transition hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                  >
                    {task.action}
                    <ArrowRight className="transition-transform group-hover:translate-x-0.5" size={13} />
                  </Link>
                </div>
              ))
            ) : (
              <p className="px-5 py-8 text-center text-xs text-text-muted">当前没有待处理事项</p>
            )}
          </div>
        </section>

        <section className="panel overflow-hidden rounded-xl">
          <div className="flex items-center justify-between border-b border-border px-5 py-3">
            <h2 className="text-lg font-semibold">今日表现</h2>
            <SourceBadge source={demo ? "demo" : "unavailable"} />
          </div>
          {demo ? (
            <div className="p-5">
              <div className="grid grid-cols-3 divide-x divide-border">
                {demoMetrics.map((metric) => (
                  <div key={metric.label} className="px-3 first:pl-0">
                    <p className="text-xs text-text-muted">{metric.label}</p>
                    <strong className="mt-1.5 block text-xl font-medium">{metric.value}</strong>
                    <span className="mt-1 block text-xs text-success">较昨日 {metric.change}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-3">
                {[
                  ["OyiiOyii App", 86, "bg-indigo-500"],
                  ["网页聊天", 64, "bg-emerald-500"],
                  ["API 接入", 38, "bg-orange-500"],
                ].map(([label, value, color]) => (
                  <div key={String(label)}>
                    <div className="flex justify-between text-xs text-text-muted">
                      <span>{label}</span>
                      <span>{value}%</span>
                    </div>
                    <span className="mt-2 block h-2 rounded-full bg-subtle">
                      <span className={`block h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex min-h-48 items-center justify-center p-5">
              <div className="max-w-sm text-center">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-subtle text-text-muted">
                  <Warning size={20} />
                </span>
                <p className="mt-3 text-sm font-semibold">分析接口尚未接入</p>
                <p className="mt-1.5 text-xs leading-5 text-text-muted">接入后将在这里展示真实 Agent 的会话、留存和使用表现。</p>
              </div>
            </div>
          )}
        </section>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">最近资产</h2>
          <Link href="/assets" className="group flex items-center gap-1.5 text-xs font-medium text-primary">
            查看全部资产
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" size={13} />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {agents.slice(0, 6).map((agent) => (
            <Link
              key={agent.id}
              href={`/assets/${agent.id}/overview`}
              className="panel group flex h-40 flex-col overflow-hidden rounded-lg p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div className="flex min-h-0 min-w-0 flex-1 items-start gap-3 overflow-hidden">
                <AgentAvatar agent={agent} size={48} className="shrink-0 rounded-md" />
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-sm">{agent.name}</strong>
                  <span className="mt-1 block truncate text-xs text-text-muted">{agent.code}</span>
                  <span className="mt-1.5 block max-h-9 overflow-hidden text-xs leading-[18px] text-text-muted">
                    {agent.description || "继续完善 Agent 的身份、人设与能力配置"}
                  </span>
                </span>
              </div>
              <div className="mt-3 flex shrink-0 items-center justify-between border-t border-border pt-2.5">
                <span className={`status-badge ${resolveAgentLifecycle(agent).badgeClassName}`}>
                  {resolveAgentLifecycle(agent).label}
                </span>
                <span className="text-xs text-text-muted">v{agent.version || 1}.0</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
