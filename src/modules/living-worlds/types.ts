export type WorldStatus = "draft" | "published" | "running" | "paused" | "blocked" | "takedown" | "archived";
export type InvitationStatus = "pending" | "withdrawn" | "accepted" | "rejected";

export interface WorldPermissions {
  ordinary_relationship: boolean;
  intimate_relationship: boolean;
  minor_injury: boolean;
  long_term_memory: boolean;
  appearance_adaptation: boolean;
}

export interface WorldCondition { field: string; operator: string; values?: string[]; number?: number; boolean?: boolean }
export interface WorldStructuredRule { code: string; kind: string; description: string; conditions: WorldCondition[] }
export interface WorldLocation { code: string; name: string; description: string; entry_rule: string; entry_conditions: WorldCondition[]; common_events: string[]; connects_to: string[] }
export interface WorldInviteSlot { code: string; desired_role: string; conflict_hooks: string[]; active_goal: string }
export interface WorldInitialEvent { code: string; title: string; location_code: string; participant_codes: string[]; observable_start: string; max_effect: string }
export interface WorldContent {
  title: string;
  summary: string;
  core_idea: { inhabitants: string; joy_sources: string[]; long_term_tensions: string[] };
  hard_rules: string[];
  soft_rules: string[];
  structured_rules: WorldStructuredRule[];
  lore: { public_background: string; hidden_truth: string; tone: string };
  content_boundaries: string[];
  locations: WorldLocation[];
  invite_slots: WorldInviteSlot[];
  initial_event: WorldInitialEvent | null;
  opening: { mode: "immediate" | "scheduled"; seed: number; timezone: "Asia/Shanghai"; daily_window: { start: string; end: string }; key_change_policy: string; review_time: string };
}

export interface WorldView { world_code: string; workspace_code?: string; status: WorldStatus; revision: number; published_version_no?: number; content: WorldContent }
export interface WorldListItem { world_code: string; workspace_code: string; status: WorldStatus; revision: number; title: string; updated_at: string; active_residents: number; total_residents: number; role: string }
export interface CursorPage<T> { items: T[]; next_cursor?: string }
export interface WorldInvitation { invitation_code: string; world_version_no: number; agent_code: string; version_no: number; version_hash: string; status: InvitationStatus; public_identity: string; permissions: WorldPermissions; revision: number; created_at: string; decided_at?: string }
export interface ParticipantBinding { participant_code: string; agent_code: string; version_no: number; version_hash: string; public_identity: string; permissions: WorldPermissions; status: "active" | "recalled"; revision: number }
export interface PreflightResult { ready: boolean; missing: string[] }
export interface WorldSchedule { schedule_code: string; scheduled_start_at: string; seed: number; timezone: "Asia/Shanghai"; daily_window: { start: string; end: string }; review_time: string; status: string; blocked_reasons: string[]; revision: number }
export interface WorldDetail { world: WorldView; role: string; published?: { version_no: number; timezone: string; runtime_schema_version: number; runtime_contract_hash: string }; preflight: PreflightResult; invitations?: WorldInvitation[]; participants: ParticipantBinding[]; schedule?: WorldSchedule }
export interface WorldTemplate { template_code: string; version_no: number; title: string; summary: string; content?: WorldContent; published_at: string }
export interface InvitableAgent { agent_code: string; name: string; tagline: string; version_no: number; owner_scope: string }
export interface InvitationDetail { world_code: string; world_title: string; world_summary: string; world_owner: { username: string; display_name?: string }; invitation: WorldInvitation }
export interface DecisionResult { invitation: WorldInvitation; participant?: ParticipantBinding }
export interface WorldEventCardDefinition { event_code: string; title: string; order_no: number; enabled: boolean; trigger: WorldCondition[]; location_code: string; observable_start: string; participant_codes: string[]; max_effect: string }
export interface WorldEventCard extends WorldEventCardDefinition { revision: number }
export interface LaunchRequest { request_code: string; world_code: string; source: "manual" | "schedule"; schedule_code?: string; world_version_no: number; runtime_schema_version: number; runtime_contract_hash: string; seed: number; status: string; revision: number }
export interface WorldInstance { instance_code: string; world_version_no: number; runtime_schema_version: number; runtime_contract_hash: string; seed: number; timezone: string; status: string; run_epoch: number; fencing_token: number; state_revision: number; started_at: string }

export interface WorldRuntimeFence { instance_code: string; run_epoch: number; fencing_token: number; state_revision: number }
export interface WorldProjectionResident { participant_code: string; agent_code: string; public_identity: string; status: "active" }
export interface WorldTimelineItem { event_code: string; event_sequence: number; event_type: string; semantic_kind: "fact" | "rumor" | "statement"; summary: string; cause_summary: string; affected_participant_codes: string[]; location_code?: string; source_intervention_code?: string; created_at: string }
export interface WorldCreatorProjection { world_code: string; status: string; revision: number; runtime_health: string; public_residents: WorldProjectionResident[]; timeline: WorldTimelineItem[]; creator_audit_summary?: string; next_cursor?: string }
export type WorldOperatorProjection = Omit<WorldCreatorProjection, "creator_audit_summary">;
export interface WorldAgentOwnerProjection { world_code: string; status: string; revision: number; owned_participant: WorldProjectionResident; timeline: WorldTimelineItem[]; next_cursor?: string }
export type WorldActorProjection = WorldCreatorProjection | WorldOperatorProjection | WorldAgentOwnerProjection;
export interface WorldRuntimeContract { schema_version: number; timezone: "Asia/Shanghai"; actions: string[]; budget: { call: { input_tokens: number; output_tokens: number; timeout_seconds: number }; tick: { llm_calls: number; candidates: number; commits: number; input_tokens: number; output_tokens: number; timeout_seconds: number }; business_day: { model_attempts: number; action_model_attempts: number; reserved_rev1_attempts: number; retries_count: boolean; half_open_probes_count: boolean; candidates: number; commits: number; ticks: number; input_tokens: number; output_tokens: number; model_seconds: number }; concurrency: { platform_jobs: number; platform_llm_calls: number; candidate_generation: number; commit_transactions: number; per_world_jobs: number } }; rest_policy: { successful_idle_ticks: number; reason: string; reset_requires_all: string[]; excluded_ticks: string[] }; retry_policy: { max_retries: number; backoff_seconds: number[]; breaker_failures: number; breaker_open_seconds: number[]; half_open_probes: number; internal_exhausted_state: string; public_rest_reason: string }; review_policy: { business_day_timezone: string; generate_at: string; late_window_end: string; max_revisions: number }; owner_choices: { max_candidates: number; allowed: string[] } }
export interface WorldRecap { status: "pending" | "ready" | "failed"; recap_code?: string; world_code: string; world_version_no?: number; business_date: string; revision: 0 | 1 | 2; is_current: boolean; source_from_sequence?: number; source_to_sequence?: number; summary?: string; peaceful: boolean; available_after?: string; public_failure_code?: "WORLD_RECAP_UNAVAILABLE"; key_decisions: string[]; relationship_changes: string[]; new_facts: string[]; suspense: string[]; source_event_codes: string[]; created_at?: string }
export interface WorldRecapPage { items: WorldRecap[]; latest_revision?: 1 | 2 }
export type WorldVisibility = "listed" | "unlisted" | "hidden";
export interface WorldVisibilityView { world_code: string; visibility: WorldVisibility; revision: number }
export interface WorldReviewSubmission { submission_code: string; world_code: string; material_summary: string; status: "pending_platform_capability" | "withdrawn"; revision: number; created_at: string }
export interface WorldOwnerReport { report_code: string; world_code: string; category: "safety" | "privacy" | "abuse" | "other"; summary: string; status: "submitted" | "withdrawn"; revision: number; created_at: string }
export interface PlatformPendingPage<T> { items: T[]; platform_disposition: "unavailable" }
export interface WorldAgentOwnerBinding { world_code: string; participant_code: string; public_identity: string; status: "active" | "recalled" | "revoked"; permissions: WorldPermissions; revision: number }
export interface WorldLimitedChangeCandidate { candidate_code: string; kind: string; value: string; reversible_days: number }
export interface WorldLimitedChange { change_code: string; instance_code: string; subject_participant_code: string; kind: string; status: "pending" | "confirmed" | "rejected" | "expired"; run_epoch: number; fencing_token: number; state_revision: number; candidates: WorldLimitedChangeCandidate[]; selected_candidate_code?: string }
export interface WorldLimitedChangeDecision { decision_code: string; change_code: string; decision: "approve" | "reject" | "choice"; selected_candidate_code?: string; status: string }

export const EMPTY_PERMISSIONS: WorldPermissions = { ordinary_relationship: false, intimate_relationship: false, minor_injury: false, long_term_memory: false, appearance_adaptation: false };
export function createEmptyWorldContent(): WorldContent {
  return { title: "", summary: "", core_idea: { inhabitants: "", joy_sources: [], long_term_tensions: [] }, hard_rules: [], soft_rules: [], structured_rules: [], lore: { public_background: "", hidden_truth: "", tone: "" }, content_boundaries: [], locations: [], invite_slots: [], initial_event: null, opening: { mode: "immediate", seed: 42, timezone: "Asia/Shanghai", daily_window: { start: "09:00", end: "23:00" }, key_change_policy: "owner_confirmation", review_time: "08:00" } };
}
