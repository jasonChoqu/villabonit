import axios from '@/core/config/axios';
import type { IApiResponse } from '@/core/types/IApi';
import type { IValuePropositionRequest } from '@/core/types/IValueProposition';

export interface ValuePropositionPaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  [key: string]: any;
}

/**
 * Obtener todas las propuestas de valor con paginación
 */
export const getAllPaginated = async (params: ValuePropositionPaginationParams = {}): Promise<{
  success: boolean;
  data: any[];
  meta?: { pagination: any };
}> => {
  const res = await axios.get('/v1/value_propositions', { params });
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
 * Obtener todas las propuestas de valor sin paginación
 */
export const getAll = async (): Promise<IApiResponse> => {
  const res = await axios.get('/v1/value_propositions/all');
  return res.data;
};

/**
 * Obtener una propuesta de valor por ID
 */
export const get = async (id: number): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/value_propositions/${id}`);
  return res.data;
};

/**
 * Crear una nueva propuesta de valor
 */
export const store = async (data: IValuePropositionRequest): Promise<IApiResponse> => {
  const res = await axios.post('/v1/value_propositions', data);
  return res.data;
};

/**
 * Actualizar una propuesta de valor
 */
export const update = async (id: number, data: IValuePropositionRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/value_propositions/${id}`, data);
  return res.data;
};

/**
 * Eliminar una propuesta de valor
 */
export const remove = async (id: number): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/value_propositions/${id}`);
  return response.data;
};

/**
 * Restaurar una propuesta de valor
 */
export const restore = async (id: number): Promise<IApiResponse> => {
  const response = await axios.put(`/v1/value_propositions/${id}/restore`);
  return response.data;
};

/**
 * Buscar propuestas de valor
 */
export const search = async (query: string, params: Omit<ValuePropositionPaginationParams, 'search'> = {}): Promise<IApiResponse> => {
  return getAllPaginated({ ...params, search: query });
};

export const ValuePropositionService = {
  getAllPaginated,
  getAll,
  get,
  store,
  update,
  remove,
  restore,
  search,
};