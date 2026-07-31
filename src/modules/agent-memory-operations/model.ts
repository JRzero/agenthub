import { ApiError } from "@/shared/api/http-client";
import type {
  AgentMemoryAnalytics,
  AgentMemoryOperationsModel,
  MemoryAnalyticsErrorState,
  MemoryDiagnostic,
  MemoryDistributionItem,
  MemoryScoreItem,
  MemoryScoreScales,
} from "./types";

const RELATIONSHIP_STAGE_LABELS: Record<string, string> = {
  stranger: "陌生",
  acquaintance: "相识",
  companion: "陪伴",
  close_friend: "亲近",
  confidant: "知己",
  soulmate: "默契",
};

const EMOTION_STATE_LABELS: Record<string, string> = {
  normal: "正常",
  calm: "平静",
  happy: "开心",
  excited: "兴奋",
  content: "满足",
  tired: "疲惫",
  sad: "低落",
  anxious: "焦虑",
  angry: "生气",
  lonely: "孤单",
};

const EMOTION_STATUS_LABELS: Record<string, string> = {
  ready: "已有记录",
  empty: "尚未积累",
};

export function safeShare(numerator: number, denominator: number): number | null {
  return denominator > 0 ? numerator / denominator : null;
}

export function formatPercentage(share: number | null, digits = 1): string {
  if (share === null) return "暂无样本";
  const percentage = share * 100;
  const decimals = Number.isInteger(percentage) ? 0 : digits;
  return `${percentage.toFixed(decimals)}%`;
}

export function formatMetric(value: number | null, digits = 2): string {
  if (value === null) return "—";
  return Number.isInteger(value) ? String(value) : value.toFixed(digits);
}

function mappedLabel(
  key: string,
  labels: Record<string, string>,
  fallback: string,
): string {
  return labels[key] || (/[\u3400-\u9fff]/.test(key) ? key : fallback);
}

function distributionItems(
  distribution: Record<string, number>,
  denominator: number,
  labels: Record<string, string>,
  fallback: string,
): MemoryDistributionItem[] {
  return Object.entries(distribution)
    .map(([key, count]) => ({
      key,
      label: mappedLabel(key, labels, fallback),
      count,
      share: safeShare(count, denominator),
    }))
    .sort((left, right) => right.count - left.count || left.key.localeCompare(right.key));
}

function scaleFor(scales: MemoryScoreScales, key: string): unknown {
  return Object.prototype.hasOwnProperty.call(scales, key) ? scales[key] : null;
}

function relationshipScoreItems(
  data: NonNullable<AgentMemoryAnalytics["relationship"]>,
): MemoryScoreItem[] {
  return [
    {
      key: "average_affection",
      label: "平均亲近信号",
      value: data.average_affection,
      scale: scaleFor(data.score_scales, "affection"),
    },
    {
      key: "average_trust",
      label: "平均信任信号",
      value: data.average_trust,
      scale: scaleFor(data.score_scales, "trust"),
    },
    {
      key: "average_familiarity",
      label: "平均熟悉信号",
      value: data.average_familiarity,
      scale: scaleFor(data.score_scales, "familiarity"),
    },
    {
      key: "milestone_count",
      label: "里程碑记录",
      value: data.milestone_count,
      scale: null,
    },
  ];
}

function emotionScoreItems(
  data: NonNullable<AgentMemoryAnalytics["emotion"]>,
): MemoryScoreItem[] {
  return [
    {
      key: "mean_valence",
      label: "平均情绪倾向",
      value: data.mean_valence,
      scale: scaleFor(data.score_scales, "mean_valence"),
    },
    {
      key: "mean_arousal",
      label: "平均情绪活跃度",
      value: data.mean_arousal,
      scale: scaleFor(data.score_scales, "mean_arousal"),
    },
    {
      key: "relationship_level",
      label: "长期亲近信号",
      value: data.relationship_level,
      scale: scaleFor(data.score_scales, "relationship_level"),
    },
    {
      key: "recent_affection",
      label: "近期亲密表达",
      value: data.recent_affection,
      scale: scaleFor(data.score_scales, "recent_affection"),
    },
  ];
}

export function buildMemoryDiagnostic(data: AgentMemoryAnalytics): MemoryDiagnostic {
  const coverage = data.coverage;
  if (coverage.total_active_memories === 0) {
    return {
      tone: "empty",
      badge: "尚未积累",
      summary: "这个 Agent 还没有可分析的记忆关系。",
      advice: "先让真实用户与 Agent 互动，形成记忆关系后再回来查看。",
    };
  }

  const missing: string[] = [];
  if (coverage.relationship_unavailable > 0 || !data.relationship) {
    missing.push(`${coverage.relationship_unavailable || coverage.total_active_memories} 份关系数据`);
  }
  if (coverage.emotion_unavailable > 0 || !data.emotion) {
    missing.push(`${coverage.emotion_unavailable || coverage.total_active_memories} 份情绪数据`);
  }
  if (data.partial || missing.length > 0) {
    return {
      tone: "partial",
      badge: "部分数据暂未获取",
      summary: `${coverage.total_active_memories} 份记忆关系中，${missing.join("和")}暂未获取。`,
      advice: "可稍后手动刷新；如果一直未恢复，请检查记忆服务。",
    };
  }

  const emptyCount = data.emotion?.status_distribution.empty || 0;
  if (emptyCount > 0) {
    return {
      tone: "accumulating",
      badge: "情绪记录积累中",
      summary: `${emptyCount} 份可访问的记忆关系尚未积累情绪记录。`,
      advice: "继续积累真实互动即可，这不代表服务异常。",
    };
  }

  return {
    tone: "complete",
    badge: "本次数据完整",
    summary: "本次已获取全部记忆关系与情绪数据。",
    advice: "当前无需处理，需要时可手动刷新查看最新状态。",
  };
}

export function toAgentMemoryOperationsModel(
  data: AgentMemoryAnalytics,
): AgentMemoryOperationsModel {
  const coverage = data.coverage;
  const relationship = data.relationship;
  const emotion = data.emotion;
  const relationshipStages = relationship
    ? distributionItems(
        relationship.stage_distribution,
        coverage.relationship_available,
        RELATIONSHIP_STAGE_LABELS,
        "其他阶段",
      )
    : null;
  const emotionFormation = emotion
    ? distributionItems(
        emotion.status_distribution,
        coverage.emotion_available,
        EMOTION_STATUS_LABELS,
        "其他情况",
      )
    : null;

  return {
    agentId: data.agent_id,
    totalMemories: coverage.total_active_memories,
    relationshipAvailable: coverage.relationship_available,
    relationshipUnavailable: coverage.relationship_unavailable,
    relationshipCoverage: safeShare(
      coverage.relationship_available,
      coverage.total_active_memories,
    ),
    emotionAvailable: coverage.emotion_available,
    emotionUnavailable: coverage.emotion_unavailable,
    emotionCoverage: safeShare(
      coverage.emotion_available,
      coverage.total_active_memories,
    ),
    emotionSampleCount: emotion ? emotion.sample_count : null,
    relationshipStages,
    relationshipStageCountsMatch: relationshipStages
      ? relationshipStages.reduce((sum, item) => sum + item.count, 0) ===
        coverage.relationship_available
      : null,
    emotionFormation,
    recentStates: emotion
      ? distributionItems(
          emotion.state_distribution,
          coverage.emotion_available,
          EMOTION_STATE_LABELS,
          "其他状态",
        )
      : null,
    moods: emotion
      ? distributionItems(
          emotion.mood_distribution,
          coverage.emotion_available,
          {},
          "其他心境",
        )
      : null,
    relationshipScores: relationship ? relationshipScoreItems(relationship) : null,
    emotionScores: emotion ? emotionScoreItems(emotion) : null,
    partial: data.partial,
    diagnostic: buildMemoryDiagnostic(data),
  };
}

export function resolveMemoryAnalyticsError(error: unknown): MemoryAnalyticsErrorState {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 400:
        return {
          title: "Agent 参数异常",
          message: "当前 Agent 地址无效，请返回资产库重新选择。",
          retryable: false,
        };
      case 401:
        return {
          title: "登录状态已失效",
          message: "请重新登录后查看记忆服务状态。",
          retryable: false,
        };
      case 404:
        return {
          title: "Agent 不存在或无查看权限",
          message: "请确认 Agent 仍存在，并且属于当前创作者账号。",
          retryable: false,
        };
      case 503:
        return {
          title: "记忆分析服务暂未配置",
          message: "当前环境还不能提供匿名记忆分析，请稍后再试。",
          retryable: false,
        };
      default:
        break;
    }
  }

  return {
    title: "暂时无法获取记忆服务状态",
    message: "服务出现临时问题，请稍后重试。",
    retryable: true,
  };
}

export function shouldRetryMemoryAnalytics(
  failureCount: number,
  error: unknown,
): boolean {
  if (!(error instanceof ApiError)) return failureCount < 1;
  return error.status >= 500 && error.status !== 503 && failureCount < 1;
}

export function isStaleMemorySnapshot(
  hasSuccessfulData: boolean,
  error: unknown,
): boolean {
  return hasSuccessfulData && error !== null && error !== undefined;
}
