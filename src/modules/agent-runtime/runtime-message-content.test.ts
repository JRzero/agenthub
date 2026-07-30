import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { API_OVERRIDE_STORAGE_KEY } from "@/shared/api/api-base";
import {
  RuntimeMessageContent,
  resolveRuntimeUrl,
} from "./runtime-message-content";

describe("resolveRuntimeUrl", () => {
  beforeAll(() => {
    Object.assign(globalThis, { React });
  });

  beforeEach(() => {
    window.localStorage.clear();
  });

  it("resolves relative Agent media URLs against the configured API base", () => {
    window.localStorage.setItem(
      API_OVERRIDE_STORAGE_KEY,
      "https://api.agenthub.example",
    );

    expect(
      resolveRuntimeUrl(
        "/api/v1/files/ft_1f9f258f-3c62-4efc-9991-031ee3cbc7a8/download",
      ),
    ).toBe(
      "https://api.agenthub.example/api/v1/files/ft_1f9f258f-3c62-4efc-9991-031ee3cbc7a8/download",
    );
  });

  it("preserves absolute Agent media URLs", () => {
    expect(resolveRuntimeUrl("https://cdn.example/image.png")).toBe(
      "https://cdn.example/image.png",
    );
  });

  it("renders the resolved image inside the assistant message content", () => {
    window.localStorage.setItem(
      API_OVERRIDE_STORAGE_KEY,
      "https://api.agenthub.example",
    );

    const html = renderToStaticMarkup(
      React.createElement(RuntimeMessageContent, {
        content: "图片已生成",
        imageUrl: "/api/v1/files/generated/download",
      }),
    );

    expect(html).toContain("图片已生成");
    expect(html).toContain('alt="Agent 生成图片"');
    expect(html).toContain(
      'href="https://api.agenthub.example/api/v1/files/generated/download"',
    );
    expect(html).toContain(
      'src="https://api.agenthub.example/api/v1/files/generated/download"',
    );
  });

  it("renders common Markdown blocks and inline formatting safely", () => {
    const html = renderToStaticMarkup(
      React.createElement(RuntimeMessageContent, {
        content:
          "## 今日建议\n\n1. **养宠物**\n2. 使用 `10 分钟`\n\n[查看说明](https://example.com)",
      }),
    );

    expect(html).toContain("<h2");
    expect(html).toContain("<ol");
    expect(html).toContain("<strong");
    expect(html).toContain("<code");
    expect(html).toContain('href="https://example.com"');
    expect(html).not.toContain("**养宠物**");
  });

  it("does not turn unsafe Markdown links into anchors", () => {
    const html = renderToStaticMarkup(
      React.createElement(RuntimeMessageContent, {
        content: "[危险链接](javascript:alert(1))",
      }),
    );

    expect(html).not.toContain("<a");
    expect(html).not.toContain('href="javascript:');
  });

  it("does not create a URL for a missing media value", () => {
    expect(resolveRuntimeUrl()).toBeUndefined();
  });
});
