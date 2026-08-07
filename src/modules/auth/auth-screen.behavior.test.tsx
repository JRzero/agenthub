/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text, @typescript-eslint/no-unused-vars */
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { sendSmsCodeMock, signInSmsMock, signInWithPasswordMock, signUpMock } = vi.hoisted(() => ({
  sendSmsCodeMock: vi.fn(),
  signInSmsMock: vi.fn(),
  signInWithPasswordMock: vi.fn(),
  signUpMock: vi.fn(),
}));

let search = new URLSearchParams();
const replace = vi.fn();

vi.mock("next/image", () => ({
  default: ({ fill: _fill, priority: _priority, sizes: _sizes, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => <img {...props} />,
}));
vi.mock("next/link", () => ({
  default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a>,
}));
vi.mock("next/navigation", () => ({
  usePathname: () => "/register",
  useRouter: () => ({ replace }),
  useSearchParams: () => search,
}));
vi.mock("@/shared/api/http-client", () => ({ getApiBaseUrl: () => "http://localhost:8080" }));
vi.mock("@/shared/api/api-base", () => ({ setApiBaseUrlOverride: vi.fn() }));
vi.mock("./api", () => ({
  sendSmsCode: sendSmsCodeMock,
  authErrorMessage: () => "短信发送失败，请稍后重试",
}));
vi.mock("./auth-provider", () => ({
  useAuth: () => ({
    session: null,
    ready: true,
    demo: false,
    signInSms: signInSmsMock,
    signInWithPassword: signInWithPasswordMock,
    signUp: signUpMock,
  }),
}));

import { AuthScreen } from "./auth-screen";

Object.assign(globalThis, { React });
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function setValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

async function render(mode: "login" | "register") {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  await act(async () => root.render(<AuthScreen mode={mode} />));
  return { container, root };
}

function button(container: HTMLElement, text: string) {
  const found = Array.from(container.querySelectorAll("button")).find((item) => item.textContent?.trim() === text);
  expect(found, `missing ${text}`).toBeTruthy();
  return found!;
}

describe("mobile auth interaction state", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    search = new URLSearchParams();
    replace.mockReset();
    sendSmsCodeMock.mockReset();
    signInSmsMock.mockReset().mockResolvedValue(undefined);
    signInWithPasswordMock.mockReset().mockResolvedValue(undefined);
    signUpMock.mockReset().mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("starts a 60-second login cooldown only after a mock send succeeds and clears it on tab change", async () => {
    sendSmsCodeMock.mockResolvedValue(undefined);
    const { container, root } = await render("login");
    const phone = container.querySelector<HTMLInputElement>('input[autocomplete="tel"]')!;
    const code = container.querySelector<HTMLInputElement>('input[autocomplete="one-time-code"]')!;
    await act(async () => setValue(phone, "13800000000"));
    await act(async () => setValue(code, "000000"));
    await act(async () => button(container, "获取验证码").click());

    expect(sendSmsCodeMock).toHaveBeenCalledWith({ phone: "13800000000", purpose: "login" });
    expect(button(container, "60s 后重发").disabled).toBe(true);
    await act(async () => button(container, "密码登录").click());

    expect(phone.value).toBe("13800000000");
    expect(container.querySelector('input[autocomplete="one-time-code"]')).toBeNull();
    expect(container.querySelector<HTMLInputElement>('input[autocomplete="current-password"]')?.value).toBe("");
    await act(async () => button(container, "验证码登录").click());
    expect(container.querySelector<HTMLInputElement>('input[autocomplete="one-time-code"]')?.value).toBe("");
    expect(button(container, "获取验证码").disabled).toBe(false);
    await act(async () => root.unmount());
  });

  it("keeps failed mock sends retryable without a cooldown", async () => {
    sendSmsCodeMock.mockRejectedValue(new Error("offline"));
    const { container, root } = await render("login");
    await act(async () => setValue(container.querySelector<HTMLInputElement>('input[autocomplete="tel"]')!, "13800000000"));
    await act(async () => button(container, "获取验证码").click());

    expect(container.querySelector('[role="alert"]')?.textContent).toContain("短信发送失败");
    expect(button(container, "获取验证码").disabled).toBe(false);
    await act(async () => root.unmount());
  });

  it("prefills invitation query and submits only the approved registration input", async () => {
    search = new URLSearchParams("invitation_code=INVITE&invitation_source=share&next=%2Fassets%3Fview%3Dall");
    const { container, root } = await render("register");
    const phone = container.querySelector<HTMLInputElement>('input[autocomplete="tel"]')!;
    const code = container.querySelector<HTMLInputElement>('input[autocomplete="one-time-code"]')!;
    const invitation = Array.from(container.querySelectorAll<HTMLInputElement>("input")).find((input) => input.placeholder === "输入邀请码")!;
    expect(invitation.value).toBe("INVITE");
    expect(container.querySelector('input[autocomplete="current-password"]')).toBeNull();

    await act(async () => {
      setValue(phone, "13800000000");
      setValue(code, "000000");
      container.querySelector("form")?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
    expect(signUpMock).toHaveBeenCalledWith({
      phone: "13800000000",
      smsCode: "000000",
      invitationCode: "INVITE",
      invitationSource: "share",
      landingPath: "/register?invitation_code=INVITE&invitation_source=share&next=%2Fassets%3Fview%3Dall",
    });
    expect(replace).toHaveBeenCalledWith("/assets?view=all");
    await act(async () => root.unmount());
  });
});
