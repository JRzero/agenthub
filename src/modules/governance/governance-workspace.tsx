"use client";

import { useState } from "react";
import { ClipboardText, Database, LockKey, ShieldCheck, UserCircle, UsersThree, WarningCircle } from "@phosphor-icons/react";
import { FutureModulePage } from "@/shared/ui/future-module-page";

type GovernanceArea = "roles" | "safety";

const governanceAreas = {
  roles: {
    title: "角色权限",
    description: "管理工作区成员、角色与访问范围",
    capabilityTitle: "成员与权限能力尚未接入",
    capabilityDescription: "成员邀请、角色分配与细粒度权限需要工作区成员管理接口。V1 不展示演示成员，也不模拟授权结果。",
    icon: UsersThree,
    features: [
      { icon: UserCircle, title: "工作区成员", description: "邀请、移除与查看成员状态" },
      { icon: ShieldCheck, title: "角色与范围", description: "定义角色和只读访问范围" },
      { icon: ClipboardText, title: "权限记录", description: "查看授权变化与操作审计" },
    ],
    notice: "此页面不会使用演示成员或角色冒充真实权限；能力开放以工作区成员与权限接口为准。",
  },
  safety: {
    title: "内容安全",
    description: "管理内容策略、隐私边界与安全审计",
    capabilityTitle: "内容治理能力尚未接入",
    capabilityDescription: "IP 授权、内容安全、记忆隐私、导出控制和审计日志需要独立治理契约。V1 不会把演示风险或策略写成生产事实。",
    icon: ShieldCheck,
    features: [
      { icon: WarningCircle, title: "待处理风险", description: "聚合需要人工复核的安全事件" },
      { icon: ShieldCheck, title: "内容安全策略", description: "管理拒答、敏感内容与发布边界" },
      { icon: LockKey, title: "隐私与导出", description: "控制记忆、知识与资产导出范围" },
      { icon: Database, title: "审计记录", description: "查看不可篡改的策略与处置记录" },
    ],
    notice: "此页面不会使用演示风险冒充真实治理事件；能力开放以安全策略与审计接口为准。",
  },
} as const;

export function GovernanceWorkspace() {
  const [area, setArea] = useState<GovernanceArea>("roles");
  const content = governanceAreas[area];
  const tabs = (
    <div className="inline-flex rounded-lg border border-border bg-surface p-1" role="tablist" aria-label="治理能力">
      {(["roles", "safety"] as const).map((key) => (
        <button
          key={key}
          type="button"
          role="tab"
          aria-selected={area === key}
          onClick={() => setArea(key)}
          className={`min-h-10 rounded-md px-4 text-sm font-medium transition-colors ${area === key ? "bg-surface-elevated text-primary" : "text-text-secondary hover:text-text-strong"}`}
        >
          {governanceAreas[key].title}
        </button>
      ))}
    </div>
  );

  return (
    <FutureModulePage
      key={area}
      eyebrow="管理"
      title={content.title}
      description={content.description}
      capabilityTitle={content.capabilityTitle}
      capabilityDescription={content.capabilityDescription}
      icon={content.icon}
      features={[...content.features]}
      notice={content.notice}
      headerExtra={tabs}
    />
  );
}
