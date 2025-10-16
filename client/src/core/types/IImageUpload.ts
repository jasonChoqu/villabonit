export interface ImageMetadata {
  type: string;
  altText: string;
  description: string;
}

export interface ImageUploadFormData {
  images: File[];
  metadata: ImageMetadata[];
  featuredIndex?: number;
}

export const IMAGE_TYPES = [
  { value: 'main', label: 'Principal' },
  { value: 'exterior', label: 'Exterior' },
  { value: 'interior', label: 'Interior' },
  { value: 'kitchen', label: 'Cocina' },
  { value: 'bedroom', label: 'Dormitorio' },
  { value: 'bathroom', label: 'Baño' },
  { value: 'living_room', label: 'Sala' },
  { value: 'dining_room', label: 'Comedor' },
  { value: 'garage', label: 'Garaje' },
  { value: 'garden', label: 'Jardín' },
  { value: 'pool', label: 'Piscina' },
  { value: 'amenities', label: 'Amenidades' },
  { value: 'floor_plan', label: 'Plano' },
  { value: 'virtual_tour', label: 'Tour Virtual' },
  { value: 'other', label: 'Otro' },
] as const;

export type ImageType = typeof IMAGE_TYPES[number]['value'];