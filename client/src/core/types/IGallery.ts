export interface IGallery {
  id: any;
  description: string;
  description2: string | null;
  area: string;
  photo: string | null;
}

export interface IGalleryCreateRequest {
  description?: string | null;
  description2: string | null;
  area: string;
  photo: File; // puede venir File, FileList, Blob, string (url), null, undefined
}

export interface IGalleryUpdateRequest {
  description?: string | null;
  description2: string | null;
  area: string;
  photo?: File | null;
}
