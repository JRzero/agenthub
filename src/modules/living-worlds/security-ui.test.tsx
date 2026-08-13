import React, { act } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "@/shared/api/http-client";
import { createEmptyWorldContent } from "./types";

const { detailMock, updateMock } = vi.hoisted(() => ({ detailMock: vi.fn(), updateMock: vi.fn() }));

vi.mock("@/modules/auth/auth-provider", () => ({ useAuth: () => ({ session: { apiKey: "et_test_ui" } }) }));
vi.mock("@/modules/workspace/workspace-provider", () => ({ useWorkspace: () => ({ workspaceCode: "studio" }) }));
vi.mock("./api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./api")>();
  return { ...actual, worldApi: { ...actual.worldApi, detail: detailMock, update: updateMock } };
});

import { WorldEditorWorkspace } from "./detail-workspaces";

Object.assign(globalThis, { React });
(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

async function flushUi() {
  await act(async () => { await new Promise((resolve) => setTimeout(resolve, 0)); });
}

function click(element: Element) {
  element.dispatchEvent(new MouseEvent("click", { bubbles: true }));
}

function changeTextarea(element: HTMLTextAreaElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")?.set;
  setter?.call(element, value);
  element.dispatchEvent(new Event("input", { bubbles: true }));
}

describe("Living World security UI", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    detailMock.mockReset();
    updateMock.mockReset();
    window.localStorage.clear();
  });

  it("copies a conflict draft through the real UI handler without unknown canary fields", async () => {
    detailMock.mockResolvedValue({
      world: { world_code: "monster", workspace_code: "studio", status: "draft", revision: 1, content: createEmptyWorldContent() },
      role: "owner", preflight: { ready: false, missing: [] }, participants: [],
    });
    updateMock.mockRejectedValue(new ApiError("conflict", 409, "WORLD_CONFLICT"));
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });

    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);
    const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    await act(async () => root.render(<QueryClientProvider client={client}><WorldEditorWorkspace worldCode="monster" /></QueryClientProvider>));
    await flushUi();

    const rulesButton = [...container.querySelectorAll("button")].find((button) => button.textContent?.trim() === "2. 世界规则");
    expect(rulesButton).toBeTruthy();
    await act(async () => click(rulesButton!));

    const structuredRules = [...container.querySelectorAll("label")].find((label) => label.textContent?.includes("结构化规则"))?.querySelector("textarea");
    expect(structuredRules).toBeInstanceOf(HTMLTextAreaElement);
    await act(async () => changeTextarea(structuredRules as HTMLTextAreaElement, JSON.stringify([{ code: "rule-1", kind: "hard", description: "", conditions: [], secret_canary: "UI_CLIPBOARD_SECRET_CANARY" }])));

    const saveButton = [...container.querySelectorAll("button")].find((button) => button.textContent?.trim() === "保存");
    expect(saveButton).toBeTruthy();
    await act(async () => click(saveButton!));
    await flushUi();

    const copyButton = [...container.querySelectorAll("button")].find((button) => button.textContent?.trim() === "复制我的修改");
    expect(copyButton).toBeTruthy();
    await act(async () => click(copyButton!));
    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith(expect.not.stringContaining("UI_CLIPBOARD_SECRET_CANARY"));

    await act(async () => root.unmount());
    container.remove();
  });
});
