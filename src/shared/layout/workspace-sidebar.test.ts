import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const sidebar = readFileSync(join(process.cwd(), "src/shared/layout/workspace-sidebar.tsx"), "utf8");
const topbar = readFileSync(join(process.cwd(), "src/shared/layout/topbar.tsx"), "utf8");

describe("workspace shell source contract", () => {
  it("keeps workspace switching and creation in the sidebar", () => {
    expect(sidebar).toContain('ariaLabel="当前工作空间"');
    expect(sidebar).toContain('setWorkspaceCode(code)');
    expect(sidebar).toContain('href="/assets/create"');
    expect(sidebar).toContain('创建 Agent');
  });

  it("keeps bottom tools and account sign-out without fabricated notification state", () => {
    expect(sidebar).toContain('aria-label="底部工具"');
    expect(sidebar).toContain('label="通知"');
    expect(sidebar).toContain('label="帮助"');
    expect(sidebar).toContain('settingsNavigation');
    expect(sidebar).toContain('退出登录');
    expect(sidebar).not.toMatch(/unread|未读|notificationCount|badge/i);
  });

  it("keeps workspace invitation in the topbar", () => {
    expect(topbar).toContain('aria-label="邀请工作空间成员"');
    expect(topbar).toContain("WorkspaceInviteDialog");
  });

  it("does not expose Living World from either shell surface", () => {
    expect(`${sidebar}\n${topbar}`.toLowerCase()).not.toContain("living world");
    expect(`${sidebar}\n${topbar}`).not.toContain("世界");
  });
});
