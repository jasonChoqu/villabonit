export interface ITimeline {
  id: any;
  title: string;
  description: string;
  year: string;
  photo: string | null;
}

export interface ITimelineCreateRequest {
  title: string;
  description?: string | null;
  year: string;
  photo: File; // puede venir File, FileList, Blob, string (url), null, undefined
}

export interface ITimelineUpdateRequest {
  title?: string | null;
  description?: string | null;
  year?: string;
  photo?: File | null;
}
