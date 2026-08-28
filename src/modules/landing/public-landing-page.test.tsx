/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text, @typescript-eslint/no-unused-vars */
import React, { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/image", () => ({
  default: ({ fill: _fill, priority: _priority, sizes: _sizes, unoptimized: _unoptimized, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; priority?: boolean; unoptimized?: boolean }) => <img {...props} />,
}));
vi.mock("next/link", () => ({
  default: ({ children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...props}>{children}</a>,
}));

import {
  CREATE_LOGIN_HREF,
  CREATE_REGISTER_HREF,
  CREATION_INTENT_SESSION_KEY,
  PublicLandingPage,
  flowStageFromProgress,
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

function findStageButton(container: HTMLElement, text: string) {
  const result = Array.from(container.querySelectorAll<HTMLButtonElement>("#product button")).find((button) => button.querySelector("strong")?.textContent === text);
  expect(result, `missing stage button: ${text}`).toBeTruthy();
  return result!;
}

describe("AgentHub public landing page", () => {
  let container: HTMLDivElement;
  let root: Root;
  let reducedMotion = true;
  let animationFrames: FrameRequestCallback[];
  let scrollIntoView: ReturnType<typeof vi.fn>;
  let scrollTo: ReturnType<typeof vi.fn>;

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
    scrollTo = vi.fn();
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 800 });
    Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({ matches: reducedMotion && query.includes("reduce"), media: query, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
    });
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", { configurable: true, value: scrollIntoView });
    Object.defineProperty(window, "scrollTo", { configurable: true, value: scrollTo });
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

  it("renders the approved R17 Hero and truthful AgentHub capability boundaries", async () => {
    await renderLanding();
    expect(container.querySelector("h1")?.textContent).toBe("管理每一个 AI 角色让能力持续进化");
    expect(container.querySelector("#product")?.textContent).toContain("对话测试");
    expect(container.querySelector("#product")?.textContent).toContain("持续迭代");
    expect(container.querySelectorAll("#scenarios article")).toHaveLength(3);
    expect(container.querySelector("header")?.textContent).toBe("AgentHub管理能力运营流程使用场景角色资产创建产品边界登录平台");
    expect(container.querySelector('[aria-label="AgentHub 工作台产品界面示意"]')).toBeNull();
    expect(container.querySelector("#top")?.textContent).toContain("进入工作台");
    expect(container.querySelector('#top a[href="/login?next=%2Fassets%2Fcreate"]')?.textContent).toBe("进入工作台");
    expect(container.querySelector("#top")?.textContent).toContain("05 个阶段");
    expect(container.querySelectorAll("#top dl div")).toHaveLength(3);
    expect(Array.from(container.querySelectorAll("#intent-title > span")).map((line) => line.textContent)).toEqual(["从一句话开始，", "让它走进真实世界。"]);
    expect(container.textContent).not.toContain("先描述你想创造的 Agent，我们会在本次浏览器会话中整理这份创作意图。");
    expect(container.textContent).not.toContain("仅暂存在本次浏览器会话，不会提交到服务器");
    expect(container.querySelector("#create")?.textContent).not.toMatch(/\d+\/240/);
    expect(container.querySelector('#top [aria-label="Agent 创作路径"]')).toBeNull();
    expect(container.querySelectorAll("#top [data-hero-role-card]")).toHaveLength(12);
    expect(container.querySelectorAll("#top [data-hero-role-card] img")).toHaveLength(12);
    expect(container.querySelector('#top [data-hero-role-main="true"]')).not.toBeNull();
    expect(container.querySelector('#top img[src="/images/agenthub-site/hero-role-collage-r12.png"]')).toBeNull();
    const heroSources = Array.from(container.querySelectorAll<HTMLImageElement>("#top [data-hero-role-card] img")).map((image) => image.getAttribute("src"));
    expect(heroSources.every((source) => source?.startsWith("/images/agenthub-site/") && source.endsWith(".png"))).toBe(true);
    expect(new Set(heroSources).size).toBe(12);
    expect(heroSources).toContain("/images/agenthub-site/hero-rounded-fantasy-r17.png");
    expect(heroSources).toContain("/images/agenthub-site/hero-alpaca-companion-r17.png");
    expect(heroSources).toContain("/images/agenthub-site/hero-headset-operator-r17.png");
    expect(heroSources).toContain("/images/agenthub-site/hero-senior-scientist-r17.png");
    expect(heroSources).toContain("/images/agenthub-site/hero-silver-fantasy-r17.png");
    expect(heroSources).toContain("/images/agenthub-site/hero-young-operator-r17.png");
    const heroMainImage = container.querySelector<HTMLImageElement>('#top [data-hero-role-main="true"] img');
    expect(heroMainImage?.getAttribute("src")).toBe("/images/agenthub-site/hero-main-reference-r18.png");
    expect(heroMainImage?.style.objectPosition).toBe("50% 50%");
    expect(heroMainImage?.style.transform).toBe("scale(1)");
    expect(heroSources).not.toContain("/images/agenthub-site/role-creative-director-demo.png");
    expect(container.querySelectorAll("#top [data-wall-slot]")).toHaveLength(0);
    expect(container.querySelector('#top [data-wall-plane="perspective-stage"]')).toBeNull();
    expect(container.querySelectorAll('[aria-label="五步创作流程"] button')).toHaveLength(5);
    expect(container.querySelector("#product")?.textContent).toContain("产品界面示意 · DEMO");
    expect(container.textContent).not.toContain("先整理创作意图，生成与保存前需登录并完成邀请码验证。");
    expect(container.textContent).not.toContain("Living World");
    expect(container.textContent).not.toContain("Agent 市场");
    expect(container.textContent).not.toContain("客户案例");
    expect(container.textContent).not.toContain("40K");
    expect(container.querySelector("#assets")?.textContent).toContain("Demo Asset");
    expect(container.querySelector("#assets-title")?.textContent).toBe("让角色管理更清晰、更高效。");
    expect(Array.from(container.querySelectorAll("#assets-title > span")).map((line) => line.textContent)).toEqual(["让角色管理", "更清晰、更高效。"]);
    expect(container.querySelector("#assets")?.textContent).not.toContain("每一个角色，都在这里继续生长。");
    expect(container.querySelectorAll("#assets article")).toHaveLength(5);
    expect(container.querySelector('#assets p[aria-live="polite"]')).toBeNull();
    expect(container.querySelector('#assets [aria-live="polite"]')?.tagName).toBe("SPAN");
    expect(Array.from(container.querySelectorAll("main > section")).map((section) => section.id)).toEqual(["top", "assets", "product", "scenarios", "create"]);
    expect(container.textContent).not.toContain("15K");
    expect(container.textContent).not.toContain("800+");
    expect(container.textContent).not.toContain("27K+");
    expect(container.textContent).not.toContain("价格");
    expect(container.textContent).not.toContain("文档中心");
    expect(container.textContent).not.toContain("满意度");
  });

  it("focuses a side role card with accessible progress state", async () => {
    vi.useFakeTimers();
    try {
      await renderLanding();
      const sideCard = container.querySelector<HTMLButtonElement>('button[aria-label="聚焦 知序"]')!;
      expect(sideCard).not.toBeNull();
      await act(async () => sideCard.click());
      await act(async () => vi.advanceTimersByTime(720));

      expect(container.querySelector('#assets [aria-live="polite"]')?.getAttribute("aria-label")).toContain("知序");
      expect(container.querySelector('button[aria-label="切换到 知序"]')?.getAttribute("aria-current")).toBe("true");
    } finally {
      vi.useRealTimers();
    }
  });

  it("autoplays at the shared three-second cadence and pauses for reduced motion", async () => {
    vi.useFakeTimers();
    try {
      reducedMotion = false;
      await renderLanding();
      await act(async () => vi.advanceTimersByTime(3000));
      await act(async () => vi.advanceTimersByTime(720));
      expect(container.querySelector('#assets [aria-live="polite"]')?.getAttribute("aria-label")).toContain("知序");
    } finally {
      vi.useRealTimers();
    }

    reducedMotion = true;
    vi.useFakeTimers();
    try {
      await act(async () => root.unmount());
      root = createRoot(container);
      await renderLanding();
      await act(async () => vi.advanceTimersByTime(5000));
      expect(container.querySelector('#assets [aria-live="polite"]')?.getAttribute("aria-label")).toContain("林月");
    } finally {
      vi.useRealTimers();
    }
  });

  it("switches the sticky product stage with semantic current state", async () => {
    await renderLanding();
    const knowledge = findStageButton(container, "知识与技能");
    await act(async () => knowledge.click());

    expect(knowledge.getAttribute("aria-current")).toBe("step");
    expect(container.querySelector("#flow-product-panel")?.textContent).toContain("把真实能力接进来");
    expect(container.querySelector("#flow-product-panel")?.textContent).toContain("世界观与角色设定");
  });

  it("keeps only the latest product stage active during rapid selection", async () => {
    await renderLanding();

    await act(async () => {
      findStageButton(container, "角色设定").click();
      findStageButton(container, "发布运行").click();
      findStageButton(container, "知识与技能").click();
    });

    expect(findStageButton(container, "知识与技能").getAttribute("aria-current")).toBe("step");
    expect(container.querySelector("#flow-product-panel")?.textContent).toContain("把真实能力接进来");
    expect(container.querySelectorAll("#flow-product-panel [data-state]")).toHaveLength(1);
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

  it("keeps a stable first product stage active when reduced motion is requested", async () => {
    await renderLanding();
    expect(findStageButton(container, "角色设定").getAttribute("aria-current")).toBe("step");
    expect(container.querySelector('[data-state="identity"]')?.textContent).toContain("先让角色站稳");
  });

  it("uses an immediate stage scroll path when reduced motion is requested", async () => {
    await renderLanding();
    const flow = container.querySelector<HTMLElement>("#product")!;
    Object.defineProperty(flow, "offsetHeight", { configurable: true, value: 4000 });
    vi.spyOn(flow, "getBoundingClientRect").mockReturnValue({ x: 0, y: 1200, top: 1200, right: 1000, bottom: 5200, left: 0, width: 1000, height: 4000, toJSON: () => ({}) });
    await act(async () => findStageButton(container, "发布运行").click());

    expect(scrollTo).toHaveBeenCalledWith({ top: 3600, behavior: "auto" });
    expect(findStageButton(container, "发布运行").getAttribute("aria-current")).toBe("step");
  });

  it("holds a manual step selection before scroll geometry can take control again", async () => {
    reducedMotion = false;
    let currentTime = 1000;
    vi.spyOn(performance, "now").mockImplementation(() => currentTime);
    await renderLanding();

    const flow = container.querySelector<HTMLElement>("#product")!;
    Object.defineProperty(flow, "offsetHeight", { configurable: true, value: 4000 });
    vi.spyOn(flow, "getBoundingClientRect").mockReturnValue({
      x: 0,
      y: 0,
      top: 0,
      right: 1000,
      bottom: 4000,
      left: 0,
      width: 1000,
      height: 4000,
      toJSON: () => ({}),
    });

    await act(async () => findStageButton(container, "发布运行").click());
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
      runAnimationFrame();
    });
    expect(findStageButton(container, "发布运行").getAttribute("aria-current")).toBe("step");

    currentTime = 2201;
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
      runAnimationFrame();
    });
    expect(findStageButton(container, "角色设定").getAttribute("aria-current")).toBe("step");
  });

  it("keeps the five-step selector operable at a 390px viewport", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
    await renderLanding();
    await act(async () => findStageButton(container, "持续迭代").click());

    expect(findStageButton(container, "持续迭代").getAttribute("aria-current")).toBe("step");
    expect(container.querySelector('[data-state="iterate"]')?.textContent).toContain("回到对话测试");
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it("maps sticky scroll progress deterministically across five stages", () => {
    expect(flowStageFromProgress(-1)).toBe(0);
    expect(flowStageFromProgress(0.13)).toBe(1);
    expect(flowStageFromProgress(0.5)).toBe(2);
    expect(flowStageFromProgress(0.88)).toBe(4);
    expect(flowStageFromProgress(2)).toBe(4);
  });

  it("fills the real intent field from a shortcut without submitting", async () => {
    await renderLanding();
    await act(async () => findButton(container, "团队知识问答 Agent").click());

    expect(container.querySelector<HTMLTextAreaElement>("#creation-intent")?.value).toBe("我想创造一个团队知识问答 Agent");
    expect(window.sessionStorage.getItem(CREATION_INTENT_SESSION_KEY)).toBeNull();
  });
});
