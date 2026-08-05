"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
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
import { AssetActions } from "./asset-actions";
import { resolveAgentLifecycle } from "@/modules/agents/lifecycle";

export const BUILD_HEADER_ACTIONS_ID = "agent-build-header-actions";

export function AssetWorkspaceHeader({
  overview,
}: {
  overview: AgentAssetOverview;
}) {
  const pathname = usePathname();
  const { agent } = overview;
  const lifecycle = resolveAgentLifecycle(agent);
  const base = `/assets/${agent.id}`;
  const buildRoute = pathname === `${base}/build`;
  const versionsRoute = pathname === `${base}/versions`;
  const distributionRoute = pathname === `${base}/distribution`;
  const versionsQuery = useAgentVersions(
    buildRoute || versionsRoute ? agent.id : 0,
  );
  const currentVersion = versionsQuery.data?.versions.find(
    (version) => version.id === agent.current_version_id,
  );
  const hasUnpublishedDraft = Boolean(
    versionsQuery.data &&
      agent.current_version_id &&
      (!currentVersion ||
        agent.draft_base_version_id !== agent.current_version_id ||
        (agent.draft_content_hash &&
          currentVersion.version_hash &&
          agent.draft_content_hash !== currentVersion.version_hash)),
  );
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
      className="flex gap-1 overflow-x-auto"
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
            className={`relative min-h-10 whitespace-nowrap rounded-t-lg px-3 py-2 text-sm font-medium transition ${active ? "bg-surface-elevated text-primary" : "text-text-muted hover:bg-surface-elevated hover:text-text-strong"}`}
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
    <header className="-mx-4 -mt-6 border-b border-border bg-canvas px-4 pt-2 sm:-mx-6 sm:px-6 lg:-mx-7 lg:px-7">
      <div className="flex min-h-[64px] flex-wrap items-center gap-2 pb-1">
        <AgentAvatar agent={agent} size={52} className="rounded-lg" />
        <div className="min-w-[200px] flex-1">
          <p className="mb-1 flex items-center gap-2 text-xs text-text-muted">
            <Link href="/assets" className="hover:text-primary">
              Agent
            </Link>
            <span>/</span>
            <span className="max-w-56 truncate">{agent.name}</span>
          </p>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-text-muted">
            <h1 className="mr-0.5 truncate text-lg font-bold tracking-tight text-text-strong">
              {agent.name}
            </h1>
            <span className="inline-flex items-center gap-1.5 font-medium text-text-strong">
              <span
                className={`h-2 w-2 rounded-full ${lifecycle.state === "published" ? "bg-success" : lifecycle.state === "unpublished" ? "bg-warning" : "bg-text-muted"}`}
              />
              {lifecycle.state === "published"
                ? "运行中 v" + agent.version
                : lifecycle.state === "unpublished"
                  ? "已下架 v" + agent.version
                  : lifecycle.label}
            </span>
            {buildRoute ? (
              <>
                <span className="status-badge status-warning">
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
                className="button-secondary control-compact"
              >
                <DownloadSimple size={16} />
                导出当前版本
              </Link>
              <Link
                href={base + "/build"}
                className="button-primary control-compact"
              >
                <PencilSimple size={16} />
                {hasUnpublishedDraft ? "继续编辑草稿" : "编辑当前版本"}
              </Link>
            </>
          ) : distributionRoute ? (
            <>
              <Link
                href={base + "/test"}
                className="button-secondary control-compact"
              >
                <Play size={16} />
                测试当前版本
              </Link>
              <Link
                href={base + "/build"}
                className="button-primary control-compact"
              >
                <PencilSimple size={16} />
                编辑当前版本
              </Link>
            </>
          ) : (
            <>
              <Link
                href={base + "/build"}
                className="button-secondary control-compact"
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
