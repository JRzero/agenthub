import { describe, expect, it } from "vitest";
import { createEmptyWorldContent } from "./types";
import { eventCardDefinition, eventCardTriggerSummary, locationReferences, removeLocation, scheduleExpectedRevision, validEventCardDraft } from "./model";
import { createOperationKey, reconcileInvitationDecisionDraft, resourceLoadState } from "./state";

describe("Living World correction helpers", () => {
  it("projects an event-card view into a strict writable definition", () => {
    const definition = eventCardDefinition({ event_code: "event-1", title: "停电", order_no: 1, enabled: true, trigger: [], location_code: "basement", observable_start: "灯光熄灭", participant_codes: [], max_effect: "十分钟", revision: 9 });
    expect(definition).not.toHaveProperty("revision");
    expect(definition).toMatchObject({ event_code: "event-1", max_effect: "十分钟" });
  });
  it("H-F01 blocks deleting referenced locations", () => {
    const content = createEmptyWorldContent();
    content.locations = [
      { code: "lobby", name: "大厅", description: "", entry_rule: "", entry_conditions: [], common_events: [], connects_to: ["basement"] },
      { code: "basement", name: "地下室", description: "", entry_rule: "", entry_conditions: [], common_events: [], connects_to: [] },
    ];
    content.initial_event = { code: "opening", title: "镜子失去倒影", location_code: "basement", participant_codes: [], observable_start: "灯灭了", max_effect: "一层停电" };
    expect(locationReferences(content, "basement")).toEqual(["初始事件“镜子失去倒影”", "地点“大厅”的连接"]);
    expect(removeLocation(content, "basement").content.locations).toHaveLength(2);
  });

  it("H-F03 uses World revision for first schedule and schedule revision thereafter", () => {
    expect(scheduleExpectedRevision(undefined, 7)).toBe(7);
    expect(scheduleExpectedRevision(3, 7)).toBe(3);
  });

  it("H-F04 rejects incomplete event-card drafts", () => {
    const base = { event_code: "event-1", title: "停电", order_no: 1, enabled: true, trigger: [], location_code: "lobby", observable_start: "", participant_codes: [], max_effect: "十分钟" };
    expect(validEventCardDraft(base)).toBe(false);
    expect(validEventCardDraft({ ...base, observable_start: "灯光熄灭" })).toBe(true);
    expect(eventCardTriggerSummary([])).toBe("无附加触发条件");
    expect(eventCardTriggerSummary([{ field: "budget.remaining", operator: "lte", number: 3 }])).toBe("budget.remaining lte 3");
  });

  it("C-04 preserves a stale tab draft while adopting the latest revision", () => {
    const permissions = { ordinary_relationship: true, intimate_relationship: false, minor_injury: false, long_term_memory: false, appearance_adaptation: false };
    expect(reconcileInvitationDecisionDraft({ publicIdentity: "页签 B 草稿", permissions, revision: 1 }, { invitation_code: "inv-1", world_version_no: 1, agent_code: "agent", version_no: 1, version_hash: "hash", status: "pending", public_identity: "页签 A 已保存", permissions, revision: 2, created_at: "2026-08-01T00:00:00Z" })).toEqual({ publicIdentity: "页签 B 草稿", permissions, revision: 2 });
  });

  it("H-F05 renders errors before missing-data loading", () => {
    expect(resourceLoadState({ isError: true, isLoading: false, hasData: false })).toBe("error");
  });

  it("H-F06 retains an operation key until confirmed success", () => {
    let sequence = 0;
    const operation = createOperationKey("launch", (prefix) => `${prefix}-${++sequence}`);
    expect(operation.current()).toBe("launch-1");
    expect(operation.current()).toBe("launch-1");
    operation.reset();
    expect(operation.current()).toBe("launch-2");
  });
});
