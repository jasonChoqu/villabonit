import axios from "@/core/config/axios";
import type { IApiResponse, IPaginationRequest } from "@/core/types/IApi";
import type { 
  IVideoContent, 
  IVideoContentCreateRequest, 
  IVideoContentUpdateRequest 
} from "@/core/types/IVideoContent";

/**
 * Obtener todos los videos con paginación
 */
export const getAllPaginated = async (
  params?: IPaginationRequest & {
    search?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    is_active?: boolean;
  },
  config: { signal?: AbortSignal } = {}
): Promise<{
  success: boolean;
  data: IVideoContent[];
  meta?: { pagination: any };
}> => {
  const res = await axios.get("/v1/video-content", { params, ...config });
  
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

/**
 * Obtener el video principal para mostrar en el componente VideoInHome
 */
export const getMainVideo = async (): Promise<{ success: boolean; data: IVideoContent }> => {
  const response = await axios.get('/v1/video-content/main');
  return response.data;
};

/**
 * Obtener todos los videos activos
 */
export const getAll = async (): Promise<{ success: boolean; data: IVideoContent[] }> => {
  const response = await axios.get('/v1/video-content');
  return response.data;
};

/**
 * Obtener un video específico por ID
 */
export const getById = async (id: number): Promise<{ success: boolean; data: IVideoContent }> => {
  const response = await axios.get(`/v1/video-content/${id}`);
  return response.data;
};

/**
 * Crear nuevo contenido de video (requiere autenticación)
 */
export const create = async (data: IVideoContentCreateRequest): Promise<IApiResponse> => {
  const response = await axios.post('/v1/video-content', data);
  return response.data;
};

/**
 * Actualizar contenido de video (requiere autenticación)
 */
export const update = async (id: number, data: IVideoContentUpdateRequest): Promise<IApiResponse> => {
  const response = await axios.put(`/v1/video-content/${id}`, data);
  return response.data;
};

/**
 * Eliminar contenido de video (requiere autenticación)
 */
export const remove = async (id: number): Promise<{ success: boolean; message: string }> => {
  const response = await axios.delete(`/v1/video-content/${id}`);
  return response.data;
};

export const VideoContentService = {
  getAllPaginated,
  getMainVideo,
  getAll,
  getById,
  create,
  update,
  remove,
};