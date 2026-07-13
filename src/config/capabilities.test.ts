import { describe, expect, it } from "vitest";
import { capabilitySource, DATA_MODE } from "./capabilities";

describe("capability registry", () => {
  it("defaults to live mode and blocks unsupported production writes", () => {
    expect(DATA_MODE).toBe("live");
    expect(capabilitySource("agentAssets")).toBe("live");
    expect(capabilitySource("assetCompleteness")).toBe("derived");
    expect(capabilitySource("clientAdapters")).toBe("unavailable");
    expect(capabilitySource("revenue")).toBe("unavailable");
  });
});
