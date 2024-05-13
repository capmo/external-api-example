export interface Project {
  id: string;
  name: string;
  owner: string;
  address: string;
  owner_organisation_id: string;
  latitude: number | null;
  longitude: number | null;
  project_volume: number | null;
  is_archived: boolean;
  project_key: string;
  start_date: string;
  end_date: string | null;
  source_id: string | null;
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  server_created_at: string;
  server_updated_at: string | null;
  server_deleted_at: string | null;
}

export interface FileInfo {
  name: string;
  path: string;
  mimeType: string;
}
