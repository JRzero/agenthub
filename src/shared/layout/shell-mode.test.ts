import { describe, expect, it } from "vitest";
import {
  isAgentAssetWorkspacePath,
  resolveWorkspaceShellLayout,
  shouldCollapseWorkspaceSidebar,
} from "./shell-mode";

describe("isAgentAssetWorkspacePath", () => {
  it.each([
    "/assets/32/overview",
    "/assets/32/build",
    "/assets/agent-81abf0/test",
    "/assets/agent-81abf0/versions",
    "/assets/agent-81abf0/distribution",
  ])("uses the Agent asset shell for %s", (pathname) => {
    expect(isAgentAssetWorkspacePath(pathname)).toBe(true);
  });

  it.each(["/assets", "/assets/create", "/resources", "/operations"])(
    "does not treat %s as an Agent asset workspace",
    (pathname) => expect(isAgentAssetWorkspacePath(pathname)).toBe(false),
  );
});

describe("shouldCollapseWorkspaceSidebar", () => {
  it.each([
    "/assets/32/overview",
    "/assets/32/build",
    "/operations",
    "/operations/sessions",
  ])("collapses the workspace sidebar for %s", (pathname) => {
    expect(shouldCollapseWorkspaceSidebar(pathname)).toBe(true);
  });

  it.each(["/assets", "/resources", "/workbench"])(
    "keeps the workspace sidebar expanded for %s",
    (pathname) => expect(shouldCollapseWorkspaceSidebar(pathname)).toBe(false),
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

  it("collapses operations without enabling Agent asset mode", () => {
    expect(resolveWorkspaceShellLayout("/operations")).toEqual({
      agentAssetMode: false,
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

  it("keeps the creation wizard in the workspace shell", () => {
    expect(resolveWorkspaceShellLayout("/assets/create")).toEqual({
      agentAssetMode: false,
      sidebarCollapsed: false,
      mainDesktopPaddingClass: "lg:pl-[224px]",
      mainTopPaddingClass: "pt-[60px]",
    });
  });
});
