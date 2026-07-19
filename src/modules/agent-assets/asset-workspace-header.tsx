"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Copy,
  DownloadSimple,
  PencilSimple,
  Play,
  Wrench,
} from "@phosphor-icons/react";
import type { AgentAssetOverview } from "./model";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import { resolveDraftBaseVersionNumber } from "@/modules/agent-versions/model";
import { useAgentVersions } from "@/modules/agent-versions/queries";
import { assetNavigation } from "@/shared/layout/navigation";
import { SourceBadge } from "@/shared/ui/source-badge";
import { AssetActions } from "./asset-actions";

export const BUILD_HEADER_ACTIONS_ID = "agent-build-header-actions";

function shortHash(value?: string | null) {
  return value ? value.slice(0, 12) : "发布后生成";
}

export function AssetWorkspaceHeader({
  overview,
}: {
  overview: AgentAssetOverview;
}) {
  const pathname = usePathname();
  const { agent } = overview;
  const base = `/assets/${agent.id}`;
  const buildRoute = pathname === `${base}/build`;
  const versionsRoute = pathname === `${base}/versions`;
  const distributionRoute = pathname === `${base}/distribution`;
  const versionsQuery = useAgentVersions(buildRoute ? agent.id : 0);
  const draftBaseVersionNo = resolveDraftBaseVersionNumber(
    agent,
    versionsQuery.data?.versions || [],
  );
  const draftBaseLabel = draftBaseVersionNo
    ? `基于 v${draftBaseVersionNo}`
    : agent.draft_base_version_id
      ? "基于历史版本"
      : "初始草稿";
  const navigation = (
    <nav
      className="flex gap-5 overflow-x-auto"
      aria-label="Agent Asset 工作区导航"
    >
      {assetNavigation.map((item) => {
        const href = `${base}/${item.segment}`;
        const active = pathname === href;
        return (
          <Link
            key={item.segment}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`relative whitespace-nowrap px-1 pb-2 text-sm font-medium transition ${active ? "text-primary" : "text-text-muted hover:text-text-strong"}`}
          >
            {item.label}
            {active && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <header className="-mx-4 -mt-6 border-b border-border bg-surface px-4 pt-2 sm:-mx-6 sm:px-6 lg:-mx-7 lg:px-7">
      <div className="flex min-h-[64px] flex-wrap items-center gap-2 pb-1">
        <AgentAvatar agent={agent} size={52} className="rounded-lg" />
        <div className="min-w-[200px] flex-1">
          <p className="sr-only">
            <Link href="/assets" className="hover:text-primary">
              Agent 资产库
            </Link>
            <span className="px-2">/</span>
            {agent.name}
          </p>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-text-muted">
            <h1 className="mr-0.5 truncate text-lg font-bold tracking-tight text-text-strong">
              {agent.name}
            </h1>
            <span className="inline-flex items-center gap-1.5 font-medium text-text-strong">
              <span
                className={`h-2 w-2 rounded-full ${agent.status === "active" ? "bg-success" : "bg-warning"}`}
              />
              {agent.current_version_id ? "运行中 v" + agent.version : "未发布"}
            </span>
            {buildRoute ? (
              <>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-text-strong"
                  title="复制当前草稿 Hash"
                  onClick={() =>
                    agent.draft_content_hash &&
                    void navigator.clipboard.writeText(agent.draft_content_hash)
                  }
                >
                  {shortHash(agent.draft_content_hash)}
                  <Copy size={14} />
                </button>
                <span className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-1 font-medium text-amber-700">
                  当前草稿 · {draftBaseLabel}
                </span>
              </>
            ) : (
              <>
                <span>
                  {agent.current_version_id
                    ? "平台当前版本 v" + agent.version
                    : "当前草稿"}
                </span>
                <span className="inline-flex items-center gap-2">
                  <span>准备度</span>
                  <strong className="text-success">
                    {overview.completeness}%
                  </strong>
                  <span className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-slate-200 sm:block">
                    <span
                      className="block h-full rounded-full bg-success"
                      style={{ width: `${overview.completeness}%` }}
                    />
                  </span>
                </span>
                <SourceBadge source={overview.completenessSource} />
              </>
            )}
          </div>
        </div>
        {buildRoute && (
          <div
            id={BUILD_HEADER_ACTIONS_ID}
            className="flex min-h-9 items-center gap-1.5"
          />
        )}
        <div className={buildRoute ? "hidden" : "flex items-center gap-2"}>
          {versionsRoute ? (
            <>
              <Link
                href={base + "/distribution"}
                className="button-secondary min-h-9 px-3"
              >
                <DownloadSimple size={16} />
                导出当前版本
              </Link>
              <Link
                href={base + "/build"}
                className="button-primary min-h-9 px-3"
              >
                <PencilSimple size={16} />
                编辑当前版本
              </Link>
            </>
          ) : distributionRoute ? (
            <>
              <Link
                href={base + "/test"}
                className="button-secondary min-h-9 px-3"
              >
                <Play size={16} />
                测试当前版本
              </Link>
              <Link
                href={base + "/build"}
                className="button-primary min-h-9 px-3"
              >
                <PencilSimple size={16} />
                编辑当前版本
              </Link>
            </>
          ) : (
            <>
              <Link
                href={base + "/build"}
                className="button-secondary min-h-9 px-3"
              >
                <Wrench size={16} />
                继续构建
              </Link>
              <AssetActions agent={agent} />
            </>
          )}
        </div>
      </div>
      {navigation}
    </header>
  );
}
