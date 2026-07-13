"use client";

import { useMemo, useState } from "react";
import { DownloadSimple, Info, Lightbulb, TrendUp } from "@phosphor-icons/react";
import { capabilitySource } from "@/config/capabilities";
import { SourceBadge } from "@/shared/ui/source-badge";
import { FutureModulePage } from "@/shared/ui/future-module-page";
import { TrendChart } from "@/shared/ui/trend-chart";
import { ANALYTICS_AGENTS, ANALYTICS_INSIGHTS, ANALYTICS_LABELS, ANALYTICS_SERIES } from "./fixtures";
import { formatMetric, metricSummary, type AnalyticsMetric } from "./model";

const metricCopy: Record<AnalyticsMetric, { label: string; color: string }> = {
  users: { label: "活跃用户", color: "#5b5ce2" },
  conversations: { label: "有效对话", color: "#16a468" },
  retention: { label: "次日留存", color: "#f97316" },
};

export function AnalyticsWorkspace() {
  const source = capabilitySource("analytics");
  const [metric, setMetric] = useState<AnalyticsMetric>("users");
  const [agent, setAgent] = useState("all");
  const [client, setClient] = useState("all");
  const [range, setRange] = useState("30");
  const summary = metricSummary(metric);
  const chartSeries = useMemo(
    () => [{ label: metricCopy[metric].label, color: metricCopy[metric].color, values: ANALYTICS_SERIES[metric] }],
    [metric],
  );

  if (source !== "demo") {
    return <FutureModulePage eyebrow="工作空间" title="数据分析" source={source} description="当前后端还没有跨 Agent、应用端与版本的统一分析接口；页面不会把设计稿示例指标呈现为线上事实。" />;
  }

  const handleExport = () => {
    const rows = [
      ["Agent", "活跃用户", "有效对话", "留存", "成本"],
      ...ANALYTICS_AGENTS.map((item) => [item.name, item.users, item.conversations, item.retention, item.cost]),
    ];
    const blob = new Blob([rows.map((row) => row.join(",")).join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "agenthub-demo-analytics.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="space-y-5 p-6 lg:p-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">数据分析</h1>
          <SourceBadge source={source} />
        </div>
        <button type="button" className="button-secondary" onClick={handleExport}><DownloadSimple size={18} />导出演示报告</button>
      </header>

      <section className="flex flex-wrap gap-3" aria-label="分析筛选">
        <select className="min-h-10 rounded-md border border-border bg-surface px-4" value={agent} onChange={(event) => setAgent(event.target.value)} aria-label="Agent 筛选">
          <option value="all">全部 Agent</option><option value="32">林月</option><option value="19">知识向导</option>
        </select>
        <select className="min-h-10 rounded-md border border-border bg-surface px-4" value={client} onChange={(event) => setClient(event.target.value)} aria-label="应用端筛选">
          <option value="all">全部应用端</option><option value="oyiioyii">OyiiOyii App</option><option value="web">网页聊天</option><option value="api">API 接入</option>
        </select>
        <select className="min-h-10 rounded-md border border-border bg-surface px-4" value={range} onChange={(event) => setRange(event.target.value)} aria-label="时间范围">
          <option value="7">近 7 天</option><option value="30">近 30 天</option><option value="90">近 90 天</option>
        </select>
      </section>

      <section className="panel grid divide-y divide-border overflow-hidden md:grid-cols-4 md:divide-x md:divide-y-0">
        {([
          ["活跃用户", "18,642", "+12.4%", "primary"],
          ["有效对话", "42,108", "+15.7%", "success"],
          ["次日留存", "38.6%", "-3.2%", "warning"],
          ["每次对话成本", "0.27 积分", "-6.1%", "primary"],
        ] as const).map(([label, value, change, tone]) => (
          <article key={label} className="flex items-center gap-4 p-5">
            <div className={`grid size-11 place-items-center rounded-full ${tone === "success" ? "bg-success/10 text-success" : tone === "warning" ? "bg-warning/10 text-warning" : "bg-primary-soft text-primary"}`}><TrendUp size={22} /></div>
            <div><p className="flex items-center gap-1 text-sm text-text-muted">{label}<Info size={14} /></p><p className="mt-1 text-2xl font-semibold">{value}</p><p className={`mt-1 text-xs ${change.startsWith("-") && label === "次日留存" ? "text-danger" : "text-success"}`}>较前一周期 {change}</p></div>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_360px]">
        <div className="panel p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-lg font-semibold">跨端表现趋势</h2><p className="mt-1 text-xs text-text-muted">当前筛选：{agent === "all" ? "全部 Agent" : "指定 Agent"} · {client === "all" ? "全部应用端" : "指定应用端"} · 近 {range} 天</p></div>
            <div className="flex rounded-md border border-border p-1" role="tablist" aria-label="指标切换">
              {(Object.keys(metricCopy) as AnalyticsMetric[]).map((key) => <button key={key} type="button" role="tab" aria-selected={metric === key} onClick={() => setMetric(key)} className={`rounded px-3 py-1.5 text-sm ${metric === key ? "bg-primary-soft text-primary" : "text-text-muted"}`}>{metricCopy[key].label}</button>)}
            </div>
          </div>
          <div className="mb-3 flex items-end gap-3"><span className="text-3xl font-semibold">{formatMetric(metric, summary.current)}</span><span className={`pb-1 text-sm ${summary.change >= 0 ? "text-success" : "text-danger"}`}>{summary.change >= 0 ? "+" : ""}{summary.change.toFixed(1)}%</span></div>
          <TrendChart labels={ANALYTICS_LABELS} series={chartSeries} ariaLabel={`${metricCopy[metric].label}趋势图`} />
        </div>
        <aside className="panel p-5"><h2 className="text-lg font-semibold">表现洞察</h2><div className="mt-2 divide-y divide-border">{ANALYTICS_INSIGHTS.map((item) => <article key={item.title} className="flex gap-3 py-4"><div className={`mt-0.5 grid size-9 shrink-0 place-items-center rounded-full ${item.tone === "success" ? "bg-success/10 text-success" : item.tone === "warning" ? "bg-warning/10 text-warning" : "bg-primary-soft text-primary"}`}><Lightbulb size={18} /></div><div><h3 className="font-medium">{item.title}</h3><p className="mt-1 text-sm leading-6 text-text-muted">{item.detail}</p></div></article>)}</div></aside>
      </section>

      <section className="panel overflow-hidden"><div className="border-b border-border px-5 py-4"><h2 className="text-lg font-semibold">Agent 表现</h2></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left"><thead className="bg-subtle text-xs text-text-muted"><tr><th className="px-5 py-3">Agent</th><th>活跃用户</th><th>有效对话</th><th>留存</th><th>成本</th><th>趋势</th></tr></thead><tbody>{ANALYTICS_AGENTS.map((item) => <tr key={item.id} className="border-t border-border"><td className="px-5 py-4 font-medium">{item.name}</td><td>{item.users.toLocaleString()}</td><td>{item.conversations.toLocaleString()}</td><td>{item.retention}</td><td>{item.cost}</td><td className="text-success">{item.trend}</td></tr>)}</tbody></table></div></section>
    </main>
  );
}
