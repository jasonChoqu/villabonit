// core/services/resource-begin/resource-begin.service.ts
import axios from '@/core/config/axios';
import type { IApiResponse, IPaginationRequest } from '@/core/types/IApi';

const API_PREFIX = '/v1/resourcebegin';

export type ResourceBeginCreatePayload = {
  url: File;
  logo_url?: File | null;
  text?: string | null;
};

export type ResourceBeginUpdatePayload = {
  url?: File;
  logo_url?: File | null;
  text?: string | null;
};

export const getAllPaginated = async (params?: IPaginationRequest, config: { signal?: AbortSignal } = {}): Promise<IApiResponse> => {
  const { data } = await axios.get(API_PREFIX, { params, ...config });
  console.log(data);
  return data;
};

export const getAll = async (): Promise<IApiResponse> => {
  const { data } = await axios.get(`${API_PREFIX}`);
  console.log(data);
  return data;
};

export const create = async (request: ResourceBeginCreatePayload): Promise<IApiResponse> => {
  console.log(request);
  
  const fd = new FormData();
  fd.append('url', request.url);
  if (request.logo_url) fd.append('logo_url', request.logo_url);
  if (request.text !== undefined && request.text !== null) fd.append('text', request.text);

  const { data } = await axios.post(API_PREFIX, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data;
};

export const update = async (id: number | string, request: ResourceBeginUpdatePayload): Promise<IApiResponse> => {
    console.log(request);
  const fd = new FormData();
  fd.append('_method', 'PUT');
  if (request.url) fd.append('url', request.url);
  if (request.logo_url) fd.append('logo_url', request.logo_url);
  if (request.text !== undefined) fd.append('text', request.text ?? '');

  const { data } = await axios.post(`${API_PREFIX}/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data;
};

export const get = async (id: number | string): Promise<IApiResponse> => {
  const { data } = await axios.get(`${API_PREFIX}/${id}`);
  return data;
};

export const remove = async (id: number | string): Promise<IApiResponse> => {
  const { data } = await axios.delete(`${API_PREFIX}/${id}`);
  return data;
};

export const ResourceBeginService = { getAllPaginated, getAll, create, update, get, remove };
