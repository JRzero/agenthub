"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CaretDown,
  List,
  Question,
  SignOut,
  UserPlus,
} from "@phosphor-icons/react";
import { useAuth } from "@/modules/auth/auth-provider";
import { WorkspaceInviteDialog } from "@/modules/workspace/workspace-invite-dialog";
import { useWorkspace } from "@/modules/workspace/workspace-provider";
import { Select } from "@/shared/ui/select";

export function Topbar({
  compact,
  onOpenNavigation,
}: {
  compact: boolean;
  onOpenNavigation: () => void;
}) {
  const router = useRouter();
  const { session, demo, signOut } = useAuth();
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
  const [inviteOpen, setInviteOpen] = useState(false);

  function handleSignOut() {
    signOut();
    setUserMenuOpen(false);
    router.replace("/login");
  }

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-30 flex items-center border-b border-border bg-surface/95 px-4 backdrop-blur ${
          compact
            ? "h-[50px] lg:left-0 lg:px-4"
            : "h-[50px] lg:left-[224px] lg:px-7"
        }`}
      >
        {compact && (
          <Link
            href="/workbench"
            className="mr-5 hidden w-[176px] shrink-0 items-center gap-2 border-r border-border pr-5 lg:flex"
            aria-label="AgentHub 工作台"
          >
            <Image
              src="/images/agenthub-logo.png"
              alt=""
              width={30}
              height={30}
              priority
            />
            <span className="text-xl font-bold tracking-tight text-text-strong">
              AgentHub
            </span>
          </Link>
        )}
        <button
          type="button"
          onClick={onOpenNavigation}
          className="mr-3 rounded-md border border-border p-2 text-text-muted hover:bg-subtle lg:hidden"
          aria-label="打开导航"
        >
          <List size={21} />
        </button>
        <Select
          ariaLabel="当前工作空间"
          value={workspaceCode}
          onValueChange={setWorkspaceCode}
          disabled={loading || switching || workspaces.length === 0}
          triggerClassName="font-medium hover:border-primary/40"
          options={
            workspaces.length === 0
              ? [{ value: "default", label: "当前工作空间" }]
              : workspaces.map((workspace) => ({
                  value: workspace.code,
                  label: workspace.name,
                }))
          }
        />
        {switching && (
          <span className="ml-3 text-xs text-text-muted">正在切换…</span>
        )}
        {demo && (
          <span className="ml-3 rounded bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
            演示数据
          </span>
        )}
        {workspaceError && (
          <button
            type="button"
            onClick={clearWorkspaceError}
            className="ml-3 max-w-48 truncate text-xs text-danger"
            title={workspaceError}
          >
            {workspaceError}
          </button>
        )}
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setInviteOpen(true)}
            className="icon-button"
            aria-label="邀请工作空间成员"
            title="邀请成员"
          >
            <UserPlus size={20} />
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="通知"
            title="通知中心将在后续迁移"
          >
            <Bell size={20} />
          </button>
          <button
            type="button"
            className="rounded-md p-2 text-text-muted hover:bg-subtle"
            aria-label="帮助"
            title="帮助中心将在后续迁移"
          >
            <Question size={20} />
          </button>
          <div
            className="relative ml-2 border-l border-border pl-4"
            onBlur={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null,
                )
              )
                setUserMenuOpen(false);
            }}
          >
            <button
              type="button"
              onClick={() => setUserMenuOpen((value) => !value)}
              className="flex items-center gap-2 rounded-md p-1.5 hover:bg-subtle"
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
            >
              <span className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary-soft text-xs font-bold text-primary">
                {session?.username?.slice(0, 1) || "A"}
              </span>
              <span className="hidden text-sm font-medium text-text-strong sm:inline">
                {session?.username || "Creator"}
              </span>
              <CaretDown size={14} className="text-text-muted" />
            </button>
            {userMenuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-[46px] w-44 rounded-lg border border-border bg-surface p-1.5 shadow-panel"
              >
                <div className="border-b border-border px-3 py-2">
                  <p className="truncate text-sm font-medium text-text-strong">
                    {session?.username}
                  </p>
                  <p className="mt-0.5 text-xs text-text-muted">Creator 账号</p>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleSignOut}
                  className="mt-1 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-text-strong hover:bg-subtle"
                >
                  <SignOut size={17} />
                  退出登录
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <WorkspaceInviteDialog
        open={inviteOpen}
        workspaceCode={workspaceCode}
        workspaceName={workspaceName}
        onClose={() => setInviteOpen(false)}
      />
    </>
  );
}
