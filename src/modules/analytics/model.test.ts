import { describe, expect, it } from "vitest";
import { formatMetric, metricSummary } from "./model";

describe("analytics model", () => {
  it("formats percentages and counts without inventing units", () => {
    expect(formatMetric("retention", 38.6)).toBe("38.6%");
    expect(formatMetric("users", 18642)).toBe("18,642");
  });

  it("derives the visible change from the fixture series", () => {
    expect(metricSummary("users").current).toBe(9900);
    expect(metricSummary("users").change).toBeGreaterThan(0);
  });
});
