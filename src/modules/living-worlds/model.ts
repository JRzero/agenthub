import type { WorldCondition, WorldContent, WorldEventCard, WorldEventCardDefinition, WorldLocation } from "./types";

export function locationReferences(content: WorldContent, code: string): string[] {
  const references: string[] = [];
  if (content.initial_event?.location_code === code) references.push(`初始事件“${content.initial_event.title || "未命名"}”`);
  for (const location of content.locations) {
    if (location.code !== code && location.connects_to.includes(code)) references.push(`地点“${location.name || location.code}”的连接`);
  }
  return references;
}

export function removeLocation(content: WorldContent, code: string): { content: WorldContent; blockedBy: string[] } {
  const blockedBy = locationReferences(content, code);
  if (blockedBy.length) return { content, blockedBy };
  return { content: { ...content, locations: content.locations.filter((location) => location.code !== code) }, blockedBy };
}

export function newLocation(index: number): WorldLocation {
  return { code: `location-${index}`, name: "", description: "", entry_rule: "", entry_conditions: [], common_events: [], connects_to: [] };
}

export function validEventCardDraft(card: WorldEventCardDefinition): boolean {
  return Boolean(card.event_code.trim() && card.title.trim() && card.location_code.trim() && card.observable_start.trim() && card.max_effect.trim());
}

export function eventCardTriggerSummary(trigger: WorldCondition[]): string {
  if (trigger.length === 0) return "无附加触发条件";
  return trigger.map((condition) => {
    const operand = condition.values?.join("、") ?? (condition.number !== undefined ? String(condition.number) : condition.boolean !== undefined ? String(condition.boolean) : "");
    return [condition.field, condition.operator, operand].filter(Boolean).join(" ");
  }).join("；");
}

export function eventCardDefinition(card: WorldEventCard | WorldEventCardDefinition): WorldEventCardDefinition {
  return {
    event_code: card.event_code,
    title: card.title,
    order_no: card.order_no,
    enabled: card.enabled,
    trigger: card.trigger,
    location_code: card.location_code,
    observable_start: card.observable_start,
    participant_codes: card.participant_codes,
    max_effect: card.max_effect,
  };
}

export function scheduleExpectedRevision(scheduleRevision: number | undefined, worldRevision: number): number {
  return scheduleRevision ?? worldRevision;
}
