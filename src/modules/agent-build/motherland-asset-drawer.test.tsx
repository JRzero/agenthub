import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEMO_AGENTS } from "@/fixtures/demo-data";
import { AgentAvatar } from "@/modules/agents/agent-avatar";
import { createBuildDraft } from "./types";

Object.assign(globalThis, { React });
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("@/config/capabilities", () => ({ DATA_MODE: "demo" }));
vi.mock("@/modules/auth/auth-provider", () => ({ useAuth: () => ({ session: null }) }));

import { AvatarCandidatePreview, MotherlandAssetDrawer } from "./motherland-asset-drawer";

const agent = DEMO_AGENTS[0];
const draft = createBuildDraft(agent);

async function renderDrawer(overrides: Partial<React.ComponentProps<typeof MotherlandAssetDrawer>> = {}) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  const props: React.ComponentProps<typeof MotherlandAssetDrawer> = {
    kind: "avatar",
    agent,
    draft,
    onClose: vi.fn(),
    onAgentUpdated: vi.fn(),
    onDemoAssetCreated: vi.fn(),
    onDraftConflict: vi.fn(async () => undefined),
    ...overrides,
  };

  await act(async () => root.render(<MotherlandAssetDrawer {...props} />));
  return { container, root, props };
}

function button(container: HTMLElement, label: string) {
  const match = Array.from(container.querySelectorAll("button")).find(
    (item) => item.textContent?.trim() === label,
  );
  expect(match, `missing button ${label}`).toBeTruthy();
  return match!;
}

async function click(element: Element) {
  await act(async () => element.dispatchEvent(new MouseEvent("click", { bubbles: true })));
}

describe("avatar candidate preview", () => {
  it.each([
    ["portrait", 720, 1280],
    ["square", 960, 960],
    ["landscape", 1280, 720],
  ])("contains the complete %s image without cover or overflow", async (_name, width, height) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => root.render(
      <AvatarCandidatePreview src={`data:image/png;ratio=${width}x${height}`} failed={false} onError={vi.fn()} />,
    ));

    const surface = container.querySelector<HTMLElement>('[data-testid="avatar-candidate-preview"]')!;
    const image = container.querySelector<HTMLImageElement>('[data-testid="avatar-candidate-image"]')!;
    Object.defineProperties(image, {
      naturalWidth: { configurable: true, value: width },
      naturalHeight: { configurable: true, value: height },
    });
    await act(async () => image.dispatchEvent(new Event("load")));

    expect(surface.className).toContain("overflow-hidden");
    expect(surface.className).toContain("h-[clamp(14rem,52dvh,40rem)]");
    expect(surface.className).toContain("bg-slate-950/40");
    expect(image.className).toContain("h-full w-full object-contain");
    expect(image.className).not.toContain("object-cover");
    expect(image.getAttribute("width")).toBeNull();
    expect(image.getAttribute("height")).toBeNull();

    await act(async () => root.unmount());
    container.remove();
  });

  it("keeps the reserved preview geometry while loading or failed", async () => {
    const loading = renderToStaticMarkup(
      <AvatarCandidatePreview src="data:image/png;base64,preview" failed={false} onError={vi.fn()} />,
    );
    const failed = renderToStaticMarkup(
      <AvatarCandidatePreview src="data:image/png;base64,preview" failed onError={vi.fn()} />,
    );

    for (const markup of [loading, failed]) {
      expect(markup).toContain("h-[clamp(14rem,52dvh,40rem)]");
      expect(markup).toContain("overflow-hidden");
    }
    expect(failed).toContain("候选图片加载失败");
  });

  it("keeps the fixed footer actions reachable and preserves generate, regenerate, confirm, complete, cancel, and close behavior", async () => {
    const { container, root, props } = await renderDrawer();
    const prompt = container.querySelector<HTMLTextAreaElement>('textarea[placeholder="描述头像的发型、表情、服装、构图与画风"]')!;

    await act(async () => {
      Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set?.call(prompt, "完整头像构图");
      prompt.dispatchEvent(new Event("input", { bubbles: true }));
      prompt.dispatchEvent(new Event("change", { bubbles: true }));
    });
    await click(button(container, "生成候选"));

    expect(container.querySelector('[data-testid="avatar-candidate-image"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="avatar-candidate-preview"]')?.parentElement?.className).toContain("shrink-0");
    expect(container.querySelector('[data-testid="motherland-drawer-scroll"]')?.className).toContain("overflow-y-scroll");
    expect(button(container, "取消").closest("footer")?.className).toContain("shrink-0");

    await click(button(container, "生成候选"));
    expect(container.querySelectorAll('[data-testid="avatar-candidate-image"]')).toHaveLength(1);

    await click(button(container, "确认使用"));
    expect(props.onAgentUpdated).toHaveBeenCalledTimes(1);
    const updatedAgent = vi.mocked(props.onAgentUpdated).mock.calls[0][0];
    expect(updatedAgent.config?.metadata?.avatar).toBe("/images/lin-yue-avatar.png");
    expect(button(container, "完成")).toBeTruthy();
    await click(button(container, "完成"));
    expect(props.onClose).toHaveBeenCalledTimes(1);

    await act(async () => root.unmount());
    container.remove();

    const cancelRun = await renderDrawer();
    await click(button(cancelRun.container, "取消"));
    expect(cancelRun.props.onClose).toHaveBeenCalledTimes(1);
    await click(cancelRun.container.querySelector('button[aria-label="关闭 Motherland 生成"]')!);
    expect(cancelRun.props.onClose).toHaveBeenCalledTimes(2);
    await act(async () => cancelRun.root.unmount());
    cancelRun.container.remove();
  });

  it("leaves the confirmed Agent avatar on the existing square cover rule", () => {
    const markup = renderToStaticMarkup(<AgentAvatar agent={agent} size={88} />);
    expect(markup).toContain("object-cover");
    expect(markup).not.toContain("object-contain");
  });
});

beforeEach(() => {
  document.body.innerHTML = "";
});
