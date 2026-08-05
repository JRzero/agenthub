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
    expect(source).toContain('data-testid="agent-image-card"');
    expect(source).toContain("<AgentArtwork agent={agent}");
    expect(source).toContain("aspect-[4/3]");
  });

  it("uses fixed card heights and stable vertical partitions at every grid breakpoint", () => {
    expect(source).toContain("h-[608px]");
    expect(source).toContain("md:h-[536px]");
    expect(source).toContain("xl:h-[496px]");
    expect(source).toContain("min-[1440px]:h-[536px]");
    expect(source).toContain("2xl:h-[512px]");
    expect(source).not.toContain("min-h-[430px]");
    expect(source).toContain("aspect-[4/3] min-h-[220px] shrink-0");
    expect(source).toContain("flex min-h-0 flex-1 flex-col p-4");
    expect(source).toContain("mt-auto grid shrink-0 grid-cols-2");
    expect(source).toContain("flex shrink-0 items-center justify-between");
  });

  it("contains long and missing optional card content without changing the card frame", () => {
    expect(source).toContain('className="truncate text-lg font-semibold"');
    expect(source).toContain("line-clamp-2 min-h-10");
    expect(source).toContain('agent.description || agent.tagline || "暂无描述，进入工作区完善 Agent。"');
    expect(source).toContain('agent.llm_model_name || agent.model || "尚未配置"');
    expect(source).toContain('return "暂无更新"');
  });

  it("keeps list mode and all collection behaviors alongside the image-led card", () => {
    expect(source).toContain('view === "card" ? <CardView agents={agents} /> : <ListView agents={agents} />');
    expect(source).toContain("filterAndSortAgents(allAgents");
    expect(source).toContain("writeAssetView(window.localStorage, next)");
    expect(source).not.toContain("DEMO_AGENTS");
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
