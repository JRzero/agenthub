"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/modules/auth/auth-provider";
import { WorkspaceProvider } from "@/modules/workspace/workspace-provider";
import { Topbar } from "./topbar";
import { WorkspaceSidebar } from "./workspace-sidebar";

export function WorkspaceShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { session, ready } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (ready && !session) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [pathname, ready, router, session]);

  if (!ready || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="flex items-center gap-3 text-sm text-text-muted">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
          正在进入 AgentHub…
        </div>
      </div>
    );
  }

  return (
    <WorkspaceProvider>
      <div className="min-h-screen bg-canvas">
        <WorkspaceSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <Topbar onOpenNavigation={() => setMobileOpen(true)} />
        <main className="min-h-screen pt-[60px] lg:pl-[224px]">
          <div className="mx-auto w-full max-w-[1510px] px-4 py-6 sm:px-6 lg:px-7">
            {children}
          </div>
        </main>
      </div>
    </WorkspaceProvider>
  );
}
