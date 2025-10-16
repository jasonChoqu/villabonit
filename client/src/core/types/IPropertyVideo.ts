export interface IPropertyVideo {
  id: number;
  property_id: number;
  youtube_url: string;
  youtube_video_id: string;
  title?: string;
  description?: string;
  video_type: VideoType;
  sort_order: number;
  thumbnail_url?: string;
  duration_seconds?: number;
  is_featured: boolean;
  is_active: boolean;
  allow_autoplay: boolean;
  show_controls: boolean;
  show_info: boolean;
  embed_url?: string;
  youtube_thumbnail?: string;
  created_at: string;
  updated_at: string;
}

export type VideoType = 
  | 'tour_virtual'
  | 'exterior' 
  | 'interior'
  | 'neighborhood'
  | 'amenities'
  | 'promotional'
  | 'construction'
  | 'testimonial'
  | 'other';

export interface VideoMetadata {
  title: string;
  description: string;
  video_type: VideoType;
  allow_autoplay: boolean;
  show_controls: boolean;
  show_info: boolean;
}

export const VIDEO_TYPES = [
  { value: 'tour_virtual', label: 'Tour Virtual' },
  { value: 'exterior', label: 'Exterior' },
  { value: 'interior', label: 'Interior' },
  { value: 'neighborhood', label: 'Vecindario' },
  { value: 'amenities', label: 'Amenidades' },
  { value: 'promotional', label: 'Promocional' },
  { value: 'construction', label: 'Construcción' },
  { value: 'testimonial', label: 'Testimonio' },
  { value: 'other', label: 'Otro' },
] as const;

export const validateYouTubeUrl = (url: string): boolean => {
  const pattern = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  return pattern.test(url);
};

export const extractVideoId = (url: string): string | null => {
  const pattern = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const matches = url.match(pattern);
  return matches ? matches[1] : null;
};