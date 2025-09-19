import axios from "@/core/config/axios";
import type { IApiResponse, IPaginationRequest } from "@/core/types/IApi";
import type { IClientCreateRequest, IClientUpdateRequest } from "@/core/types/IClients";

export const getAllPaginated = async (
  params?: IPaginationRequest,
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse> => {
  const res = await axios.get("/v1/clients", { params, ...config });
  return res.data;
};

export const create = async (request: IClientCreateRequest): Promise<IApiResponse> => {
  const res = await axios.post("/v1/clients", request);
  return res.data;
};

export const update = async (id: any, request: IClientUpdateRequest): Promise<IApiResponse> => {
  const res = await axios.put(`/v1/clients/${id}`, request);
  return res.data;
};

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/clients/${id}`);
  return res.data;
};

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/clients/${id}`);
  return response.data;
};

export const ClientService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
};
