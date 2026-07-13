export interface CreatorMetadata {
  full_name?: string;
  description?: string;
  organization?: string;
  website?: string;
  avatar?: string;
}

export interface CreatorProfile {
  id: number;
  uuid: string;
  username: string;
  email: string;
  status: string;
  metadata?: CreatorMetadata;
}

export interface ProfileInput {
  username?: string;
  full_name?: string;
  description?: string;
}
