export interface ICertification {
  id: number;
  template_id: number;
  course_id: number;
  title: string;
  content?: string | null;
  issue_city: string;
  verification_code: string;
  qr_url?: string | null;
  pdf_file?: string | null;
  template?: ICertificationTemplate;
  course?: ICourse;
  created_at?: string;
  updated_at?: string;
}

export interface ICertificationCreateRequest {
  template_id: number;
  course_id: number;
  title: string;
  content?: string | null;
  issue_city: string;
  verification_code: string;
  qr_url?: string | null;
  pdf_file?: string | null;
}


export interface ICertificationUpdateRequest {
  template_id?: number;
  course_id?: number;
  title?: string;
  content?: string | null;
  issue_city?: string;
  verification_code?: string;
  qr_url?: string | null;
  pdf_file?: string | null;
}

// Related interfaces for relationships
export interface ICertificationTemplate {
  id: number;
  name: string;
  description?: string | null;
  blade_view?: string | null;
  preview_image?: string | null;
  background_image?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface ICertificationTemplateCreateRequest {
  name: string;
  description?: string | null;
  blade_view?: string | null;
  preview_image?: string | null;
  background_image?: string | null;
}

export interface ICertificationTemplateUpdateRequest {
  name?: string;
  description?: string | null;
  blade_view?: string | null;
  preview_image?: string | null;
  background_image?: string | null;
}

export interface ICourse {
  id: number;
  name: string;
  description?: string | null;
  created_at?: string;
  updated_at?: string;
}