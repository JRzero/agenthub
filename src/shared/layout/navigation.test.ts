import { describe, expect, it } from "vitest";
import {
  activeWorkspaceNavigationItem,
  isNavigationItemActive,
  settingsNavigation,
  workspaceNavigation,
  workspaceNavigationGroups,
} from "./navigation";

describe("AgentHub V1 workspace navigation", () => {
  it("groups primary, operations, and management destinations in order", () => {
    expect(workspaceNavigationGroups.map((group) => group.id)).toEqual([
      "primary",
      "operations",
      "management",
    ]);
    expect(workspaceNavigationGroups.map((group) => group.label)).toEqual([
      undefined,
      "运营",
      "管理",
    ]);
    expect(workspaceNavigationGroups[0].items.map((item) => item.label)).toEqual([
      "工作台",
      "Agent",
      "资源",
    ]);
  });

  it("keeps current workspace destinations intact", () => {
    expect(Object.fromEntries(workspaceNavigation.map((item) => [item.id, item.href]))).toEqual({
      workbench: "/workbench",
      agents: "/assets",
      resources: "/resources",
      operations: "/operations",
      clients: "/clients",
      distribution: "/distribution",
      analytics: "/analytics",
      revenue: "/revenue",
      "governance-roles": "/governance/roles",
      "governance-safety": "/governance/safety",
    });
    expect(settingsNavigation.href).toBe("/settings");
  });

  it.each([
    ["/workbench", "workbench"],
    ["/assets", "agents"],
    ["/assets/create", "agents"],
    ["/assets/agent-1/build", "agents"],
    ["/distribution", "distribution"],
    ["/assets/agent-1/distribution", "distribution"],
    ["/resources", "resources"],
    ["/operations/sessions", "operations"],
    ["/clients/client-1", "clients"],
    ["/analytics", "analytics"],
    ["/revenue", "revenue"],
    ["/governance", "governance-roles"],
    ["/governance/roles", "governance-roles"],
    ["/governance/safety", "governance-safety"],
  ])("resolves one active item for %s", (pathname, expectedId) => {
    expect(activeWorkspaceNavigationItem(pathname)?.id).toBe(expectedId);
    expect(workspaceNavigation.filter((item) => isNavigationItemActive(pathname, item))).toHaveLength(1);
  });

  it("exposes the three approved independent entries without fake destinations", () => {
    expect(workspaceNavigation.filter((item) => ["发布中心", "角色权限", "内容安全"].includes(item.label)).map((item) => item.label)).toEqual([
      "发布中心",
      "角色权限",
      "内容安全",
    ]);
    expect(workspaceNavigation.every((item) => item.href.startsWith("/"))).toBe(true);
  });

  it("contains no Living World entry or suggestive copy", () => {
    const copy = JSON.stringify(workspaceNavigationGroups).toLowerCase();
    expect(copy).not.toContain("living world");
    expect(copy).not.toContain("living-world");
    expect(copy).not.toContain("世界");
  });
});
