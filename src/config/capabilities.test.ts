import { describe, expect, it } from "vitest";
import { capabilitySource, DATA_MODE } from "./capabilities";

describe("capability registry", () => {
  it("defaults to live mode and blocks unsupported production writes", () => {
    expect(DATA_MODE).toBe("live");
    expect(capabilitySource("agentAssets")).toBe("live");
    expect(capabilitySource("assetCompleteness")).toBe("derived");
    expect(capabilitySource("clientAdapters")).toBe("live");
    expect(capabilitySource("versionHistory")).toBe("live");
    expect(capabilitySource("packageExport")).toBe("live");
    expect(capabilitySource("revenue")).toBe("unavailable");
    expect(capabilitySource("avatarUpload")).toBe("live");
    expect(capabilitySource("mediaAssetLibrary")).toBe("unavailable");
    expect(capabilitySource("guidedAgentCreation")).toBe("unavailable");
    expect(capabilitySource("guidedAgentCreation", "demo")).toBe("demo");
    expect(capabilitySource("comicDrafts", "demo")).toBe("demo");
  });
});
