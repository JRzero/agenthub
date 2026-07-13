import type { GovernanceRisk, RiskLevel } from "./fixtures";

const priority: Record<RiskLevel, number> = { high: 0, medium: 1, low: 2 };

export function sortGovernanceRisks(risks: GovernanceRisk[]): GovernanceRisk[] {
  return [...risks].sort((left, right) => priority[left.level] - priority[right.level] || right.updatedAt.localeCompare(left.updatedAt));
}

export function riskLevelLabel(level: RiskLevel): string {
  return { high: "高风险", medium: "中风险", low: "低风险" }[level];
}

export function unresolvedRiskCount(risks: GovernanceRisk[]): number {
  return risks.filter((risk) => risk.status !== "resolved").length;
}
