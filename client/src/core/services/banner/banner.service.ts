import axios from "@/core/config/axios";
import type { IApiResponse, IPaginationRequest } from "@/core/types/IApi";
import type { IBannerCreateRequest, IBannerUpdateRequest } from "@/core/types/IBanner";

export const getAllPaginated = async (
  params?: IPaginationRequest,
  config: { signal?: AbortSignal } = {}
): Promise<IApiResponse> => {
  const res = await axios.get("/v1/banners", { params, ...config });
  return res.data;
};

export const create = async (request: IBannerCreateRequest): Promise<IApiResponse> => {
  const fd = new FormData();
  fd.append("title", request.title);
  if (request.subtitle) fd.append("subtitle", request.subtitle);
  fd.append("image", request.image); // <-- ya es File
  const res = await axios.post("/v1/banners", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const update = async (id: number, request: IBannerUpdateRequest): Promise<IApiResponse> => {
  const hasFile = !!request.image;

  if (hasFile) {
    const fd = new FormData();
    fd.append("_method", "PUT");
    if (request.title !== undefined) fd.append("title", String(request.title));
    if (request.subtitle !== undefined && request.subtitle !== null) fd.append("subtitle", request.subtitle);
    fd.append("image", request.image as File);
    const res = await axios.post(`/v1/banners/${id}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  const payload: { title?: string; subtitle?: string | null } = {};
  if (request.title !== undefined) payload.title = request.title as string;
  if (request.subtitle !== undefined) payload.subtitle = request.subtitle ?? null;
  const res = await axios.put(`/v1/banners/${id}`, payload);
  return res.data;
};

export const get = async (id: number): Promise<IApiResponse> => {
  const res = await axios.get(`/v1/banners/${id}`);
  return res.data;
};

export const remove = async (id: number): Promise<IApiResponse> => {
  const res = await axios.delete(`/v1/banners/${id}`);
  return res.data;
};

export const BannerService = { getAllPaginated, create, update, get, remove };
