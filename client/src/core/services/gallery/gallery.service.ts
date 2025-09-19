import axios from "@/core/config/axios";
import type { IApiResponse, IPaginationRequest } from "@/core/types/IApi";
import type { IGalleryCreateRequest, IGalleryUpdateRequest } from "@/core/types/IGallery";

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
  const res = await axios.get("/v1/gallery", { params, ...config });
  return res.data;
};

export const create = async (request: IGalleryCreateRequest): Promise<IApiResponse> => {
  const formData = new FormData();

  if (request.description != null) formData.append("description", request.description);
  if (request.description2 != null) formData.append("description2", request.description2);
  if (request.area) formData.append("area", request.area);

  if (typeof File !== "undefined" && request.photo instanceof File) {
    // <-- clave
    formData.append("photo", request.photo);
  }

  const res = await axios.post("/v1/gallery", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const update = async (id: any, request: IGalleryUpdateRequest): Promise<IApiResponse> => {
  const formData = new FormData();

  if (request.description != null) formData.append("description", request.description);
  if (request.description2 != null) formData.append("description2", request.description2);
  if (request.area != null) formData.append("area", request.area);

  if (typeof File !== "undefined" && request.photo instanceof File) {
    // <-- solo si cambió el archivo
    formData.append("photo", request.photo);
  }

  // método seguro para multipart
  formData.append("_method", "PUT");

  const res = await axios.post(`/v1/gallery/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const get = async (id: any): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/gallery/${id}`);
  return res.data;
};

export const remove = async (id: any): Promise<IApiResponse> => {
  const response = await axios.delete(`/v1/gallery/${id}`);
  return response.data;
};

export const GalleryService = {
  getAllPaginated,
  create,
  update,
  get,
  remove,
};
