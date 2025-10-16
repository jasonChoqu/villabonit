import axios from "@/core/config/axios";
import type { IApiResponse, IPaginationRequest } from "@/core/types/IApi";
import type {
  IPropertyCreateRequest,
  IPropertyUpdateRequest,
} from "@/core/types/IProperties";

export const getAllPaginated = async (
  params?: IPaginationRequest & {
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    type?: string;
    city?: string;
    status?: string;
    featured?: boolean;
    min_price?: number;
    max_price?: number;
    bedrooms?: number;
  },
  config: { signal?: AbortSignal } = {}
): Promise<{
  success: boolean;
  data: any[];
  meta?: { pagination: any };
}> => {
  const res = await axios.get("/v1/properties", { params, ...config });
  
  // La respuesta de Laravel viene con la estructura de paginación estándar
  const responseData = res.data;
  
  return {
    success: true,
    data: responseData.data || [],
    meta: {
      pagination: {
        total: responseData.total || 0,
        count: responseData.data?.length || 0,
        per_page: responseData.per_page || 15,
        current_page: responseData.current_page || 1,
        total_pages: responseData.last_page || 1,
      }
    }
  };
};

export const create = async (request: IPropertyCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post("/v1/properties", request);
  return res.data;
};

export const update = async (id: any, request: IPropertyUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/properties/${id}`, request);
  return res.data;
};

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/properties/${id}`);
  return res.data;
};

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/properties/${id}`);
  return response.data;
};

export const uploadImages = async (
  id: any, 
  formData: FormData
): Promise<IApiResponse> => {
  const response = await axios.post(`/v1/properties/${id}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 300000, // 5 minutos para archivos grandes
  });
  return response.data;
};

export const getPropertyImages = async (propertyId: any): Promise<IApiResponse> => {
  const response = await axios.get(`/v1/properties/${propertyId}/images`);
  return response.data;
};

export const deleteImage = async (propertyId: any, imageId: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/properties/${propertyId}/images/${imageId}`);
  return response.data;
};

export const setFeaturedImage = async (propertyId: any, imageId: any): Promise<IApiResponse> => {
  const response = await axios.put(`/v1/properties/${propertyId}/images/${imageId}/featured`);
  return response.data;
};

export const reorderImages = async (propertyId: any, imageOrders: Array<{image_id: number, sort_order: number}>): Promise<IApiResponse> => {
  const response = await axios.put(`/v1/properties/${propertyId}/images/reorder`, {
    image_orders: imageOrders
  });
  return response.data;
};

// Video management methods
export const getPropertyVideos = async (propertyId: any): Promise<IApiResponse> => {
  const response = await axios.get(`/v1/properties/${propertyId}/videos`);
  return response.data;
};

export const addVideo = async (
  propertyId: any, 
  videoData: {
    youtube_url: string;
    title?: string;
    description?: string;
    video_type?: string;
    sort_order?: number;
    is_featured?: boolean;
    allow_autoplay?: boolean;
    show_controls?: boolean;
    show_info?: boolean;
  }
): Promise<IApiResponse> => {
  const response = await axios.post(`/v1/properties/${propertyId}/videos`, videoData);
  return response.data;
};

export const updateVideo = async (
  propertyId: any,
  videoId: any,
  videoData: {
    youtube_url?: string;
    title?: string;
    description?: string;
    video_type?: string;
    sort_order?: number;
    is_featured?: boolean;
    is_active?: boolean;
    allow_autoplay?: boolean;
    show_controls?: boolean;
    show_info?: boolean;
  }
): Promise<IApiResponse> => {
  const response = await axios.put(`/v1/properties/${propertyId}/videos/${videoId}`, videoData);
  return response.data;
};

export const deleteVideo = async (propertyId: any, videoId: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/properties/${propertyId}/videos/${videoId}`);
  return response.data;
};

export const reorderVideos = async (
  propertyId: any, 
  videos: Array<{id: number, sort_order: number}>
): Promise<IApiResponse> => {
  const response = await axios.put(`/v1/properties/${propertyId}/videos/reorder`, { videos });
  return response.data;
};

export const PropertyService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
  uploadImages,
  getPropertyImages,
  deleteImage,
  setFeaturedImage,
  reorderImages,
  getPropertyVideos,
  addVideo,
  updateVideo,
  deleteVideo,
  reorderVideos,
};