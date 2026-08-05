import type { Icon } from "@phosphor-icons/react";
import {
  ChartLineUp,
  CirclesThreePlus,
  Coins,
  FolderOpen,
  Gear,
  House,
  PaperPlaneTilt,
  ShieldCheck,
  Stack,
  Toolbox,
  UsersThree,
} from "@phosphor-icons/react";

export interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: Icon;
  capability?: "live" | "future";
}

export interface NavigationGroup {
  id: "primary" | "operations" | "management";
  label?: string;
  items: NavigationItem[];
}

export const workspaceNavigationGroups: NavigationGroup[] = [
  {
    id: "primary",
    items: [
      { id: "workbench", label: "工作台", href: "/workbench", icon: House, capability: "future" },
      { id: "agents", label: "Agent", href: "/assets", icon: Stack, capability: "live" },
      { id: "resources", label: "资源", href: "/resources", icon: Toolbox, capability: "future" },
    ],
  },
  {
    id: "operations",
    label: "运营",
    items: [
      { id: "operations", label: "应用与渠道", href: "/operations", icon: CirclesThreePlus, capability: "live" },
      { id: "clients", label: "接入管理", href: "/clients", icon: FolderOpen, capability: "live" },
      { id: "distribution", label: "发布中心", href: "/distribution", icon: PaperPlaneTilt, capability: "live" },
      { id: "analytics", label: "数据分析", href: "/analytics", icon: ChartLineUp, capability: "future" },
      { id: "revenue", label: "收益中心", href: "/revenue", icon: Coins, capability: "future" },
    ],
  },
  {
    id: "management",
    label: "管理",
    items: [
      { id: "governance-roles", label: "角色权限", href: "/governance/roles", icon: UsersThree, capability: "future" },
      { id: "governance-safety", label: "内容安全", href: "/governance/safety", icon: ShieldCheck, capability: "future" },
    ],
  },
];

export const workspaceNavigation = workspaceNavigationGroups.flatMap(
  (group) => group.items,
);

export function isNavigationItemActive(
  pathname: string,
  item: Pick<NavigationItem, "id" | "href">,
): boolean {
  if (item.id === "agents") {
    if (/^\/assets\/[^/]+\/distribution(?:\/|$)/.test(pathname)) return false;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }
  if (item.id === "distribution") {
    return pathname === item.href
      || pathname.startsWith(`${item.href}/`)
      || /^\/assets\/[^/]+\/distribution(?:\/|$)/.test(pathname);
  }
  if (item.id === "governance-roles") {
    return pathname === "/governance" || pathname === item.href;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function activeWorkspaceNavigationItem(
  pathname: string,
): NavigationItem | undefined {
  return workspaceNavigation.find((item) => isNavigationItemActive(pathname, item));
}

export const settingsNavigation: NavigationItem = {
  id: "settings",
  label: "设置",
  href: "/settings",
  icon: Gear,
  capability: "future",
};

export const assetNavigation = [
  { label: "概览", segment: "overview" },
  { label: "构建", segment: "build" },
  { label: "测试评估", segment: "test" },
  { label: "记忆服务", segment: "memory" },
  { label: "版本", segment: "versions" },
  { label: "发行", segment: "distribution" },
] as const;
