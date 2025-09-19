// IBanner que recibes del backend (puede ser URL):
export interface IBanner {
  id: number;
  title: string;
  subtitle: string | null;
  image: string | null; // si tu API devuelve la URL, puedes renombrar a image_url
}

// Lo que ENVÍAS para crear (archivo requerido)
export interface IBannerCreateRequest {
  title: string;
  subtitle?: string | null;
  image: File; // <= FILE (no string)
}

// Lo que ENVÍAS para actualizar (archivo opcional)
export interface IBannerUpdateRequest {
  title?: string;
  subtitle?: string | null;
  image?: File | null; // <= opcional
}
