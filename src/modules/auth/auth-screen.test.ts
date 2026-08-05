import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(process.cwd(), "src/modules/auth/auth-screen.tsx"), "utf8");
const stylesheet = readFileSync(join(process.cwd(), "src/modules/auth/auth-screen.module.css"), "utf8");

describe("AgentHub authentication screen", () => {
  it("keeps the existing authentication and registration behaviors", () => {
    expect(source).toContain("await signIn(username.trim(), password)");
    expect(source).toContain("await signUp({ username, email, password, invitationCode })");
    expect(source).toContain("setApiBaseUrlOverride(apiServiceUrl)");
    expect(source).toContain('href={alternateHref}');
    expect(source).toContain('role="alert"');
  });

  it("keeps all credential controls labeled and keyboard operable", () => {
    expect(source).toContain('htmlFor={usernameId}');
    expect(source).toContain('htmlFor={passwordId}');
    expect(source).toContain('aria-label={showPassword ? "隐藏密码" : "显示密码"}');
    expect(source).toContain('aria-expanded={apiSettingsOpen}');
    expect(source).toContain('aria-controls={apiSettingsId}');
    expect(source).toContain('aria-busy={loading}');
  });

  it("uses a standalone portrait asset instead of the selected design screenshot", () => {
    expect(source).toContain('src="/images/login-agent-portrait.png"');
    expect(source).not.toContain("15-login-selected.png");
    expect(stylesheet).toContain("grid-template-columns: 22.5% 33% minmax(0, 1fr)");
    expect(stylesheet).toContain("@media (max-width: 1099px)");
    expect(stylesheet).toContain("@media (prefers-reduced-motion: reduce)");
  });
});
