export interface IAgreement {
    id: any;
    name: string;
    description: string;
    photo: string | null;
}

export interface IAgreementCreateRequest {
  name: string;
  description?: string | null;
  photo: File ;    // puede venir File, FileList, Blob, string (url), null, undefined
}

export interface IAgreementUpdateRequest {
  name?: string | null;
  description?: string | null;  
  photo?: File | null;  
}