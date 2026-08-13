import type {
  CursorPage, DecisionResult, InvitationDetail, InvitableAgent, LaunchRequest, ParticipantBinding,
  PlatformPendingPage, PreflightResult, WorldActorProjection, WorldAgentOwnerBinding, WorldContent,
  WorldDetail, WorldEventCard, WorldEventCardDefinition, WorldInstance, WorldInvitation,
  WorldLimitedChange, WorldLimitedChangeDecision, WorldListItem, WorldOwnerReport, WorldPermissions,
  WorldRecapPage, WorldReviewSubmission, WorldRuntimeContract, WorldRuntimeFence, WorldSchedule,
  WorldTemplate, WorldView, WorldVisibilityView,
} from "./types";

type Shape = "string" | "number" | "boolean" | "nullable" | { readonly [key: string]: Shape } | readonly [Shape];

function project(value: unknown, shape: Shape): unknown {
  if (shape === "nullable") return value === null ? null : undefined;
  if (typeof shape === "string") return typeof value === shape ? value : undefined;
  if (Array.isArray(shape)) {
    if (value === undefined) return undefined;
    if (!Array.isArray(value)) return [];
    return value.map((item) => project(item, shape[0])).filter((item) => item !== undefined);
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const source = value as Record<string, unknown>;
  const output: Record<string, unknown> = {};
  for (const [key, childShape] of Object.entries(shape)) {
    const child = project(source[key], childShape);
    if (child !== undefined) output[key] = child;
  }
  return output;
}

const condition = { field: "string", operator: "string", values: ["string"], number: "number", boolean: "boolean" } as const;
const permissions = { ordinary_relationship: "boolean", intimate_relationship: "boolean", minor_injury: "boolean", long_term_memory: "boolean", appearance_adaptation: "boolean" } as const;
const content = {
  title: "string", summary: "string",
  core_idea: { inhabitants: "string", joy_sources: ["string"], long_term_tensions: ["string"] },
  hard_rules: ["string"], soft_rules: ["string"],
  structured_rules: [{ code: "string", kind: "string", description: "string", conditions: [condition] }],
  lore: { public_background: "string", hidden_truth: "string", tone: "string" },
  content_boundaries: ["string"],
  locations: [{ code: "string", name: "string", description: "string", entry_rule: "string", entry_conditions: [condition], common_events: ["string"], connects_to: ["string"] }],
  invite_slots: [{ code: "string", desired_role: "string", conflict_hooks: ["string"], active_goal: "string" }],
  initial_event: { code: "string", title: "string", location_code: "string", participant_codes: ["string"], observable_start: "string", max_effect: "string" },
  opening: { mode: "string", seed: "number", timezone: "string", daily_window: { start: "string", end: "string" }, key_change_policy: "string", review_time: "string" },
} as const;
const worldView = { world_code: "string", workspace_code: "string", status: "string", revision: "number", published_version_no: "number", content } as const;
const worldListItem = { world_code: "string", workspace_code: "string", status: "string", revision: "number", title: "string", updated_at: "string", active_residents: "number", total_residents: "number", role: "string" } as const;
const invitation = { invitation_code: "string", world_version_no: "number", agent_code: "string", version_no: "number", version_hash: "string", status: "string", public_identity: "string", permissions, revision: "number", created_at: "string", decided_at: "string" } as const;
const participant = { participant_code: "string", agent_code: "string", version_no: "number", version_hash: "string", public_identity: "string", permissions, status: "string", revision: "number" } as const;
const schedule = { schedule_code: "string", scheduled_start_at: "string", seed: "number", timezone: "string", daily_window: { start: "string", end: "string" }, review_time: "string", status: "string", blocked_reasons: ["string"], revision: "number" } as const;
const eventCardDefinition = { event_code: "string", title: "string", order_no: "number", enabled: "boolean", trigger: [condition], location_code: "string", observable_start: "string", participant_codes: ["string"], max_effect: "string" } as const;
const eventCard = { ...eventCardDefinition, revision: "number" } as const;
const runtimeFence = { instance_code: "string", run_epoch: "number", fencing_token: "number", state_revision: "number" } as const;
const resident = { participant_code: "string", agent_code: "string", public_identity: "string", status: "string" } as const;
const timelineItem = { event_code: "string", event_sequence: "number", event_type: "string", semantic_kind: "string", summary: "string", cause_summary: "string", affected_participant_codes: ["string"], location_code: "string", source_intervention_code: "string", created_at: "string" } as const;
const projectionCommon = { world_code: "string", status: "string", revision: "number", runtime_health: "string", timeline: [timelineItem], next_cursor: "string" } as const;
const creatorProjection = { ...projectionCommon, public_residents: [resident], creator_audit_summary: "string" } as const;
const operatorProjection = { ...projectionCommon, public_residents: [resident] } as const;
const agentOwnerProjection = { ...projectionCommon, owned_participant: resident } as const;
const recap = { status: "string", recap_code: "string", world_code: "string", world_version_no: "number", business_date: "string", revision: "number", is_current: "boolean", source_from_sequence: "number", source_to_sequence: "number", summary: "string", peaceful: "boolean", available_after: "string", public_failure_code: "string", key_decisions: ["string"], relationship_changes: ["string"], new_facts: ["string"], suspense: ["string"], source_event_codes: ["string"], created_at: "string" } as const;
const review = { submission_code: "string", world_code: "string", material_summary: "string", status: "string", revision: "number", created_at: "string" } as const;
const report = { report_code: "string", world_code: "string", category: "string", summary: "string", status: "string", revision: "number", created_at: "string" } as const;
const binding = { world_code: "string", participant_code: "string", public_identity: "string", status: "string", permissions, revision: "number" } as const;
const limitedCandidate = { candidate_code: "string", kind: "string", value: "string", reversible_days: "number" } as const;

export const UNKNOWN_PREFLIGHT_REASON = "unknown_requirement";
const stablePreflightReasons = new Set([
  "world_not_published", "published_version_missing", "published_content_invalid", "title_required",
  "summary_required", "hard_rule_required", "soft_rule_required", "content_boundaries_required",
  "locations_must_be_3_to_5", "location_codes_must_be_unique", "initial_event_required",
  "initial_event_location_invalid", "participants_must_be_3_to_4", "external_owner_must_be_at_most_one",
  "initial_event_requires_two_participants", "initial_event_participant_not_accepted",
]);

export function decodePreflight(value: unknown): PreflightResult {
  const decoded = project(value, { ready: "boolean", missing: ["string"] }) as { ready?: boolean; missing?: string[] };
  const missing = (decoded.missing ?? []).map((reason) => stablePreflightReasons.has(reason) ? reason : UNKNOWN_PREFLIGHT_REASON);
  return { ready: decoded.ready === true, missing: [...new Set(missing)] };
}

export function projectWorldContent(value: unknown): WorldContent {
  const projected = project(value, content) as WorldContent;
  if (value && typeof value === "object" && (value as { initial_event?: unknown }).initial_event === null) projected.initial_event = null;
  return projected;
}
export const projectWorldPermissions = (value: unknown) => project(value, permissions) as WorldPermissions;
export const projectEventCardDefinition = (value: unknown) => project(value, eventCardDefinition) as WorldEventCardDefinition;
export const serializeWorldContentForClipboard = (value: unknown) => JSON.stringify(projectWorldContent(value), null, 2);
export function projectionAudienceForRole(role: string): "creator" | "operator" | "agent-owner" {
  if (["owner", "world_owner", "creator"].includes(role)) return "creator";
  if (["agent_owner", "agent-owner"].includes(role)) return "agent-owner";
  return "operator";
}

const decode = <T>(value: unknown, shape: Shape) => project(value, shape) as T;
const page = <T>(value: unknown, itemShape: Shape) => decode<CursorPage<T>>(value, { items: [itemShape], next_cursor: "string" });
const decodeWorld = (value: unknown) => {
  const decoded = decode<WorldView>(value, worldView);
  if (decoded) decoded.content = projectWorldContent((value as { content?: unknown } | null)?.content);
  return decoded;
};
const decodeTemplate = (value: unknown) => {
  const decoded = decode<WorldTemplate>(value, { template_code: "string", version_no: "number", title: "string", summary: "string", content, published_at: "string" });
  if (decoded && value && typeof value === "object" && "content" in value) decoded.content = projectWorldContent((value as { content?: unknown }).content);
  return decoded;
};

export const worldDecoders = {
  list: (value: unknown) => page<WorldListItem>(value, worldListItem),
  detail: (value: unknown) => {
    const decoded = decode<WorldDetail>(value, { world: worldView, role: "string", published: { version_no: "number", timezone: "string", runtime_schema_version: "number", runtime_contract_hash: "string" }, preflight: { ready: "boolean", missing: ["string"] }, invitations: [invitation], participants: [participant], schedule });
    decoded.preflight = decodePreflight((value as { preflight?: unknown } | null)?.preflight);
    const rawContent = (value as { world?: { content?: unknown } } | null)?.world?.content;
    if (decoded.world) decoded.world.content = projectWorldContent(rawContent);
    return decoded;
  },
  world: decodeWorld,
  preflight: decodePreflight,
  instance: (value: unknown) => decode<WorldInstance>(value, { instance_code: "string", world_version_no: "number", runtime_schema_version: "number", runtime_contract_hash: "string", seed: "number", timezone: "string", status: "string", run_epoch: "number", fencing_token: "number", state_revision: "number", started_at: "string" }),
  templates: (value: unknown) => {
    const decoded = page<WorldTemplate>(value, { template_code: "string", version_no: "number", title: "string", summary: "string", content, published_at: "string" });
    decoded.items = decoded.items.map((item, index) => decodeTemplate((value as { items?: unknown[] }).items?.[index] ?? item));
    return decoded;
  },
  template: decodeTemplate,
  agents: (value: unknown) => page<InvitableAgent>(value, { agent_code: "string", name: "string", tagline: "string", version_no: "number", owner_scope: "string" }),
  invitations: (value: unknown) => page<WorldInvitation>(value, invitation),
  invitation: (value: unknown) => decode<WorldInvitation>(value, invitation),
  participants: (value: unknown) => page<ParticipantBinding>(value, participant),
  participant: (value: unknown) => decode<ParticipantBinding>(value, participant),
  invitationDetail: (value: unknown) => decode<InvitationDetail>(value, { world_code: "string", world_title: "string", world_summary: "string", world_owner: { username: "string", display_name: "string" }, invitation }),
  decision: (value: unknown) => decode<DecisionResult>(value, { invitation, participant }),
  schedule: (value: unknown) => decode<WorldSchedule>(value, schedule),
  launch: (value: unknown) => decode<LaunchRequest>(value, { request_code: "string", world_code: "string", source: "string", schedule_code: "string", world_version_no: "number", runtime_schema_version: "number", runtime_contract_hash: "string", seed: "number", status: "string", revision: "number" }),
  eventCards: (value: unknown) => decode<{ items: WorldEventCard[] }>(value, { items: [eventCard] }),
  eventCard: (value: unknown) => decode<WorldEventCard>(value, eventCard),
  runtimeContract: (value: unknown) => decode<WorldRuntimeContract>(value, {
    schema_version: "number", timezone: "string", actions: ["string"],
    budget: { call: { input_tokens: "number", output_tokens: "number", timeout_seconds: "number" }, tick: { llm_calls: "number", candidates: "number", commits: "number", input_tokens: "number", output_tokens: "number", timeout_seconds: "number" }, business_day: { model_attempts: "number", action_model_attempts: "number", reserved_rev1_attempts: "number", retries_count: "boolean", half_open_probes_count: "boolean", candidates: "number", commits: "number", ticks: "number", input_tokens: "number", output_tokens: "number", model_seconds: "number" }, concurrency: { platform_jobs: "number", platform_llm_calls: "number", candidate_generation: "number", commit_transactions: "number", per_world_jobs: "number" } },
    rest_policy: { successful_idle_ticks: "number", reason: "string", reset_requires_all: ["string"], excluded_ticks: ["string"] },
    retry_policy: { max_retries: "number", backoff_seconds: ["number"], breaker_failures: "number", breaker_open_seconds: ["number"], half_open_probes: "number", internal_exhausted_state: "string", public_rest_reason: "string" },
    review_policy: { business_day_timezone: "string", generate_at: "string", late_window_end: "string", max_revisions: "number" }, owner_choices: { max_candidates: "number", allowed: ["string"] },
  }),
  projection: (value: unknown, confirmedRole: string) => {
    const audience = projectionAudienceForRole(confirmedRole);
    const shape = audience === "creator" ? creatorProjection : audience === "agent-owner" ? agentOwnerProjection : operatorProjection;
    return { ...decode<WorldActorProjection>(value, shape), audience } as WorldActorProjection;
  },
  fence: (value: unknown) => decode<WorldRuntimeFence>(value, runtimeFence),
  recaps: (value: unknown) => decode<WorldRecapPage>(value, { items: [recap], latest_revision: "number" }),
  visibility: (value: unknown) => decode<WorldVisibilityView>(value, { world_code: "string", visibility: "string", revision: "number" }),
  reviews: (value: unknown) => decode<PlatformPendingPage<WorldReviewSubmission>>(value, { items: [review], platform_disposition: "string" }),
  review: (value: unknown) => decode<WorldReviewSubmission>(value, review),
  reports: (value: unknown) => decode<PlatformPendingPage<WorldOwnerReport>>(value, { items: [report], platform_disposition: "string" }),
  binding: (value: unknown) => decode<WorldAgentOwnerBinding>(value, binding),
  limitedChange: (value: unknown) => decode<WorldLimitedChange>(value, { change_code: "string", instance_code: "string", subject_participant_code: "string", kind: "string", status: "string", run_epoch: "number", fencing_token: "number", state_revision: "number", candidates: [limitedCandidate], selected_candidate_code: "string" }),
  limitedDecision: (value: unknown) => decode<WorldLimitedChangeDecision>(value, { decision_code: "string", change_code: "string", decision: "string", selected_candidate_code: "string", status: "string" }),
};
