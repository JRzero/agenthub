export interface MemoryAnalyticsCoverage {
  total_active_memories: number;
  relationship_available: number;
  relationship_unavailable: number;
  emotion_available: number;
  emotion_unavailable: number;
}

export type MemoryScoreScales = Record<string, unknown>;

export interface MemoryRelationshipAnalytics {
  stage_distribution: Record<string, number>;
  average_affection: number | null;
  average_trust: number | null;
  average_familiarity: number | null;
  milestone_count: number;
  score_scales: MemoryScoreScales;
}

export interface MemoryEmotionAnalytics {
  status_distribution: Record<string, number>;
  state_distribution: Record<string, number>;
  mood_distribution: Record<string, number>;
  mean_valence: number | null;
  mean_arousal: number | null;
  sample_count: number;
  relationship_level: number | null;
  recent_affection: number | null;
  score_scales: MemoryScoreScales;
}

export interface AgentMemoryAnalytics {
  agent_id: number;
  coverage: MemoryAnalyticsCoverage;
  relationship?: MemoryRelationshipAnalytics;
  emotion?: MemoryEmotionAnalytics;
  partial: boolean;
}

export interface MemoryDistributionItem {
  key: string;
  label: string;
  count: number;
  share: number | null;
}

export interface MemoryScoreItem {
  key: string;
  label: string;
  value: number | null;
  scale: unknown;
}

export type MemoryDiagnosticTone = "complete" | "partial" | "accumulating" | "empty";

export interface MemoryDiagnostic {
  tone: MemoryDiagnosticTone;
  badge: string;
  summary: string;
  advice: string;
}

export interface AgentMemoryOperationsModel {
  agentId: number;
  totalMemories: number;
  relationshipAvailable: number;
  relationshipUnavailable: number;
  relationshipCoverage: number | null;
  emotionAvailable: number;
  emotionUnavailable: number;
  emotionCoverage: number | null;
  emotionSampleCount: number | null;
  relationshipStages: MemoryDistributionItem[] | null;
  relationshipStageCountsMatch: boolean | null;
  emotionFormation: MemoryDistributionItem[] | null;
  recentStates: MemoryDistributionItem[] | null;
  moods: MemoryDistributionItem[] | null;
  relationshipScores: MemoryScoreItem[] | null;
  emotionScores: MemoryScoreItem[] | null;
  partial: boolean;
  diagnostic: MemoryDiagnostic;
}

export interface MemoryAnalyticsErrorState {
  title: string;
  message: string;
  retryable: boolean;
}
