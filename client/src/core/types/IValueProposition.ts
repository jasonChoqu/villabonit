export interface IValuePropositionResponse {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_id?: number | null;
}

export interface IValuePropositionRequest {
  title: string;
  description: string;
}