import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  join(process.cwd(), "src/app/(workspace)/assets/page.tsx"),
  "utf8",
);

describe("Agent Asset Library visual hierarchy", () => {
  it("keeps collection context and discovery controls visible", () => {
    expect(source).toContain('aria-label="Agent 资产筛选"');
    expect(source).toContain('placeholder="搜索 Agent 名称、编码或描述"');
    expect(source).toContain('ariaLabel="Agent 排序"');
    expect(source).toContain('aria-label="卡片视图"');
    expect(source).toContain('aria-label="列表视图"');
  });

  it("presents structured card metadata and navigation", () => {
    expect(source).toContain('label="运行模型"');
    expect(source).toContain('label="最近更新"');
    expect(source).toContain('aria-label="Agent 资产卡片"');
    expect(source).toContain('aria-label="Agent 资产列表"');
    expect(source).toContain('href={assetHref(agent)}');
  });

  it("shows resumable creation progress without fabricating a version", () => {
    expect(source).toContain("创建中 · 第 ${index}/4 步");
    expect(source).toContain('return "尚未发布版本"');
    expect(source).toContain('href={assetHref(agent)}');
  });

  it("provides distinct initial-empty and filtered-empty actions", () => {
    expect(source).toContain('"没有匹配的 Agent 资产"');
    expect(source).toContain('"还没有 Agent 资产"');
    expect(source).toContain("onClick={clearFilters}");
    expect(source).toContain('router.push("/assets/create")');
  });
});
