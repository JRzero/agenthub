import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const readSource = (file: string) => readFileSync(join(process.cwd(), "src/modules/settings", file), "utf8");

describe("settings capability boundary", () => {
  it("shows only supported settings groups and no fake unsupported forms", () => {
    const source = readSource("settings-workspace-next.tsx");
    expect(source).toContain('type SettingsTab = "workspace" | "profile" | "appearance"');
    expect(source).not.toContain('["members"');
    expect(source).not.toContain('["api"');
    expect(source).not.toContain('["notifications"');
    expect(source).not.toContain('["billing"');
    expect(source).toContain("尚无可用设置，因此 V1 不展示可提交表单");
  });

  it("keeps workspace identity fields read-only and preferences browser-local", () => {
    const source = readSource("workspace-information-panel.tsx");
    expect(source).toMatch(/aria-label="工作区名称" readOnly/);
    expect(source).toMatch(/aria-label="工作区标识" readOnly/);
    expect(source).toContain("saveWorkspacePreferences(window.localStorage");
    expect(source).not.toContain("DEMO_AGENTS");
    expect(source).not.toContain("DEMO_ADAPTERS");
  });

  it("does not simulate profile or password writes in demo mode", () => {
    const profile = readSource("profile-settings-panel.tsx");
    const password = readSource("password-panel.tsx");
    expect(profile).toContain("演示模式不会显示虚构个人资料");
    expect(profile).not.toContain("DEMO_PROFILE");
    expect(password).not.toContain("演示模式未修改真实密码");
    expect(password).toContain("await changePassword");
  });

  it("does not expose ineffective light-theme controls over the fixed V1 tokens", () => {
    const source = readSource("appearance-panel.tsx");
    expect(source).toContain("V1 深色");
    expect(source).toContain("不提供不会产生真实视觉变化的主题切换");
    expect(source).not.toContain('id: "light"');
    expect(source).not.toContain("setMode");
  });
});
