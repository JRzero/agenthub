import { describe, expect, it } from "vitest";
import {
  isAgentAssetWorkspacePath,
  resolveWorkspaceShellLayout,
} from "./shell-mode";

describe("isAgentAssetWorkspacePath", () => {
  it.each([
    "/assets/32/overview",
    "/assets/32/build",
    "/assets/agent-81abf0/test",
    "/assets/agent-81abf0/versions",
    "/assets/agent-81abf0/distribution",
  ])("uses the compact shell for %s", (pathname) => {
    expect(isAgentAssetWorkspacePath(pathname)).toBe(true);
  });

  it.each(["/assets", "/resources", "/operations"])(
    "keeps the workspace shell for %s",
    (pathname) => expect(isAgentAssetWorkspacePath(pathname)).toBe(false),
  );
});

describe("resolveWorkspaceShellLayout", () => {
  it.each([
    "/assets/32/overview",
    "/assets/32/build",
    "/assets/32/test",
    "/assets/32/versions",
    "/assets/32/distribution",
  ])("forces Agent lifecycle route %s to the compact rail", (pathname) => {
    expect(resolveWorkspaceShellLayout(pathname)).toEqual({
      agentAssetMode: true,
      sidebarCollapsed: true,
      mainDesktopPaddingClass: "lg:pl-[88px]",
      mainTopPaddingClass: "pt-[60px]",
    });
  });

  it("keeps workspace routes labeled", () => {
    expect(resolveWorkspaceShellLayout("/assets")).toEqual({
      agentAssetMode: false,
      sidebarCollapsed: false,
      mainDesktopPaddingClass: "lg:pl-[224px]",
      mainTopPaddingClass: "pt-[60px]",
    });
  });
});
