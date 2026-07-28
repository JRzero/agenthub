export function isAgentAssetWorkspacePath(pathname: string): boolean {
  return pathname !== "/assets/create" && /^\/assets\/[^/]+(?:\/|$)/.test(pathname);
}

export function shouldCollapseWorkspaceSidebar(pathname: string): boolean {
  return pathname === "/assets/create"
    || isAgentAssetWorkspacePath(pathname)
    || pathname === "/operations"
    || pathname.startsWith("/operations/");
}

export type WorkspaceShellLayout = {
  agentAssetMode: boolean;
  sidebarCollapsed: boolean;
  mainDesktopPaddingClass: "lg:pl-[88px]" | "lg:pl-[196px]";
  mainTopPaddingClass: "pt-[50px]";
};

export function resolveWorkspaceShellLayout(
  pathname: string,
): WorkspaceShellLayout {
  const agentAssetMode = isAgentAssetWorkspacePath(pathname);
  const sidebarCollapsed = shouldCollapseWorkspaceSidebar(pathname);

  return {
    agentAssetMode,
    sidebarCollapsed,
    mainDesktopPaddingClass: sidebarCollapsed ? "lg:pl-[88px]" : "lg:pl-[196px]",
    mainTopPaddingClass: "pt-[50px]",
  };
}
