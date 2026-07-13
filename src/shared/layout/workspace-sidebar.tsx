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
  if (href === "/assets") return pathname === href || pathname.startsWith("/assets/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavigationLink({ item, onNavigate }: { item: NavigationItem; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = isActive(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`group relative flex min-h-12 items-center gap-3 rounded-md px-3 text-sm font-medium transition ${
        active
          ? "bg-primary-soft text-primary"
          : "text-text-muted hover:bg-subtle hover:text-text-strong"
      }`}
    >
      {active && <span className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-primary" />}
      <Icon size={21} weight={active ? "duotone" : "regular"} aria-hidden="true" />
      <span>{item.label}</span>
      {item.capability === "future" && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-border group-hover:bg-primary/50" />
      )}
    </Link>
  );
}

export function WorkspaceSidebar({
  mobileOpen,
  onClose,
}: {
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
        className={`fixed inset-y-0 left-0 z-50 flex w-[224px] flex-col border-r border-border bg-surface px-3 py-4 transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-5 flex h-10 items-center gap-2 px-2">
          <Image src="/images/agenthub-logo.png" alt="AgentHub" width={32} height={32} priority />
          <span className="text-[20px] font-bold tracking-tight text-text-strong">AgentHub</span>
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
              <NavigationLink key={item.href} item={item} onNavigate={onClose} />
            ))}
          </div>
          <div className="mt-auto border-t border-border pt-3">
            <NavigationLink item={settingsNavigation} onNavigate={onClose} />
          </div>
        </nav>
      </aside>
    </>
  );
}
