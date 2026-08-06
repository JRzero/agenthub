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
    expect(source).toContain("bg-gradient-to-t from-canvas via-canvas/90 to-transparent");
    expect(source).toContain('className="truncate text-xl font-semibold"');
  });

  it("uses fixed card heights with readable one, two, three, and four-column breakpoints", () => {
    const obsolete1536Breakpoint = ["min-[", "1536px]:grid-cols-4"].join("");
    const obsolete1800Breakpoint = ["min-[", "1800px]:grid-cols-4"].join("");

    expect(source).toContain("h-[420px]");
    expect(source).toContain("grid-cols-1");
    expect(source).toContain("md:grid-cols-2");
    expect(source).toContain("min-[1180px]:grid-cols-3");
    expect(source).toContain("min-[1440px]:grid-cols-4");
    expect(source).not.toContain(obsolete1536Breakpoint);
    expect(source).not.toContain(obsolete1800Breakpoint);
    expect(source).toContain("relative min-h-0 flex-1 overflow-hidden");
    expect(source).toContain("grid h-[92px] shrink-0 grid-cols-2");
    expect(source).toContain("group relative flex h-[420px] flex-col overflow-hidden");
    expect(source).not.toContain("h-[608px]");
  });

  it("contains long and missing optional card content without changing the card frame", () => {
    expect(source).toContain('className="truncate text-xl font-semibold"');
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

  it("preserves explicit loading and error request states", () => {
    expect(source).toContain('<LoadingState label="正在加载 Agent 资产…" />');
    expect(source).toContain('<ErrorState message={query.error.message}');
    expect(source).toContain("query.refetch()");
  });
});
