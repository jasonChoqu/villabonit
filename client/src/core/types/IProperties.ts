export interface IProperty {
  id: number;
  title: string;
  slug: string;
  description?: string;
  property_type: PropertyType;
  status: PropertyStatus;
  price: number;
  currency: string;
  area_m2?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  lat?: number;
  lng?: number;
  built_year?: number;
  floor?: number;
  total_floors?: number;
  amenities?: string[];
  agent_name?: string;
  agent_phone?: string;
  agent_email?: string;
  listing_date: string;
  views_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  images?: IPropertyImage[];
  featured_image?: IPropertyImage;
}

export interface IPropertyImage {
  id: number;
  property_id: number;
  image_path: string;
  image_name?: string;
  alt_text?: string;
  description?: string;
  image_type: ImageType;
  sort_order: number;
  is_featured: boolean;
  mime_type?: string;
  file_size?: number;
  width?: number;
  height?: number;
  image_url: string;
  thumbnail_url: string;
  created_at: string;
  updated_at: string;
}

export type PropertyType =
  | 'house'
  | 'apartment'
  | 'penthouse'
  | 'townhouse'
  | 'duplex'
  | 'triplex'
  | 'studio'
  | 'loft'
  | 'villa'
  | 'bungalow'
  | 'cottage'
  | 'farmhouse'
  | 'condo'
  | 'cabins'
  | 'ranch'
  | 'chalet'
  | 'mansion'
  | 'retirement_home'
  | 'studio_apartment'
  | 'garden_house'
  | 'attic'
  | 'basement_flat'
  | 'mixed_use'
  | 'mobile_home'
  | 'tiny_house'
  | 'terreno'
  | 'other';

export type PropertyStatus = 'available' | 'sold' | 'reserved' | 'rented' | 'off_market';

export type ImageType =
  | 'main'
  | 'exterior'
  | 'interior'
  | 'kitchen'
  | 'bedroom'
  | 'bathroom'
  | 'living_room'
  | 'dining_room'
  | 'garage'
  | 'garden'
  | 'pool'
  | 'amenities'
  | 'floor_plan'
  | 'virtual_tour'
  | 'other';

export interface IPropertyCreateRequest {
  title: string;
  description?: string;
  property_type: PropertyType;
  status?: PropertyStatus;
  price: number;
  currency?: string;
  area_m2?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  lat?: number;
  lng?: number;
  built_year?: number;
  floor?: number;
  total_floors?: number;
  amenities?: string[];
  agent_name?: string;
  agent_phone?: string;
  agent_email?: string;
  is_featured?: boolean;
}

export interface IPropertyUpdateRequest extends Partial<IPropertyCreateRequest> {
  id?: number;
}

export interface IPropertyListResponse {
  data: IProperty[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface IPropertyResponse {
  success: boolean;
  data: IProperty;
  message: string;
}

export interface IPropertyListApiResponse {
  success: boolean;
  data: IPropertyListResponse;
  message: string;
}

// Constantes para opciones
export const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Departamento' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'townhouse', label: 'Casa Adosada' },
  { value: 'duplex', label: 'Dúplex' },
  { value: 'triplex', label: 'Tríplex' },
  { value: 'studio', label: 'Estudio' },
  { value: 'loft', label: 'Loft' },
  { value: 'villa', label: 'Villa' },
  { value: 'bungalow', label: 'Bungalow' },
  { value: 'cottage', label: 'Cabaña' },
  { value: 'farmhouse', label: 'Casa de Campo' },
  { value: 'condo', label: 'Condominio' },
  { value: 'cabins', label: 'Cabañas' },
  { value: 'ranch', label: 'Rancho' },
  { value: 'chalet', label: 'Chalet' },
  { value: 'mansion', label: 'Mansión' },
  { value: 'retirement_home', label: 'Casa de Retiro' },
  { value: 'studio_apartment', label: 'Estudio Apartamento' },
  { value: 'garden_house', label: 'Casa con Jardín' },
  { value: 'attic', label: 'Ático' },
  { value: 'basement_flat', label: 'Sótano' },
  { value: 'mixed_use', label: 'Uso Mixto' },
  { value: 'mobile_home', label: 'Casa Móvil' },
  { value: 'tiny_house', label: 'Casa Pequeña' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'other', label: 'Otro' },
];

export const PROPERTY_STATUS: { value: PropertyStatus; label: string }[] = [
  { value: 'available', label: 'Disponible' },
  { value: 'sold', label: 'Vendido' },
  { value: 'reserved', label: 'Reservado' },
  { value: 'rented', label: 'Alquilado' },
  { value: 'off_market', label: 'Fuera del Mercado' },
];

export const CURRENCIES = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'PEN', label: 'PEN (S/)' },
  { value: 'EUR', label: 'EUR (€)' },
];

export const AMENITIES_OPTIONS = [
  'piscina',
  'gimnasio',
  'seguridad_24h',
  'ascensor',
  'aire_acondicionado',
  'calefaccion',
  'terraza',
  'balcon',
  'jardin',
  'cochera',
  'lavanderia',
  'cuarto_servicio',
  'walk_in_closet',
  'jacuzzi',
  'sauna',
  'vista_mar',
  'vista_montaña',
  'cerca_metro',
  'cerca_colegios',
  'zona_comercial',
  'sistema_seguridad',
  'cocina_equipada',
  'domótica',
  'cocina_gourmet',
  'areas_comunes',
];