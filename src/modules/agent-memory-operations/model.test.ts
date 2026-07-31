import { describe, expect, it } from "vitest";
import { demoAgentMemoryAnalytics } from "@/fixtures/agent-memory-operations";
import { ApiError } from "@/shared/api/http-client";
import {
  formatMetric,
  formatPercentage,
  isStaleMemorySnapshot,
  resolveMemoryAnalyticsError,
  safeShare,
  shouldRetryMemoryAnalytics,
  toAgentMemoryOperationsModel,
} from "./model";
import type { AgentMemoryAnalytics } from "./types";

function analytics(
  patch: Partial<AgentMemoryAnalytics> = {},
): AgentMemoryAnalytics {
  return { ...demoAgentMemoryAnalytics(9), ...patch };
}

describe("Agent memory operations model", () => {
  it("uses the verified denominators for coverage, stages, formation, and states", () => {
    const model = toAgentMemoryOperationsModel(analytics());

    expect(model.relationshipCoverage).toBeCloseTo(11 / 12);
    expect(model.emotionCoverage).toBeCloseTo(10 / 12);
    expect(model.relationshipStages?.find((item) => item.key === "acquaintance")?.share)
      .toBeCloseTo(6 / 11);
    expect(model.emotionFormation?.find((item) => item.key === "ready")?.share)
      .toBeCloseTo(9 / 10);
    expect(model.recentStates?.find((item) => item.key === "normal")?.share)
      .toBeCloseTo(7 / 10);
  });

  it("returns no percentage for a zero denominator", () => {
    const model = toAgentMemoryOperationsModel({
      agent_id: 9,
      coverage: {
        total_active_memories: 0,
        relationship_available: 0,
        relationship_unavailable: 0,
        emotion_available: 0,
        emotion_unavailable: 0,
      },
      partial: false,
    });

    expect(safeShare(0, 0)).toBeNull();
    expect(formatPercentage(model.relationshipCoverage)).toBe("暂无样本");
    expect(model.emotionCoverage).toBeNull();
    expect(model.emotionSampleCount).toBeNull();
    expect(model.diagnostic).toMatchObject({
      tone: "empty",
      badge: "尚未积累",
    });
  });

  it("preserves omitted modules and null scores instead of manufacturing zeroes", () => {
    const omitted = toAgentMemoryOperationsModel(
      analytics({
        relationship: undefined,
        emotion: undefined,
        partial: true,
      }),
    );
    expect(omitted.relationshipStages).toBeNull();
    expect(omitted.emotionFormation).toBeNull();
    expect(omitted.relationshipScores).toBeNull();
    expect(omitted.emotionScores).toBeNull();
    expect(omitted.emotionSampleCount).toBeNull();

    const source = analytics();
    const withNull = toAgentMemoryOperationsModel({
      ...source,
      emotion: {
        ...source.emotion!,
        mean_valence: null,
        relationship_level: null,
      },
    });
    expect(
      withNull.emotionScores?.find((score) => score.key === "mean_valence")?.value,
    ).toBeNull();
    expect(formatMetric(null)).toBe("—");
  });

  it("keeps coexisting state shares independent even when the total exceeds 100%", () => {
    const source = analytics();
    const model = toAgentMemoryOperationsModel({
      ...source,
      emotion: {
        ...source.emotion!,
        state_distribution: { normal: 10, happy: 8, tired: 4 },
      },
    });

    expect(
      model.recentStates?.reduce((sum, item) => sum + (item.share || 0), 0),
    ).toBeCloseTo(2.2);
  });

  it("flags a relationship-stage count mismatch without filling the gap", () => {
    const source = analytics();
    const model = toAgentMemoryOperationsModel({
      ...source,
      relationship: {
        ...source.relationship!,
        stage_distribution: { stranger: 1 },
      },
    });

    expect(model.relationshipStageCountsMatch).toBe(false);
    expect(model.relationshipStages).toHaveLength(1);
  });

  it("distinguishes missing service signals from accessible records still accumulating", () => {
    expect(toAgentMemoryOperationsModel(analytics()).diagnostic).toMatchObject({
      tone: "partial",
      badge: "部分数据暂未获取",
    });

    const source = analytics();
    const accumulating = toAgentMemoryOperationsModel({
      ...source,
      coverage: {
        total_active_memories: 2,
        relationship_available: 2,
        relationship_unavailable: 0,
        emotion_available: 2,
        emotion_unavailable: 0,
      },
      relationship: {
        ...source.relationship!,
        stage_distribution: { acquaintance: 2 },
      },
      emotion: {
        ...source.emotion!,
        status_distribution: { ready: 1, empty: 1 },
      },
      partial: false,
    });
    expect(accumulating.diagnostic).toMatchObject({
      tone: "accumulating",
      badge: "情绪记录积累中",
    });
    expect(
      accumulating.emotionFormation?.find((item) => item.key === "empty")?.label,
    ).toBe("尚未积累");
  });

  it.each([
    [400, undefined, "Agent 参数异常", false],
    [401, undefined, "登录状态已失效", false],
    [404, "AGENTMEM_ANALYTICS_NOT_FOUND", "Agent 不存在或无查看权限", false],
    [503, "AGENTMEM_ANALYTICS_UNAVAILABLE", "记忆分析服务暂未配置", false],
    [500, undefined, "暂时无法获取记忆服务状态", true],
  ])(
    "maps HTTP %i to a specific presentation state",
    (status, code, title, retryable) => {
      expect(
        resolveMemoryAnalyticsError(new ApiError("failure", status, code)),
      ).toMatchObject({ title, retryable });
    },
  );

  it("only retries transient server failures once", () => {
    expect(shouldRetryMemoryAnalytics(0, new ApiError("bad", 400))).toBe(false);
    expect(shouldRetryMemoryAnalytics(0, new ApiError("off", 503))).toBe(false);
    expect(shouldRetryMemoryAnalytics(0, new ApiError("down", 500))).toBe(true);
    expect(shouldRetryMemoryAnalytics(1, new ApiError("down", 500))).toBe(false);
  });

  it("marks only failed retained data as stale", () => {
    expect(isStaleMemorySnapshot(true, new Error("refresh failed"))).toBe(true);
    expect(isStaleMemorySnapshot(false, new Error("initial failed"))).toBe(false);
    expect(isStaleMemorySnapshot(true, null)).toBe(false);
  });
});
