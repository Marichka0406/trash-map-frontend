import api from "../api";
import type { AxiosResponse } from "axios";
import type { TrashMarkRequest, СreateTrashMarkResponse, MapTrashMark, GetTrashMarkResponse } from "../types/trashMark";

const API_BASE_URL = "/api/trashMarks";

export const createTrashMark = async (
  data: TrashMarkRequest
): Promise< СreateTrashMarkResponse> => {
  const response: AxiosResponse<СreateTrashMarkResponse> = await api.post(
    API_BASE_URL,
    data
  );
  return response.data;
};

export const getAllTrashMarks = async (): Promise<MapTrashMark[]> => {
  const response: AxiosResponse<MapTrashMark[]> = await api.get(API_BASE_URL);
  return response.data;
};

export const getTrashMarkById = async (id: string): Promise<GetTrashMarkResponse> => {
  const response: AxiosResponse<GetTrashMarkResponse> = await api.get(`${API_BASE_URL}/${id}`);
  return response.data;
};
