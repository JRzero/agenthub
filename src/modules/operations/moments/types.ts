export interface MomentComment {
  id: number;
  creator_id?: number;
  creator_name: string;
  content: string;
  created_at?: string;
}

export interface MomentItem {
  id: number;
  agent_id: number;
  agent_name: string;
  agent_avatar?: string;
  content: string;
  image_urls: string[];
  thumbnail_urls: string[];
  video_urls: string[];
  created_at: string;
  like_count?: number;
  favorite_count?: number;
  comment_count?: number;
  comments?: MomentComment[];
}

export interface MomentPage {
  moments: MomentItem[];
  total: number | null;
  limit: number;
  offset: number;
}

export interface MomentQuery {
  agentId?: number | null;
  limit?: number;
  offset?: number;
}

export interface MomentUpload {
  token: string;
  url_800: string;
  url_240: string;
}

export interface CreateMomentInput {
  content: string;
  image_tokens?: string[];
  video_urls?: string[];
  auto_image?: boolean;
}

export interface MomentAuth {
  apiKey: string;
  workspaceCode?: string;
}
