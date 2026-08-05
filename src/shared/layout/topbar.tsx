"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { List, UserPlus } from "@phosphor-icons/react";
import { useAuth } from "@/modules/auth/auth-provider";
import { WorkspaceInviteDialog } from "@/modules/workspace/workspace-invite-dialog";
import { useWorkspace } from "@/modules/workspace/workspace-provider";

export function Topbar({
  compact,
  onOpenNavigation,
}: {
  compact: boolean;
  onOpenNavigation: () => void;
}) {
  const { demo } = useAuth();
  const { workspaceCode, workspaceName, switching } = useWorkspace();
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-30 flex h-[56px] items-center border-b border-border bg-canvas/95 px-4 backdrop-blur ${
          compact ? "lg:left-0 lg:px-4" : "lg:left-[200px] lg:px-6"
        }`}
      >
        {compact && (
          <Link href="/workbench" className="mr-5 hidden w-[176px] shrink-0 items-center gap-2 border-r border-border pr-5 lg:flex" aria-label="AgentHub 工作台">
            <Image src="/images/agenthub-logo.png" alt="" width={30} height={30} priority className="brightness-0 invert" />
            <span className="text-lg font-bold tracking-tight text-text-strong">
              Agent<span className="text-primary">Hub</span>
            </span>
          </Link>
        )}
        <button type="button" onClick={onOpenNavigation} className="mr-3 rounded-lg border border-border p-2 text-text-secondary hover:bg-surface-elevated lg:hidden" aria-label="打开导航">
          <List size={21} />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-text-strong">{workspaceName}</p>
          {switching && <p className="text-xs text-text-muted">正在切换工作空间…</p>}
        </div>
        {demo && <span className="ml-3 rounded-md border border-warning/20 bg-warning/10 px-2 py-1 text-xs font-semibold text-warning">演示数据</span>}
        <button type="button" onClick={() => setInviteOpen(true)} className="icon-button ml-auto" aria-label="邀请工作空间成员" title="邀请成员">
          <UserPlus size={20} />
        </button>
      </header>
      <WorkspaceInviteDialog open={inviteOpen} workspaceCode={workspaceCode} workspaceName={workspaceName} onClose={() => setInviteOpen(false)} />
    </>
  );
}
