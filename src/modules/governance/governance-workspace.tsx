"use client";

import { useMemo, useState } from "react";
import { Plus, ShieldCheck } from "@phosphor-icons/react";
import { capabilitySource } from "@/config/capabilities";
import { FutureModulePage } from "@/shared/ui/future-module-page";
import { SourceBadge } from "@/shared/ui/source-badge";
import { GOVERNANCE_AUDIT, GOVERNANCE_POLICIES, GOVERNANCE_RISKS, type GovernanceRisk } from "./fixtures";
import { sortGovernanceRisks, unresolvedRiskCount } from "./model";
import { RiskInspector } from "./risk-inspector";
import { RiskTable } from "./risk-table";

type GovernanceTab = "pending" | "policies" | "audit";

export function GovernanceWorkspace() {
  const source = capabilitySource("governance");
  const [tab, setTab] = useState<GovernanceTab>("pending");
  const [risks, setRisks] = useState(GOVERNANCE_RISKS);
  const [selectedId, setSelectedId] = useState(GOVERNANCE_RISKS[0].id);
  const selected = risks.find((risk) => risk.id === selectedId) || risks[0];
  const sortedRisks = useMemo(() => sortGovernanceRisks(risks), [risks]);

  if (source !== "demo") return <FutureModulePage eyebrow="工作空间" title="治理中心" source={source} description="IP 授权、内容安全、Memory 隐私、导出控制和审计日志需要独立治理契约；当前不会把演示风险写成生产事实。" />;

  const resolve = () => setRisks((items) => items.map((item) => item.id === selectedId ? { ...item, status: "resolved" } : item));
  const tabs: Array<[GovernanceTab, string]> = [["pending", `待处理 ${unresolvedRiskCount(risks)}`], ["policies", "策略"], ["audit", "审计记录"]];

  return <main className="min-h-full bg-canvas"><header className="border-b border-border bg-surface px-6 py-7 lg:px-8"><div className="flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><h1 className="text-2xl font-semibold">治理中心</h1><SourceBadge source={source} /></div><button type="button" className="button-primary" onClick={() => setTab("policies")}><Plus size={18} />创建治理策略</button></div><nav className="mt-5 flex w-fit rounded-lg border border-border bg-subtle p-1" aria-label="治理模块">{tabs.map(([key, label]) => <button key={key} type="button" onClick={() => setTab(key)} className={`min-w-28 rounded-md px-5 py-2 text-sm ${tab === key ? "bg-surface text-primary shadow-sm" : "text-text-muted"}`}>{label}</button>)}</nav></header>
    {tab === "pending" ? <section className="grid xl:grid-cols-[minmax(0,1fr)_360px]"><div className="space-y-5 p-6 lg:p-8"><div className="panel overflow-hidden"><div className="border-b border-border px-5 py-4"><h2 className="text-lg font-semibold">待处理风险</h2></div><RiskTable risks={sortedRisks} selectedId={selectedId} onSelect={(risk: GovernanceRisk) => setSelectedId(risk.id)} /></div><div className="grid gap-4 lg:grid-cols-3"><Summary title="IP 授权状态" items={["微信 · 已授权", "Web · 已授权", "API 接入 · 已授权", "小红书 · 待续期"]} /><Summary title="内容安全策略" items={GOVERNANCE_POLICIES.slice(0, 4)} /><Summary title="最近审计" items={GOVERNANCE_AUDIT.slice(0, 4)} /></div></div><RiskInspector risk={selected} onResolve={resolve} /></section> : tab === "policies" ? <ListPanel title="内容安全与数据策略" description="策略编辑尚未接入后端；以下为设计稿中的演示策略。" items={GOVERNANCE_POLICIES} /> : <ListPanel title="审计记录" description="审计记录为演示数据，生产环境必须来自不可篡改的服务端日志。" items={GOVERNANCE_AUDIT} />}
  </main>;
}

function Summary({ title, items }: { title: string; items: string[] }) { return <article className="panel p-5"><h3 className="font-semibold">{title}</h3><ul className="mt-3 space-y-3">{items.map((item) => <li key={item} className="flex items-center gap-2 text-sm text-text-muted"><ShieldCheck size={16} className="text-success" />{item}</li>)}</ul></article>; }

function ListPanel({ title, description, items }: { title: string; description: string; items: string[] }) { return <section className="p-6 lg:p-8"><div className="panel mx-auto max-w-4xl p-6"><h2 className="text-lg font-semibold">{title}</h2><p className="mt-2 text-sm text-text-muted">{description}</p><div className="mt-5 divide-y divide-border">{items.map((item) => <div key={item} className="flex items-center justify-between py-4"><span>{item}</span><span className="status-badge bg-success/10 text-success">演示启用</span></div>)}</div></div></section>; }
