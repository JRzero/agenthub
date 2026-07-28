"use client";

import { useMemo, useState } from "react";
import { FileText, Info } from "@phosphor-icons/react";
import { capabilitySource } from "@/config/capabilities";
import { FutureModulePage } from "@/shared/ui/future-module-page";
import { SourceBadge } from "@/shared/ui/source-badge";
import { Select } from "@/shared/ui/select";
import { TrendChart } from "@/shared/ui/trend-chart";
import { REVENUE_COST, REVENUE_INCOME, REVENUE_LABELS, REVENUE_SOURCES } from "./fixtures";
import { RevenueTable } from "./revenue-table";

export function RevenueWorkspace() {
  const source = capabilitySource("revenue");
  const [month, setMonth] = useState("2026-07");
  const [granularity, setGranularity] = useState("day");
  const [sourceFilter, setSourceFilter] = useState("all");
  const chartSeries = useMemo(() => [
    { label: "收入", color: "#5b5ce2", values: REVENUE_INCOME },
    { label: "成本", color: "#16a468", values: REVENUE_COST },
  ], []);

  if (source !== "demo") return <FutureModulePage eyebrow="工作空间" title="收益中心" source={source} description="使用量、积分、授权收益和人工结算表必须来自可审计的数据源；当前只保留产品入口。" />;

  return <main className="space-y-5 p-6 lg:p-8"><header className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><h1 className="text-2xl font-semibold">收益中心</h1><SourceBadge source={source} /></div><button type="button" className="button-primary"><FileText size={18} />查看演示结算单</button></header>
    <Select ariaLabel="结算月份" value={month} onValueChange={setMonth} options={[{ value: "2026-07", label: "2026年7月" }, { value: "2026-06", label: "2026年6月" }]} />
    <section className="panel grid divide-y divide-border md:grid-cols-4 md:divide-x md:divide-y-0"><Metric label="本月收入" value="24,680" suffix="积分" /><Metric label="平台与运行成本" value="7,420" suffix="积分" /><Metric label="预计可结算" value="17,260" suffix="积分" success /><Metric label="结算状态" value="待月末确认" warning /></section>
    <p className="text-xs text-text-muted">积分为应用端结算单位；当前页面为演示数据，最终金额以服务端月度结算单为准。</p>
    <section className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_430px]"><article className="panel p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-lg font-semibold">收入与成本趋势</h2><div className="flex gap-2"><Select ariaLabel="统计粒度" value={granularity} onValueChange={setGranularity} options={[{ value: "day", label: "按日" }, { value: "week", label: "按周" }]} /><Select ariaLabel="收益来源" value={sourceFilter} onValueChange={setSourceFilter} options={[{ value: "all", label: "全部来源" }, { value: "runtime", label: "运行调用" }, { value: "license", label: "Agent 授权" }]} /></div></div><div className="mt-4 flex gap-5 text-sm"><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-primary" />收入（积分）</span><span className="flex items-center gap-2"><i className="size-2 rounded-full bg-success" />成本（积分）</span></div><TrendChart labels={REVENUE_LABELS} series={chartSeries} ariaLabel={`${month}收入与成本趋势，${granularity === "day" ? "按日" : "按周"}展示`} /></article>
      <article className="panel overflow-hidden"><div className="border-b border-border px-5 py-4"><h2 className="text-lg font-semibold">收入构成</h2></div><div className="divide-y divide-border">{REVENUE_SOURCES.map((item) => <div key={item.name} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-4"><span className="font-medium">{item.name}</span><span>{item.value.toLocaleString()}</span><span className="w-14 text-right text-text-muted">{item.share}</span></div>)}</div><div className="grid grid-cols-[1fr_auto] border-t border-border bg-subtle px-5 py-4 font-semibold"><span>合计</span><span>24,680</span></div></article></section>
    <RevenueTable />
  </main>;
}

function Metric({ label, value, suffix, success, warning }: { label: string; value: string; suffix?: string; success?: boolean; warning?: boolean }) { return <article className="p-5"><p className="flex items-center gap-1 text-sm text-text-muted">{label}<Info size={14} /></p><p className={`mt-2 text-2xl font-semibold ${success ? "text-success" : warning ? "text-warning" : ""}`}>{value} {suffix && <span className="text-sm font-normal text-text-muted">{suffix}</span>}</p></article>; }
