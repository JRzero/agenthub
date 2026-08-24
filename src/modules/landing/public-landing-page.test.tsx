/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text, @typescript-eslint/no-unused-vars */
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ fill: _fill, priority: _priority, sizes: _sizes, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean }) => <img {...props} />,
}));
vi.mock("next/link", () => ({
  default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a>,
}));

import {
  CREATE_LOGIN_HREF,
  CREATE_REGISTER_HREF,
  CREATION_INTENT_SESSION_KEY,
  PublicLandingPage,
} from "./public-landing-page";

Object.assign(globalThis, { React });
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

function setTextareaValue(input: HTMLTextAreaElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

function findButton(container: HTMLElement, text: string) {
  const result = Array.from(container.querySelectorAll("button")).find((button) => button.textContent?.trim() === text);
  expect(result, `missing button: ${text}`).toBeTruthy();
  return result!;
}

describe("AgentHub public landing page", () => {
  let container: HTMLDivElement;
  let root: Root;
  let reducedMotion = true;
  let animationFrames: FrameRequestCallback[];
  let scrollIntoView: ReturnType<typeof vi.fn>;

  async function renderLanding() {
    await act(async () => root.render(<PublicLandingPage />));
  }

  function runAnimationFrame() {
    const callback = animationFrames.shift();
    callback?.(performance.now());
  }

  beforeEach(() => {
    window.sessionStorage.clear();
    reducedMotion = true;
    animationFrames = [];
    scrollIntoView = vi.fn();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({ matches: reducedMotion && query.includes("reduce"), media: query, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    });
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: scrollIntoView });
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      animationFrames.push(callback);
      return animationFrames.length;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(async () => {
    await act(async () => root.unmount());
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("renders the approved creator-first sections and truthful capability language", async () => {
    await renderLanding();
    expect(container.querySelector("h1")?.textContent).toContain("让一个想法");
    expect(container.querySelector("#product")?.textContent).toContain("对话测试");
    expect(container.querySelector("#flow")?.textContent).toContain("持续迭代");
    expect(container.querySelectorAll("#scenarios article")).toHaveLength(3);
    expect(container.querySelector("header")?.textContent).toBe("AgentHub产品能力创作流程使用场景登录工作台");
    expect(container.querySelector('[aria-label="AgentHub 工作台产品界面示意"]')).toBeNull();
    expect(container.querySelector("#top")?.textContent).toContain("开始创建");
    expect(container.querySelector("#product")?.textContent).toContain("产品界面示意 · DEMO");
    expect(container.textContent).not.toContain("先整理创作意图，生成与保存前需登录并完成邀请码验证。");
    expect(container.textContent).not.toContain("Living World");
    expect(container.textContent).not.toContain("Agent 市场");
    expect(container.textContent).not.toContain("客户案例");
  });

  it("switches continuous product states with semantic selected state", async () => {
    await renderLanding();
    const knowledge = findButton(container, "知识与技能");
    await act(async () => knowledge.click());

    expect(knowledge.getAttribute("aria-selected")).toBe("true");
    expect(container.querySelector('[role="tabpanel"]')?.textContent).toContain("把专业能力接进来");
    expect(container.querySelector('[role="tabpanel"]')?.textContent).toContain("世界观与角色设定");
  });

  it("keeps only the latest product state active during rapid tab selection", async () => {
    await renderLanding();

    await act(async () => {
      findButton(container, "角色设定").click();
      findButton(container, "发布运行").click();
      findButton(container, "知识与技能").click();
    });

    expect(findButton(container, "知识与技能").getAttribute("aria-selected")).toBe("true");
    expect(container.querySelectorAll('[aria-hidden="false"]')).toHaveLength(1);
    expect(container.querySelector('[aria-hidden="false"]')?.textContent).toContain("把专业能力接进来");
    expect(container.querySelector('[aria-hidden="false"]')?.textContent).toContain("世界观与角色设定");
  });

  it("keeps anonymous intent in session storage and exposes existing auth handoff routes", async () => {
    await renderLanding();
    const textarea = container.querySelector<HTMLTextAreaElement>("#creation-intent")!;
    await act(async () => setTextareaValue(textarea, "  我想创造一个   东方神话故事 Agent  "));
    await act(async () => container.querySelector("#create form")?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));

    expect(window.sessionStorage.getItem(CREATION_INTENT_SESSION_KEY)).toBe("我想创造一个 东方神话故事 Agent");
    expect(container.querySelector("#create")?.textContent).toContain("意图已整理");
    expect(container.querySelector(`a[href="${CREATE_LOGIN_HREF}"]`)).not.toBeNull();
    expect(container.querySelector(`a[href="${CREATE_REGISTER_HREF}"]`)).not.toBeNull();
    expect(container.querySelector("#create")?.textContent).toContain("只保留在当前浏览器会话");
  });

  it("keeps the stable third creation step active when reduced motion is requested", async () => {
    await renderLanding();
    expect(findButton(container, "03对话打磨").getAttribute("aria-current")).toBe("step");
    expect(container.querySelector('[data-step="2"]')?.textContent).toContain("在真实交流中发现问题");
  });

  it("uses an immediate no-displacement scroll path when reduced motion is requested", async () => {
    await renderLanding();
    await act(async () => findButton(container, "04发布运行").click());

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "auto", block: "center" });
    expect(findButton(container, "04发布运行").getAttribute("aria-current")).toBe("step");
  });

  it("holds a manual step selection before scroll geometry can take control again", async () => {
    reducedMotion = false;
    let currentTime = 1000;
    vi.spyOn(performance, "now").mockImplementation(() => currentTime);
    await renderLanding();

    const panels = Array.from(container.querySelectorAll<HTMLElement>("[data-step]"));
    panels.forEach((panel, index) => vi.spyOn(panel, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: index * 700,
      top: index * 700,
      right: 800,
      bottom: index * 700 + 232,
      left: 0,
      width: 800,
      height: 232,
      toJSON: () => ({}),
    }));

    await act(async () => findButton(container, "04发布运行").click());
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
      runAnimationFrame();
    });
    expect(findButton(container, "04发布运行").getAttribute("aria-current")).toBe("step");

    currentTime = 2201;
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
      runAnimationFrame();
    });
    expect(findButton(container, "01定义角色").getAttribute("aria-current")).toBe("step");
  });

  it("keeps the five-step selector operable at a 390px viewport", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
    await renderLanding();
    await act(async () => findButton(container, "05持续迭代").click());

    expect(findButton(container, "05持续迭代").getAttribute("aria-current")).toBe("step");
    expect(container.querySelector('[data-step="4"][data-active="true"]')?.textContent).toContain("回到对话测试");
  });
});
