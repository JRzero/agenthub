import { describe, expect, it } from "vitest";
import { DEMO_SHARED_SESSIONS } from "./fixtures";
import { filterSessions, humanLabel, sessionLabel } from "./model";

describe("operations session model", () => {
  it("uses safe display labels", () => {
    expect(sessionLabel(DEMO_SHARED_SESSIONS[0])).toBe("职业信息更新");
    expect(humanLabel(DEMO_SHARED_SESSIONS[0])).toBe("用户 A7F2");
  });

  it("filters by query, agent and status", () => {
    expect(filterSessions(DEMO_SHARED_SESSIONS, "品牌", "", "all")).toHaveLength(1);
    expect(filterSessions(DEMO_SHARED_SESSIONS, "", 19, "active")).toHaveLength(1);
  });
});
