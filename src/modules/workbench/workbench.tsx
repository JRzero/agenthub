"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, Plus, Warning } from "@phosphor-icons/react";
import { DATA_MODE } from "@/config/capabilities";
import { useAgents } from "@/modules/agents/queries";
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
  const focusAgent = agents.find((agent) => agent.status !== "active") || agents[0];
  const tasks = useMemo(() => deriveWorkbenchTasks(agents), [agents]);

  if (query.isLoading) return <LoadingState label="正在加载工作台…" />;
  if (query.isError) return <ErrorState message={query.error.message} onRetry={() => void query.refetch()} />;

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-baseline gap-4"><h1 className="text-3xl font-bold tracking-tight">工作台</h1><span className="text-sm text-text-muted">{new Date().toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" })}</span></div>
        <button type="button" onClick={() => router.push("/assets/create")} className="button-primary"><Plus size={18} weight="bold" />新建 Agent</button>
      </div>

      {focusAgent ? (
        <section>
          <h2 className="mb-3 text-lg font-semibold">继续构建</h2>
          <div className="panel flex flex-wrap items-center gap-5 px-5 py-4">
            <AgentAvatar agent={focusAgent} size={66} className="rounded-lg" />
            <div className="min-w-[180px] flex-1"><div className="flex flex-wrap items-center gap-3"><strong className="text-xl">{focusAgent.name}</strong><span className="text-sm text-text-muted">v{focusAgent.version || 1}.0</span><span className="status-badge bg-emerald-50 text-emerald-700">{focusAgent.status === "active" ? "已发布" : "草稿已保存"}</span></div><p className="mt-2 text-sm text-text-muted">{focusAgent.description || "继续完善身份、人设与运行配置"}</p></div>
            <div className="w-full min-w-[240px] max-w-sm border-l-0 border-border pl-0 md:w-auto md:border-l md:pl-6"><div className="flex justify-between text-sm"><span>发布准备度</span><strong className="text-success">{readiness(focusAgent)}%</strong></div><span className="mt-2 block h-2 overflow-hidden rounded-full bg-slate-200"><span className="block h-full rounded-full bg-success" style={{ width: `${readiness(focusAgent)}%` }} /></span></div>
            <Link href={`/assets/${focusAgent.id}/build`} className="button-primary">继续构建</Link><Link href={`/assets/${focusAgent.id}/test`} className="button-secondary">进入测试</Link>
          </div>
        </section>
      ) : (
        <section className="panel px-6 py-12 text-center"><h2 className="font-semibold">从第一个 Agent Asset 开始</h2><p className="mt-2 text-sm text-text-muted">通过四步向导完成基础设定、头像、角色设定稿和技能。</p><button type="button" onClick={() => router.push("/assets/create")} className="button-primary mt-4"><Plus size={17} />新建 Agent</button></section>
      )}

      <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.85fr)]">
        <div className="space-y-7">
          <section><h2 className="mb-3 text-lg font-semibold">待处理事项</h2><div className="panel divide-y divide-border">{tasks.length ? tasks.map((task) => <div key={task.id} className="flex items-center gap-3 px-4 py-3"><span className={`flex h-9 w-9 items-center justify-center rounded-full ${task.tone === "warning" ? "bg-orange-50 text-warning" : "bg-primary-soft text-primary"}`}>{task.tone === "warning" ? <Warning size={19} weight="fill" /> : <Clock size={19} weight="fill" />}</span><p className="min-w-0 flex-1 truncate text-sm"><strong>{task.agentName}</strong>：{task.title}</p><Link href={task.href} className="min-h-8 rounded border border-primary/50 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary-soft">{task.action}</Link></div>) : <p className="px-4 py-8 text-center text-sm text-text-muted">当前没有待处理事项</p>}</div></section>
          <section><div className="mb-3 flex items-center justify-between"><h2 className="text-lg font-semibold">最近资产</h2><Link href="/assets" className="flex items-center gap-1 text-sm text-primary">查看全部资产<ArrowRight size={15} /></Link></div><div className="panel divide-y divide-border">{agents.slice(0, 4).map((agent) => <Link key={agent.id} href={`/assets/${agent.id}/overview`} className="grid grid-cols-[minmax(0,1fr)_90px_100px] items-center gap-3 px-4 py-3 hover:bg-subtle"><span className="flex min-w-0 items-center gap-3"><AgentAvatar agent={agent} size={42} /><span className="min-w-0"><strong className="block truncate text-sm">{agent.name}</strong><span className="text-xs text-text-muted">{agent.code}</span></span></span><span className={`status-badge justify-self-start ${agent.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"}`}>{agent.status === "active" ? "已发布" : "构建中"}</span><span className="text-right text-xs text-text-muted">v{agent.version || 1}.0</span></Link>)}</div></section>
        </div>

        <section className="border-t border-border pt-5 xl:border-l xl:border-t-0 xl:pl-7 xl:pt-0"><div className="flex items-center justify-between"><h2 className="text-lg font-semibold">今日表现</h2><SourceBadge source={demo ? "demo" : "unavailable"} /></div>{demo ? <><div className="mt-5 grid grid-cols-3 divide-x divide-border">{demoMetrics.map((metric) => <div key={metric.label} className="px-3 first:pl-0"><p className="text-xs text-text-muted">{metric.label}</p><strong className="mt-2 block text-2xl font-medium">{metric.value}</strong><span className="mt-1 block text-xs text-success">较昨日 {metric.change}</span></div>)}</div><div className="mt-7 space-y-4">{[["OyiiOyii App",86,"bg-indigo-500"],["网页聊天",64,"bg-emerald-500"],["API 接入",38,"bg-orange-500"]].map(([label,value,color]) => <div key={String(label)}><div className="flex justify-between text-xs text-text-muted"><span>{label}</span><span>{value}%</span></div><span className="mt-2 block h-2 rounded-full bg-slate-200"><span className={`block h-full rounded-full ${color}`} style={{ width: `${value}%` }} /></span></div>)}</div></> : <div className="mt-5 rounded-lg border border-dashed border-border px-5 py-10 text-center"><p className="font-medium">分析接口尚未接入</p><p className="mt-2 text-sm leading-6 text-text-muted">工作台只展示真实 Agent 与派生待办，不会将设计稿指标冒充线上数据。</p></div>}</section>
      </div>
    </div>
  );
}
