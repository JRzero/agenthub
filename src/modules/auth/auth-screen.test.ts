import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(join(process.cwd(), "src/modules/auth/auth-screen.tsx"), "utf8");
const stylesheet = readFileSync(join(process.cwd(), "src/modules/auth/auth-screen.module.css"), "utf8");

describe("AgentHub mobile authentication screen", () => {
  it("defaults /login to accessible SMS sign-in before password sign-in", () => {
    expect(source).toContain('useState<LoginMethod>("sms")');
    expect(source).toContain('role="tablist" aria-label="登录方式"');
    expect(source.indexOf("验证码登录")).toBeLessThan(source.indexOf("密码登录"));
    expect(source).toContain('autoComplete="one-time-code" inputMode="numeric"');
    expect(source).toContain('autoComplete="current-password"');
  });

  it("keeps registration password-free and forwards invitation attribution", () => {
    expect(source).toContain('await signUp({ phone, smsCode, invitationCode, invitationSource, landingPath })');
    expect(source).toContain('searchParams.get("invitation_code")?.trim()');
    expect(source).toContain('searchParams.get("invitation_source")');
    expect(source).not.toContain("new-password");
    expect(source).toContain("使用手机号、验证码和邀请码加入工作空间。");
    expect(source).not.toContain("验证手机号后进入工作空间，继续管理 Agent 资产、测试评估和多端发行。");
  });

  it("clears transient SMS state while retaining account and phone inputs", () => {
    expect(source).toContain("function clearTransientState()");
    expect(source).toContain('setSmsCode("");');
    expect(source).toContain('setPassword("");');
    expect(source).toContain('setSmsCooldown(0);');
    expect(source).toContain("setLoginMethod(nextMethod);");
  });

  it("preserves API Service controls, safe replace navigation, and responsive visual assets", () => {
    expect(source).toContain("setApiBaseUrlOverride(apiServiceUrl)");
    expect(source).toContain("router.replace(next)");
    expect(source).toContain('src="/images/login-agent-portrait.png"');
    expect(stylesheet).toContain("grid-template-columns: 22.5% 33% minmax(0, 1fr)");
    expect(stylesheet).toContain("@media (max-width: 1099px)");
    expect(stylesheet).toContain("@media (prefers-reduced-motion: reduce)");
    expect(stylesheet).toContain(".smsRow");
    expect(stylesheet).toContain("margin-top: 14px");
    expect(stylesheet).toContain("min-height: 40px");
  });
});
