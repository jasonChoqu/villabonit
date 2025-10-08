export interface IProject {
  id: number;
  title: string;
  description: string;
  features: string;
  image_path?: string | null;
  image_url?: string | null;
  created_at: string;
  updated_at: string;
}

export interface IProjectResponse extends IProject {}

export interface IProjectCreateRequest {
  title: string;
  description: string;
  features: string;
  image?: File | string; // Puede ser File o base64 string
}

export interface IProjectUpdateRequest {
  title?: string;
  description?: string;
  features?: string;
  image?: File | string | null; // Puede ser File, base64 string o null
}

export interface IProjectRequest {
  title: string;
  description: string;
  features: string;
  image_path?: string;
}