"use client";

import { useState } from "react";
import type { Icon } from "@phosphor-icons/react";
import { Buildings, Palette, UserCircle } from "@phosphor-icons/react";
import { AppearancePanel } from "./appearance-panel";
import { ProfileSettingsPanel } from "./profile-settings-panel";
import { WorkspaceInformationPanel } from "./workspace-information-panel";

type SettingsTab = "workspace" | "profile" | "appearance";

const tabs: Array<{ id: SettingsTab; label: string; description: string; icon: Icon }> = [
  { id: "workspace", label: "工作区信息", description: "基础信息与本地偏好", icon: Buildings },
  { id: "profile", label: "个人资料与安全", description: "资料、头像与密码", icon: UserCircle },
  { id: "appearance", label: "外观", description: "当前浏览器主题", icon: Palette },
];

export function SettingsWorkspaceNext() {
  const [tab, setTab] = useState<SettingsTab>("workspace");
  const content = tab === "workspace"
    ? <WorkspaceInformationPanel />
    : tab === "profile"
      ? <ProfileSettingsPanel />
      : <AppearancePanel />;

  return (
    <main className="min-h-full px-4 py-6 sm:px-6 lg:px-8">
      <header className="border-b border-border pb-6">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">设置</h1>
        <p className="mt-2 text-sm leading-6 text-text-secondary">管理工作区偏好，以及 Creator 账号的真实资料、安全与外观设置。</p>
      </header>
      <div className="mt-7 grid gap-7 lg:grid-cols-[220px_minmax(0,1fr)] xl:grid-cols-[220px_minmax(0,1fr)]">
        <nav className="h-fit border-b border-border pb-4 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5" aria-label="设置分类">
          <div className="grid gap-1 md:grid-cols-3 lg:grid-cols-1">
            {tabs.map((item) => {
              const ItemIcon = item.icon;
              const selected = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  aria-current={selected ? "page" : undefined}
                  className={`flex min-h-14 items-center gap-3 rounded-lg border-l-2 px-3 py-2 text-left transition-colors ${selected ? "border-primary bg-surface-elevated text-text-strong" : "border-transparent text-text-secondary hover:bg-surface hover:text-text-strong"}`}
                >
                  <ItemIcon size={20} className={selected ? "text-primary" : "text-text-muted"} aria-hidden="true" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{item.label}</span>
                    <span className="mt-0.5 hidden text-xs text-text-muted xl:block">{item.description}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-5 border-t border-border pt-5 text-xs leading-5 text-text-muted">
            成员与权限、API 与密钥、通知、账单与结算尚无可用设置，因此 V1 不展示可提交表单。
          </p>
        </nav>
        <div className="min-w-0">{content}</div>
      </div>
    </main>
  );
}
