"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "@phosphor-icons/react";
import {
  settingsNavigation,
  workspaceNavigation,
  type NavigationItem,
} from "./navigation";

function isActive(pathname: string, href: string): boolean {
  if (href === "/assets")
    return pathname === href || pathname.startsWith("/assets/");
  return pathname === href || pathname.startsWith(href + "/");
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
  const active = isActive(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      aria-label={compact ? item.label : undefined}
      className={`group relative flex min-h-12 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${compact ? "lg:min-h-14 lg:justify-center lg:px-2" : ""} ${
        active
          ? "bg-primary-soft text-primary"
          : "text-text-muted hover:bg-subtle hover:text-text-strong"
      }`}
    >
      {active && (
        <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-primary" />
      )}
      <Icon
        size={21}
        weight={active ? "duotone" : "regular"}
        aria-hidden="true"
      />
      <span className={compact ? "lg:sr-only" : undefined}>{item.label}</span>
      {compact && (
        <span
          role="tooltip"
          className="pointer-events-none absolute left-[calc(100%+12px)] top-1/2 z-[70] hidden -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-medium text-white opacity-0 shadow-lg transition duration-150 lg:block lg:group-hover:translate-x-0 lg:group-hover:opacity-100 lg:group-focus-visible:translate-x-0 lg:group-focus-visible:opacity-100"
        >
          {item.label}
        </span>
      )}
    </Link>
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
  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden"
          aria-label="关闭导航"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[224px] flex-col border-r border-border bg-surface px-3 py-4 transition-[width,transform,padding] duration-200 lg:translate-x-0 ${agentAssetMode ? "lg:bottom-0 lg:top-[60px] lg:py-3" : ""} ${collapsed ? "lg:w-[88px] lg:px-2" : "lg:w-[196px] lg:px-2.5"} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className={`mb-5 flex h-10 items-center gap-2 px-1.5 ${agentAssetMode ? "lg:hidden" : ""}`}
        >
          <Image
            src="/images/agenthub-logo.png"
            alt="AgentHub"
            width={30}
            height={30}
            priority
          />
          <span className="text-lg font-bold tracking-tight text-text-strong">
            AgentHub
          </span>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded p-1.5 text-text-muted hover:bg-subtle lg:hidden"
            aria-label="关闭导航"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex min-h-0 flex-1 flex-col" aria-label="工作空间导航">
          <div className="space-y-1">
            {workspaceNavigation.map((item) => (
              <NavigationLink
                key={item.href}
                item={item}
                compact={collapsed}
                onNavigate={onClose}
              />
            ))}
          </div>
          <div className="mt-auto space-y-1 border-t border-border pt-3">
            <NavigationLink
              item={settingsNavigation}
              compact={collapsed}
              onNavigate={onClose}
            />
          </div>
        </nav>
      </aside>
    </>
  );
}
