"use client";

import { useState } from "react";
import { useAuth } from "@/modules/auth/auth-provider";
import { FutureModulePage } from "@/shared/ui/future-module-page";
import { AppearancePanel } from "./appearance-panel";
import { ProfileSettingsPanel } from "./profile-settings-panel";
import { WorkspaceInformationPanel } from "./workspace-information-panel";

type SettingsTab = "workspace" | "profile" | "appearance" | "members" | "clients" | "api" | "notifications" | "billing";
const tabs: Array<[SettingsTab, string]> = [["workspace", "工作区信息"], ["profile", "个人资料与安全"], ["appearance", "外观"], ["members", "成员与权限"], ["clients", "应用端接入"], ["api", "API 与密钥"], ["notifications", "通知"], ["billing", "账单与结算"]];
const descriptions: Record<Exclude<SettingsTab, "workspace" | "profile" | "appearance">, string> = {
  members: "成员邀请、角色与细粒度权限需要工作区成员管理接口。",
  clients: "应用端接入由后续 Client Adapter 契约承载，当前不生成虚假的接入密钥。",
  api: "API Key 轮换、使用范围与密钥审计需要独立后端接口。",
  notifications: "通知偏好需要服务端持久化和消息通道能力。",
  billing: "账单与结算必须来自可审计的结算系统。",
};

export function SettingsWorkspaceNext() {
  const { demo } = useAuth();
  const [tab, setTab] = useState<SettingsTab>("workspace");
  const content = tab === "workspace" ? <WorkspaceInformationPanel /> : tab === "profile" ? <ProfileSettingsPanel /> : tab === "appearance" ? <AppearancePanel /> : <FutureModulePage eyebrow="设置" title={tabs.find(([key]) => key === tab)?.[1] || "设置"} description={descriptions[tab]} />;
  return <main className="min-h-full p-6 lg:p-8"><header><div className="flex items-center gap-3"><h1 className="text-2xl font-semibold">设置</h1>{demo && <span className="status-badge bg-warning/10 text-warning">演示数据</span>}</div><p className="mt-2 text-sm text-text-muted">管理工作区偏好，以及 Creator 账号的真实资料、安全与外观设置。</p></header><div className="mt-6 grid gap-5 lg:grid-cols-[190px_minmax(0,1fr)]"><nav className="panel h-fit p-2" aria-label="设置分类">{tabs.map(([key, label]) => <button key={key} type="button" onClick={() => setTab(key)} className={`w-full rounded-md px-4 py-3 text-left text-sm ${tab === key ? "bg-primary-soft font-medium text-primary" : "text-text-muted hover:bg-subtle"}`}>{label}</button>)}</nav><div>{content}</div></div></main>;
}
