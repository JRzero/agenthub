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
  const buildRoute = pathname === `${base}/build`;
  const navigation = (
    <nav className="flex gap-6 overflow-x-auto" aria-label="Agent Asset 工作区导航">
      {assetNavigation.map((item) => {
        const href = `${base}/${item.segment}`;
        const active = pathname === href;
        return <Link key={item.segment} href={href} aria-current={active ? "page" : undefined} className={`relative whitespace-nowrap px-1 pb-3 pt-0.5 text-sm font-medium transition ${active ? "text-primary" : "text-text-muted hover:text-text-strong"}`}>{item.label}{active && <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />}</Link>;
      })}
    </nav>
  );

  return (
    <header className="-mx-4 -mt-6 mb-3 border-b border-border bg-surface px-4 pt-3 sm:-mx-6 sm:px-6 lg:-mx-7 lg:px-7">
      <div className="flex flex-wrap items-center gap-3 pb-3">
        <AgentAvatar agent={agent} size={48} className="rounded-lg" />
        <div className="min-w-[220px] flex-1">
          <p className="truncate text-xs text-text-muted"><Link href="/assets" className="hover:text-primary">Agent 资产库</Link><span className="px-2">/</span>{agent.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-muted">
            <h1 className="mr-1 truncate text-xl font-bold tracking-tight text-text-strong">{agent.name}</h1>
            <span className="inline-flex items-center gap-1.5 font-medium text-text-strong"><span className={`h-2 w-2 rounded-full ${agent.status === "active" ? "bg-success" : "bg-warning"}`} />{agent.status === "active" ? "已发布" : "草稿"}</span>
            <span>核心资产 {overview.versionLabel}</span>
            <span className="inline-flex items-center gap-2"><span>准备度</span><strong className="text-success">{overview.completeness}%</strong><span className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-slate-200 sm:block"><span className="block h-full rounded-full bg-success" style={{ width: `${overview.completeness}%` }} /></span></span>
            <SourceBadge source={overview.completenessSource} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {buildRoute ? (
            <Link href={`${base}/test`} className="button-secondary min-h-9 px-3"><Play size={16} />运行测试</Link>
          ) : (
            <Link href={`${base}/build`} className="button-secondary min-h-9 px-3"><Wrench size={16} />继续构建</Link>
          )}
          <AssetActions agent={agent} />
        </div>
      </div>
      {navigation}
    </header>
  );
}
