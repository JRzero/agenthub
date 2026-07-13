import { describe, expect, it } from "vitest";
import { GOVERNANCE_RISKS } from "./fixtures";
import { riskLevelLabel, sortGovernanceRisks, unresolvedRiskCount } from "./model";

describe("governance model", () => {
  it("puts the highest risk first", () => {
    expect(sortGovernanceRisks(GOVERNANCE_RISKS)[0].level).toBe("high");
  });

  it("counts only unresolved risks", () => {
    expect(unresolvedRiskCount(GOVERNANCE_RISKS)).toBe(2);
    expect(riskLevelLabel("medium")).toBe("中风险");
  });
});
