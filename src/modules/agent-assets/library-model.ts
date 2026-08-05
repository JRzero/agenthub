import type { Agent } from "@/modules/agents/types";
import { resolveAgentLifecycle } from "@/modules/agents/lifecycle";

export const ASSET_VIEW_STORAGE_KEY = "linkyun_agent_asset_view";

export type AssetView = "card" | "list";
export type AssetSort = "updated-desc" | "updated-asc" | "name-asc";
export type AssetStatus = "all" | "active" | "private" | "draft" | "creating" | "archived";

export function readAssetView(storage: Pick<Storage, "getItem">): AssetView {
  return storage.getItem(ASSET_VIEW_STORAGE_KEY) === "list" ? "list" : "card";
}

export function writeAssetView(storage: Pick<Storage, "setItem">, view: AssetView): void {
  storage.setItem(ASSET_VIEW_STORAGE_KEY, view);
}

export function assetHref(agent: Agent): string {
  return agent.creation_completed === false ? `/assets/create?agentId=${agent.id}` : `/assets/${agent.id}/overview`;
}

export function filterAndSortAgents(
  agents: Agent[],
  options: { search: string; status: AssetStatus; sort: AssetSort },
): Agent[] {
  const keyword = options.search.trim().toLowerCase();
  return agents
    .filter((agent) => {
      const lifecycle = resolveAgentLifecycle(agent);
      const matchesSearch = !keyword || `${agent.name} ${agent.code} ${agent.description || ""}`.toLowerCase().includes(keyword);
      const matchesStatus = options.status === "all"
        || (options.status === "creating" && lifecycle.state === "creating")
        || (options.status === "active" && lifecycle.state === "published")
        || (options.status === "private" && lifecycle.state === "unpublished")
        || (options.status === "draft" && lifecycle.state === "draft")
        || (options.status === "archived" && lifecycle.state === "archived");
      return matchesSearch && matchesStatus;
    })
    .sort((left, right) => {
      if (options.sort === "name-asc") return left.name.localeCompare(right.name, "zh-CN");
      const leftTime = Date.parse(left.updated_at || "") || 0;
      const rightTime = Date.parse(right.updated_at || "") || 0;
      return options.sort === "updated-asc" ? leftTime - rightTime : rightTime - leftTime;
    });
}
