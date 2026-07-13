"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Play, Wrench } from "@phosphor-icons/react";
import type { AgentAssetOverview } from "./model";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import { assetNavigation } from "@/shared/layout/navigation";
import { SourceBadge } from "@/shared/ui/source-badge";
import { AssetActions } from "./asset-actions";

export function AssetWorkspaceHeader({ overview }: { overview: AgentAssetOverview }) {
  const pathname = usePathname();
  const { agent } = overview;
  const base = `/assets/${agent.id}`;

  return <header className="-mx-4 -mt-6 mb-5 border-b border-border bg-surface px-4 pt-5 sm:-mx-6 sm:px-6 lg:-mx-7 lg:px-7"><p className="text-sm text-text-muted"><Link href="/assets" className="hover:text-primary">Agent 资产库</Link><span className="px-2">/</span>{agent.name}</p><div className="mt-4 flex flex-wrap items-center gap-5 pb-5"><AgentAvatar agent={agent} size={92} className="rounded-lg" /><div className="min-w-[260px] flex-1"><h1 className="text-[30px] font-bold tracking-tight">{agent.name}</h1><div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-text-muted"><span className="inline-flex items-center gap-2 font-medium text-text-strong"><span className={`h-2.5 w-2.5 rounded-full ${agent.status === "active" ? "bg-success" : "bg-warning"}`} />{agent.status === "active" ? "已发布" : "草稿"}</span><span className="h-4 w-px bg-border" /><span>核心资产 {overview.versionLabel}</span><span className="h-4 w-px bg-border" /><span>发布准备度</span><strong className="text-success">{overview.completeness}%</strong><span className="h-1.5 w-32 overflow-hidden rounded-full bg-slate-200"><span className="block h-full rounded-full bg-success" style={{ width: `${overview.completeness}%` }} /></span><SourceBadge source={overview.completenessSource} /></div></div><div className="flex items-center gap-3"><Link href={`${base}/build`} className="button-primary"><Wrench size={17} />继续构建</Link><Link href={`${base}/test`} className="button-secondary"><Play size={17} />运行测试</Link><AssetActions agent={agent} /></div></div><nav className="flex gap-8 overflow-x-auto" aria-label="Agent Asset 工作区导航">{assetNavigation.map((item) => { const href = `${base}/${item.segment}`; const active = pathname === href; return <Link key={item.segment} href={href} aria-current={active ? "page" : undefined} className={`relative whitespace-nowrap px-1 pb-4 pt-1 text-sm font-medium transition ${active ? "text-primary" : "text-text-muted hover:text-text-strong"}`}>{item.label}{active && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />}</Link>; })}</nav></header>;
}
