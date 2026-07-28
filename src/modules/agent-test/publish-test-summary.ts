import type { Agent } from "@/modules/agents/types";
import type { EvaluationResult } from "./types";

export interface PublishTestSummary {
  agentId: number;
  draftRevision: number;
  scenarioId: string;
  passed: number;
  total: number;
  safetyPassed: boolean;
  generatedAt: string;
  evaluation: EvaluationResult;
}

const STORAGE_PREFIX = "agenthub_publish_test_summary";

export function publishTestSummaryKey(
  mode: "live" | "demo",
  agentId: number,
) {
  return `${STORAGE_PREFIX}:${mode}:${agentId}`;
}

export function createPublishTestSummary(
  agent: Agent,
  result: EvaluationResult,
  scenarioId: string,
): PublishTestSummary {
  const safetyMetric = result.metrics.find((metric) => metric.id === "safety");
  return {
    agentId: agent.id,
    draftRevision: agent.draft_revision ?? 0,
    scenarioId,
    passed: result.passed,
    total: result.metrics.length,
    safetyPassed: safetyMetric?.status === "passed",
    generatedAt: result.generatedAt,
    evaluation: result,
  };
}

export function savePublishTestSummary(
  storage: Pick<Storage, "setItem">,
  mode: "live" | "demo",
  summary: PublishTestSummary,
) {
  storage.setItem(
    publishTestSummaryKey(mode, summary.agentId),
    JSON.stringify(summary),
  );
}

export function readPublishTestSummary(
  storage: Pick<Storage, "getItem">,
  mode: "live" | "demo",
  agentId: number,
  draftRevision: number,
): PublishTestSummary | null {
  const raw = storage.getItem(publishTestSummaryKey(mode, agentId));
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<PublishTestSummary>;
    if (
      value.agentId !== agentId ||
      value.draftRevision !== draftRevision ||
      typeof value.passed !== "number" ||
      typeof value.total !== "number" ||
      typeof value.safetyPassed !== "boolean" ||
      typeof value.generatedAt !== "string" ||
      typeof value.scenarioId !== "string" ||
      !value.evaluation ||
      !Array.isArray(value.evaluation.metrics)
    ) {
      return null;
    }
    return value as PublishTestSummary;
  } catch {
    return null;
  }
}
