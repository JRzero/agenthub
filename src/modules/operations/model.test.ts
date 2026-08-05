import { describe, expect, it } from "vitest";
import { DEMO_SHARED_SESSIONS } from "./fixtures";
import {
  filterSessions,
  humanLabel,
  OPERATIONS_TABS,
  operationsModuleLabel,
  resolveOperationsModule,
  sessionLabel,
} from "./model";

describe("operations session model", () => {
  it("uses safe display labels", () => {
    expect(sessionLabel(DEMO_SHARED_SESSIONS[0])).toBe("职业信息更新");
    expect(humanLabel(DEMO_SHARED_SESSIONS[0])).toBe("用户 A7F2");
  });

  it("filters by query, agent and status", () => {
    expect(filterSessions(DEMO_SHARED_SESSIONS, "品牌", "", "all")).toHaveLength(1);
    expect(filterSessions(DEMO_SHARED_SESSIONS, "", 19, "active")).toHaveLength(1);
  });

  it("only exposes session and moment capabilities that are currently supported", () => {
    expect(OPERATIONS_TABS.map(([id]) => id)).toEqual([
      "sessions",
      "moments",
    ]);
    expect(resolveOperationsModule("feedback")).toBe("sessions");
    expect(resolveOperationsModule("binding")).toBe("sessions");
    expect(operationsModuleLabel("moments")).toBe("朋友圈管理");
  });

  it("does not expose an internal session id as the fallback label", () => {
    const row = {
      ...DEMO_SHARED_SESSIONS[0],
      session: { ...DEMO_SHARED_SESSIONS[0].session, title: "" },
    };
    expect(sessionLabel(row)).toBe(`${row.agent.name} 的会话`);
    expect(sessionLabel(row)).not.toContain(String(row.session.id));
  });
});
