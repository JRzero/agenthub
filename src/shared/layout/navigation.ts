import type { Icon } from "@phosphor-icons/react";
import {
  ChartLineUp,
  CirclesThreePlus,
  Coins,
  FolderOpen,
  Gear,
  House,
  ShieldCheck,
  Stack,
  Toolbox,
} from "@phosphor-icons/react";

export interface NavigationItem {
  label: string;
  href: string;
  icon: Icon;
  capability?: "live" | "future";
}

export const workspaceNavigation: NavigationItem[] = [
  { label: "工作台", href: "/workbench", icon: House, capability: "future" },
  { label: "Agent 资产库", href: "/assets", icon: Stack, capability: "live" },
  { label: "资源库", href: "/resources", icon: Toolbox, capability: "future" },
  { label: "接入管理", href: "/clients", icon: FolderOpen, capability: "live" },
  { label: "应用运营", href: "/operations", icon: CirclesThreePlus, capability: "live" },
  { label: "数据分析", href: "/analytics", icon: ChartLineUp, capability: "future" },
  { label: "治理中心", href: "/governance", icon: ShieldCheck, capability: "future" },
  { label: "收益中心", href: "/revenue", icon: Coins, capability: "future" },
];

export const settingsNavigation: NavigationItem = {
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
