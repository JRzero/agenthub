"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  CaretDown,
  Plus,
  Question,
  SignOut,
  X,
} from "@phosphor-icons/react";
import { useAuth } from "@/modules/auth/auth-provider";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { Select } from "@/shared/ui/select";
import {
  isNavigationItemActive,
  settingsNavigation,
  workspaceNavigationGroups,
  type NavigationItem,
} from "./navigation";

function CollapsedTooltip({ label }: { label: string }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-[70] hidden -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-lg border border-border bg-surface-elevated px-2.5 py-1.5 text-xs font-medium text-text-strong opacity-0 shadow-panel transition duration-150 lg:block lg:group-hover:translate-x-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-x-0 lg:group-focus-visible:opacity-100"
    >
      {label}
    </span>
  );
}

function NavigationLink({
  item,
  compact,
  onNavigate,
}: {
  item: NavigationItem;
  compact: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isNavigationItemActive(pathname, item);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      aria-label={compact ? item.label : undefined}
      className={`group relative flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition duration-150 ${compact ? "lg:justify-center lg:px-2" : ""} ${
        active
          ? "bg-surface-elevated text-primary"
          : "text-text-secondary hover:bg-surface-elevated hover:text-text-strong"
      }`}
    >
      {active && (
        <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-primary" />
      )}
      <Icon size={20} weight="regular" aria-hidden="true" />
      <span className={compact ? "lg:sr-only" : undefined}>{item.label}</span>
      {compact && <CollapsedTooltip label={item.label} />}
    </Link>
  );
}

function UtilityButton({
  label,
  compact,
  children,
  disabled = false,
}: {
  label: string;
  compact: boolean;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={label}
      title={disabled ? `${label}尚未接入` : label}
      className={`group relative flex min-h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium text-text-secondary transition duration-150 hover:bg-surface-elevated hover:text-text-strong disabled:cursor-not-allowed disabled:opacity-55 ${compact ? "lg:justify-center lg:px-2" : ""}`}
    >
      {children}
      <span className={compact ? "lg:sr-only" : undefined}>{label}</span>
      {compact && <CollapsedTooltip label={label} />}
    </button>
  );
}

export function WorkspaceSidebar({
  agentAssetMode,
  collapsed,
  mobileOpen,
  onClose,
}: {
  agentAssetMode: boolean;
  collapsed: boolean;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const { session, signOut } = useAuth();
  const {
    workspaces,
    workspaceCode,
    workspaceName,
    setWorkspaceCode,
    loading,
    switching,
    workspaceError,
    clearWorkspaceError,
  } = useWorkspace();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  function handleSignOut() {
    signOut();
    setUserMenuOpen(false);
    router.replace("/login");
  }

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          aria-label="关闭导航"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[224px] flex-col border-r border-border bg-canvas px-3 py-4 transition-[width,transform,padding] duration-200 lg:translate-x-0 ${agentAssetMode ? "lg:bottom-0 lg:top-[56px] lg:py-3" : ""} ${collapsed ? "lg:w-[80px] lg:px-2.5" : "lg:w-[200px] lg:px-3"} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className={`flex h-10 items-center gap-2 px-1 ${agentAssetMode ? "lg:hidden" : ""}`}>
          <Image src="/images/agenthub-logo.png" alt="" width={30} height={30} priority className="brightness-0 invert" />
          <span className={`text-lg font-bold tracking-tight text-text-strong ${collapsed ? "lg:sr-only" : ""}`}>
            Agent<span className="text-primary">Hub</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-lg p-2 text-text-secondary hover:bg-surface-elevated lg:hidden"
            aria-label="关闭导航"
          >
            <X size={20} />
          </button>
        </div>

        <div className={`mt-4 ${agentAssetMode ? "lg:mt-0" : ""}`}>
          <Select
            ariaLabel="当前工作空间"
            value={workspaceCode}
            onValueChange={(code) => {
              clearWorkspaceError();
              setWorkspaceCode(code);
            }}
            disabled={loading || switching || workspaces.length === 0}
            compact={collapsed}
            className="w-full"
            triggerClassName={`w-full border-border bg-surface ${collapsed ? "lg:min-w-0 lg:px-2" : ""}`}
            options={
              workspaces.length === 0
                ? [{ value: "default", label: "当前工作空间" }]
                : workspaces.map((workspace) => ({ value: workspace.code, label: workspace.name }))
            }
          />
          {workspaceError && !collapsed && (
            <button
              type="button"
              onClick={clearWorkspaceError}
              className="mt-2 w-full truncate text-left text-xs text-danger"
              title={workspaceError}
            >
              {workspaceError}
            </button>
          )}
        </div>

        <Link
          href="/assets/create"
          onClick={onClose}
          aria-label="创建 Agent"
          className={`group relative mt-3 flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-canvas transition duration-150 hover:brightness-105 ${collapsed ? "lg:px-2" : ""}`}
        >
          <Plus size={19} weight="bold" />
          <span className={collapsed ? "lg:sr-only" : undefined}>创建 Agent</span>
          {collapsed && <CollapsedTooltip label="创建 Agent" />}
        </Link>

        <nav className="mt-4 flex min-h-0 flex-1 flex-col" aria-label="工作空间导航">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto scrollbar-hidden">
            {workspaceNavigationGroups.map((group) => (
              <section key={group.id} aria-label={group.label ?? "主要导航"}>
                {group.label && (
                  <div className={`mb-1.5 flex items-center gap-2 px-3 ${collapsed ? "lg:px-1" : ""}`}>
                    <span className={`text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted ${collapsed ? "lg:sr-only" : ""}`}>
                      {group.label}
                    </span>
                    <span className={`h-px flex-1 bg-border ${collapsed ? "lg:block" : ""}`} aria-hidden="true" />
                  </div>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavigationLink key={item.id} item={item} compact={collapsed} onNavigate={onClose} />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-3 space-y-1 border-t border-border pt-3" aria-label="底部工具">
            <UtilityButton label="通知" compact={collapsed} disabled>
              <Bell size={20} aria-hidden="true" />
            </UtilityButton>
            <UtilityButton label="帮助" compact={collapsed}>
              <Question size={20} aria-hidden="true" />
            </UtilityButton>
            <NavigationLink item={settingsNavigation} compact={collapsed} onNavigate={onClose} />
            <div
              className="relative"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setUserMenuOpen(false);
              }}
            >
              <button
                type="button"
                onClick={() => setUserMenuOpen((value) => !value)}
                className={`group relative flex min-h-11 w-full items-center gap-3 rounded-lg px-2 text-left hover:bg-surface-elevated ${collapsed ? "lg:justify-center" : ""}`}
                aria-haspopup="menu"
                aria-expanded={userMenuOpen}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                  {session?.username?.slice(0, 1) || "A"}
                </span>
                <span className={`min-w-0 flex-1 ${collapsed ? "lg:sr-only" : ""}`}>
                  <span className="block truncate text-sm font-medium text-text-strong">{session?.username || "Creator"}</span>
                  <span className="block truncate text-xs text-text-muted">{workspaceName}</span>
                </span>
                <CaretDown size={14} className={`text-text-muted ${collapsed ? "lg:hidden" : ""}`} />
                {collapsed && <CollapsedTooltip label={session?.username || "Creator"} />}
              </button>
              {userMenuOpen && (
                <div role="menu" className="absolute bottom-[calc(100%+8px)] left-0 z-[75] w-44 rounded-xl border border-border bg-surface-elevated p-1.5 shadow-panel">
                  <button type="button" role="menuitem" onClick={handleSignOut} className="flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-left text-sm text-text-strong hover:bg-subtle">
                    <SignOut size={17} />
                    退出登录
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
