export function isAgentAssetWorkspacePath(pathname: string): boolean {
  return /^\/assets\/[^/]+(?:\/|$)/.test(pathname);
}

export type WorkspaceShellLayout = {
  agentAssetMode: boolean;
  sidebarCollapsed: boolean;
  mainDesktopPaddingClass: "lg:pl-[88px]" | "lg:pl-[224px]";
  mainTopPaddingClass: "pt-[60px]";
};

export function resolveWorkspaceShellLayout(
  pathname: string,
): WorkspaceShellLayout {
  const agentAssetMode = isAgentAssetWorkspacePath(pathname);

  return {
    agentAssetMode,
    sidebarCollapsed: agentAssetMode,
    mainDesktopPaddingClass: agentAssetMode ? "lg:pl-[88px]" : "lg:pl-[224px]",
    mainTopPaddingClass: "pt-[60px]",
  };
}
