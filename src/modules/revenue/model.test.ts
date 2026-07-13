import { describe, expect, it } from "vitest";
import { netRevenue, sourceShare } from "./model";

describe("revenue model", () => {
  it("never reports a negative distributable amount", () => {
    expect(netRevenue(100, 120)).toBe(0);
    expect(netRevenue(24680, 7420)).toBe(17260);
  });

  it("formats a stable source share", () => {
    expect(sourceShare(14320, 24680)).toBe("58.0%");
    expect(sourceShare(1, 0)).toBe("0.0%");
  });
});
