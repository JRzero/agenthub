import { describe, expect, it } from "vitest";
import { DEMO_AGENTS } from "@/fixtures/demo-data";
import { ASSET_VIEW_STORAGE_KEY, assetHref, filterAndSortAgents, readAssetView, writeAssetView } from "./library-model";

describe("asset library model", () => {
  it("defaults to cards and remembers the selected view", () => {
    const values = new Map<string, string>();
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) };
    expect(readAssetView(storage)).toBe("card");
    writeAssetView(storage, "list");
    expect(values.get(ASSET_VIEW_STORAGE_KEY)).toBe("list");
    expect(readAssetView(storage)).toBe("list");
  });

  it("searches, filters, and sorts without mutating input", () => {
    const original = [...DEMO_AGENTS];
    const result = filterAndSortAgents(DEMO_AGENTS, { search: "知识", status: "all", sort: "name-asc" });
    expect(result.map((agent) => agent.name)).toEqual(["知识向导"]);
    expect(DEMO_AGENTS).toEqual(original);
    expect(filterAndSortAgents(DEMO_AGENTS, { search: "", status: "active", sort: "updated-desc" }).every((agent) => agent.status === "active")).toBe(true);
  });

  it("keeps incomplete creation on the existing guided flow", () => {
    expect(assetHref({ ...DEMO_AGENTS[0], id: 88, creation_completed: false })).toBe("/assets/create?agentId=88");
    expect(assetHref(DEMO_AGENTS[0])).toBe(`/assets/${DEMO_AGENTS[0].id}/overview`);
  });
});
