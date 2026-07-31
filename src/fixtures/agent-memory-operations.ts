import type { AgentMemoryAnalytics } from "@/modules/agent-memory-operations/types";

const DEMO_AGENT_MEMORY_ANALYTICS: Omit<AgentMemoryAnalytics, "agent_id"> = {
  coverage: {
    total_active_memories: 12,
    relationship_available: 11,
    relationship_unavailable: 1,
    emotion_available: 10,
    emotion_unavailable: 2,
  },
  relationship: {
    stage_distribution: {
      stranger: 1,
      acquaintance: 6,
      companion: 4,
    },
    average_affection: 0.47,
    average_trust: 0.23,
    average_familiarity: 1.54,
    milestone_count: 8,
    score_scales: {
      affection: { min: -1, max: 1 },
      trust: { min: -1, max: 1 },
      familiarity: { min: 0, max: 5 },
    },
  },
  emotion: {
    status_distribution: {
      ready: 9,
      empty: 1,
    },
    state_distribution: {
      normal: 7,
      happy: 2,
      tired: 1,
    },
    mood_distribution: {
      平稳: 7,
      积极: 2,
      低唤醒: 1,
    },
    mean_valence: 0.35,
    mean_arousal: 2.18,
    sample_count: 46,
    relationship_level: 0.52,
    recent_affection: 1.86,
    score_scales: {
      mean_valence: { min: -1, max: 1 },
      mean_arousal: { min: 0, max: 5 },
      relationship_level: { min: -1, max: 1 },
      recent_affection: { min: -5, max: 5 },
    },
  },
  partial: true,
};

export function demoAgentMemoryAnalytics(agentId: number): AgentMemoryAnalytics {
  if (agentId === 19) {
    return {
      agent_id: agentId,
      coverage: {
        total_active_memories: 0,
        relationship_available: 0,
        relationship_unavailable: 0,
        emotion_available: 0,
        emotion_unavailable: 0,
      },
      partial: false,
    };
  }

  return {
    ...DEMO_AGENT_MEMORY_ANALYTICS,
    agent_id: agentId,
  };
}
