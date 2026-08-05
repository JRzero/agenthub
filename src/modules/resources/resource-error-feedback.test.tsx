import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ResourceErrorFeedback } from "./resource-error-feedback";

describe("resource error recovery", () => {
  it("keeps the failure visible and offers an explicit retry", () => {
    const markup = renderToStaticMarkup(<ResourceErrorFeedback message="无法加载技能库" onRetry={vi.fn()} />);
    expect(markup).toContain('role="alert"');
    expect(markup).toContain("无法加载技能库");
    expect(markup).toContain("重试");
  });
});
