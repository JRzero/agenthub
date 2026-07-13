export interface Workspace {
  id: number;
  uuid: string;
  name: string;
  code: string;
  role: string;
  status: string;
  creator_id?: number;
  created_at?: string;
  updated_at?: string;
}
