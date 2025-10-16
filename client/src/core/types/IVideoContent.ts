export interface IVideoContent {
  id: number;
  title: string;
  description: string;
  video_url: string;
  video_id?: string;
  embed_url?: string;
  thumbnail_url?: string;
  is_active: boolean;
  order: number;
  created_at?: string;
  updated_at?: string;
}

export interface IVideoContentCreateRequest {
  title: string;
  description: string;
  video_url: string;
  is_active?: boolean;
  order?: number;
}

export interface IVideoContentUpdateRequest {
  title?: string;
  description?: string;
  video_url?: string;
  is_active?: boolean;
  order?: number;
}