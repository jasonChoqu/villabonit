// ---- RESPUESTA / RESOURCE ----
export interface IResourceBegin {
  id: number;
  url: string | null;
  text: string | null;
  logo_url: string | null;
  created_at?: string;
  updated_at?: string;
}

// ---- REQUESTS ----
export interface IResourceBeginCreateRequest {
  url: string | null;
  text: string | null;
  logo_url: string | null;
}

export interface IResourceBeginUpdateRequest {
  url?: string | null;
  text?: string | null;
  logo_url?: string | null;
}
