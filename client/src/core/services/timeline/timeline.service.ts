import axios from "@/core/config/axios";
import type { IApiResponse, IPaginationRequest } from "@/core/types/IApi";
import type { ITimelineCreateRequest, ITimelineUpdateRequest } from "@/core/types/ITimeline";

// const hasBinary = (obj: any) =>
//   Object.values(obj ?? {}).some(v => (typeof File !== 'undefined' && v instanceof File) || v instanceof Blob);

// const toFormData = (payload: Record<string, any>) => {
//   const fd = new FormData();
//   Object.entries(payload).forEach(([k, v]) => {
//     if (v === undefined || v === null) return;
//     fd.append(k, v as any);
//   });
//   return fd;
// };

export const getAllPaginated = async (
  params?: IPaginationRequest,
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse> => {
  const res = await axios.get("/v1/timeline", { params, ...config });
  return res.data;
};

export const create = async (request: ITimelineCreateRequest): Promise<IApiResponse> => {
  const formData = new FormData();

  if (request.title != null) formData.append("title", request.title);
  if (request.description != null) formData.append("description", request.description);
  if (request.year != null) formData.append("year", request.year);

  if (typeof File !== "undefined" && request.photo instanceof File) {
    // <-- clave
    formData.append("photo", request.photo);
  }

  const res = await axios.post("/v1/timeline", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const update = async (id: any, request: ITimelineUpdateRequest): Promise<IApiResponse> => {
  const formData = new FormData();

  if (request.title != null) formData.append("title", request.title);
  if (request.description != null) formData.append("description", request.description);
  if (request.year != null) formData.append("year", request.year);

  if (typeof File !== "undefined" && request.photo instanceof File) {
    // <-- solo si cambió el archivo
    formData.append("photo", request.photo);
  }

  // método seguro para multipart
  formData.append("_method", "PUT");

  const res = await axios.post(`/v1/timeline/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/timeline/${id}`);
  return res.data;
};

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/timeline/${id}`);
  return response.data;
};

export const TimelineService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
};
