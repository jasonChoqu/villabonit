
import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';
import type { IAgreementCreateRequest, IAgreementUpdateRequest } from '@/core/types/IAgreement';

// Obtener todos los acuerdos sin paginación
export const getAll = async (): Promise<IApiResponse> => {
  const res = await axios.get('/v1/agreements/all');
  return res.data;
};


export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const res = await axios.get('/v1/agreements', { params, ...config });
  return res.data;
}

export const create = async (request: IAgreementCreateRequest): Promise<IApiResponse> => {
  console.log(request.name);
  const formData = new FormData();

  if (request.name) formData.append('name', request.name);
  if (request.description != null) formData.append('description', request.description);

  if (typeof File !== 'undefined' && request.photo instanceof File) {      // <-- clave
    formData.append('photo', request.photo);
  }

  const res = await axios.post('/v1/agreements', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const update = async (id: any, request: IAgreementUpdateRequest): Promise<IApiResponse> => {
  const formData = new FormData();

  if (request.name != null) formData.append('name', request.name);
  if (request.description != null) formData.append('description', request.description);

  if (typeof File !== 'undefined' && request.photo instanceof File) {      // <-- solo si cambió el archivo
    formData.append('photo', request.photo);
  }

  // método seguro para multipart
  formData.append('_method', 'PUT');

  const res = await axios.post(`/v1/agreements/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};


export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/agreements/${id}`);
  return res.data;
}

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/agreements/${id}`);
  return response.data;
}

export const AgreementService = {
  getAllPaginated,
  getAll,
  create,
  update,
  get,
  remove,
}
