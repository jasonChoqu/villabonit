import axios from '@/core/config/axios';
import type { IApiResponse } from '@/core/types/IApi';
import type { IProjectCreateRequest, IProjectUpdateRequest } from '@/core/types/IProject';

export interface ProjectPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  [key: string]: any;
}

/**
 * Obtener todos los proyectos con paginación
 */
export const getAllPaginated = async (params: ProjectPaginationParams = {}): Promise<{
  success: boolean;
  data: any[];
  meta?: { pagination: any };
}> => {
  const res = await axios.get('/v1/projects', { params });
  console.log('API Response:', res.data);
  
  // Transformar la respuesta para que sea compatible con useResource
  return {
    success: true,
    data: res.data.data || [],
    meta: {
      pagination: res.data.pagination || res.data.meta?.pagination || {}
    }
  };
};

/**
 * Obtener todos los proyectos sin paginación
 */
export const getAll = async (): Promise<IApiResponse> => {
  const res = await axios.get('/v1/projects/all');
  return res.data;
};

/**
 * Obtener un proyecto por ID
 */
export const get = async (id: number): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/projects/${id}`);
  return res.data;
};

/**
 * Convertir base64 string a File object
 */
const base64ToFile = (base64String: string, filename: string = 'image.png'): File => {
  const arr = base64String.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new File([u8arr], filename, { type: mime });
};

/**
 * Crear un nuevo proyecto
 */
export const create = async (data: IProjectCreateRequest): Promise<IApiResponse> => {
  console.log('Datos recibidos en create service:', data);
  
  const formData = new FormData();
  
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('features', data.features);
  
  if (data.image) {
    if (typeof data.image === 'string' && data.image.startsWith('data:')) {
      // Convertir base64 a File
      const file = base64ToFile(data.image, 'project-image.png');
      console.log('Convertido base64 a File:', file);
      formData.append('image', file);
    } else if (typeof File !== "undefined" && data.image instanceof File) {
      console.log('Agregando File al FormData:', data.image);
      formData.append('image', data.image);
    } else {
      console.log('Tipo de imagen no reconocido:', typeof data.image, data.image);
    }
  } else {
    console.log('No hay imagen');
  }

  // Debug: mostrar contenido del FormData
  console.log('Contenido del FormData:');
  for (let [key, value] of formData.entries()) {
    console.log(key, value);
  }

  const res = await axios.post('/v1/projects', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

/**
 * Actualizar un proyecto
 */
export const update = async (id: number, data: IProjectUpdateRequest): Promise<IApiResponse> => {
  console.log('Datos recibidos en update service:', data);
  
  const formData = new FormData();
  
  if (data.title) formData.append('title', data.title);
  if (data.description) formData.append('description', data.description);
  if (data.features) formData.append('features', data.features);
  
  if (data.image) {
    if (typeof data.image === 'string' && data.image.startsWith('data:')) {
      // Convertir base64 a File
      const file = base64ToFile(data.image, 'project-image.png');
      console.log('Convertido base64 a File en update:', file);
      formData.append('image', file);
    } else if (typeof File !== "undefined" && data.image instanceof File) {
      console.log('Agregando File al FormData en update:', data.image);
      formData.append('image', data.image);
    }
  }

  // método seguro para multipart
  formData.append('_method', 'PUT');

  const res = await axios.post(`/v1/projects/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

/**
 * Eliminar un proyecto
 */
export const remove = async (id: number): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/projects/${id}`);
  return response.data;
};

/**
 * Buscar proyectos
 */
export const search = async (query: string, params: Omit<ProjectPaginationParams, 'search'> = {}): Promise<IApiResponse> => {
  return getAllPaginated({ ...params, search: query });
};

export const ProjectService = {
  getAllPaginated,
  getAll,
  get,
  create,
  update,
  remove,
  search,
};