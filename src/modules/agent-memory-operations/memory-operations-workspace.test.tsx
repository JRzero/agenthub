import React, { act } from "react";
import { createRoot } from "react-dom/client";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { demoAgentMemoryAnalytics } from "@/fixtures/agent-memory-operations";
import { toAgentMemoryOperationsModel } from "./model";
import { MEMORY_ANALYTICS_REFRESH_POLICY } from "./queries";
import {
  MemoryRefreshButton,
  OperationsContent,
} from "./memory-operations-workspace";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean })
  .IS_REACT_ACT_ENVIRONMENT = true;

describe("memory operations states and interactions", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders creator-readable terminology and no raw primary contract terms", () => {
    const markup = renderToStaticMarkup(
      <OperationsContent
        model={toAgentMemoryOperationsModel(demoAgentMemoryAnalytics(9))}
      />,
    );

    for (const term of [
      "记忆关系",
      "关系数据完整度",
      "情绪数据完整度",
      "情绪记录",
      "已获取",
      "暂未获取",
      "已有记录",
      "尚未积累",
      "近期状态",
      "整体心境",
    ]) {
      expect(markup).toContain(term);
    }
    for (const rawTerm of [
      "Active Memory",
      "Relationship",
      "Emotion",
      "coverage",
      "Ready",
      "Empty",
    ]) {
      expect(markup).not.toContain(rawTerm);
    }
  });

  it("shows no-sample guidance without a zero percentage", () => {
    const markup = renderToStaticMarkup(
      <OperationsContent
        model={toAgentMemoryOperationsModel({
          agent_id: 9,
          coverage: {
            total_active_memories: 0,
            relationship_available: 0,
            relationship_unavailable: 0,
            emotion_available: 0,
            emotion_unavailable: 0,
          },
          partial: false,
        })}
      />,
    );

    expect(markup).toContain("记忆关系尚未积累");
    expect(markup).toContain("暂无样本");
    expect(markup).not.toContain(">0%</span>");
  });

  it("uses neutral channel colors with visible labels instead of red-green semantics", () => {
    const markup = renderToStaticMarkup(
      <OperationsContent
        model={toAgentMemoryOperationsModel(demoAgentMemoryAnalytics(9))}
      />,
    );

    expect(markup).toContain('data-memory-channel="relationship"');
    expect(markup).toContain("bg-indigo-600");
    expect(markup).toContain('data-memory-channel="emotion"');
    expect(markup).toContain("bg-cyan-600");
    expect(markup).not.toContain("bg-rose-500");
    expect(markup).toContain("已获取");
    expect(markup).toContain("暂未获取");
  });

  it("keeps sparse relationship and emotion channels at compact workspace density", () => {
    const markup = renderToStaticMarkup(
      <OperationsContent
        model={toAgentMemoryOperationsModel({
          agent_id: 9,
          coverage: {
            total_active_memories: 1,
            relationship_available: 1,
            relationship_unavailable: 0,
            emotion_available: 1,
            emotion_unavailable: 0,
          },
          relationship: {
            stage_distribution: { known: 1 },
            average_affection: null,
            average_trust: null,
            average_familiarity: null,
            milestone_count: 0,
            score_scales: {},
          },
          emotion: {
            status_distribution: { ready: 1 },
            sample_count: 1,
            state_distribution: {},
            mood_distribution: {},
            mean_valence: null,
            mean_arousal: null,
            relationship_level: null,
            recent_affection: null,
            score_scales: {},
          },
          partial: false,
        })}
      />,
    );

    expect(markup.match(/data-density="compact"/g)).toHaveLength(2);
    expect(markup).toContain("text-lg font-semibold leading-none");
    expect(markup).not.toContain("text-2xl font-semibold tracking-tight tabular-nums");
  });

  it("provides manual refresh without automatic-refresh controls", async () => {
    const onRefresh = vi.fn();
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <MemoryRefreshButton
          refreshing={false}
          onRefresh={onRefresh}
        />,
      );
    });

    const refresh = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent?.trim() === "刷新",
    );

    expect(container.querySelector('[role="switch"]')).toBeNull();
    expect(container.textContent).not.toContain("自动刷新");
    expect(refresh?.className).toContain("h-11");

    await act(async () => {
      refresh?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(onRefresh).toHaveBeenCalledTimes(1);

    await act(async () => root.unmount());
  });

  it("does not refetch automatically on window focus or reconnect", () => {
    expect(MEMORY_ANALYTICS_REFRESH_POLICY).toEqual({
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });
  });
});
