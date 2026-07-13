export type VersionStatus = "current" | "published" | "archived" | "draft";

export interface VersionSnapshot {
  id: string;
  version: number;
  label: string;
  status: VersionStatus;
  createdAt: string;
  createdBy: string;
  summary: string;
  snapshot: {
    description: string;
    model: string;
    prompt: string;
    temperature: number;
    memoryEnabled: boolean;
    knowledgeBaseId: number | null;
    skills: string[];
  };
}

export interface VersionDifference {
  field: string;
  label: string;
  before: string;
  after: string;
  changed: boolean;
}
