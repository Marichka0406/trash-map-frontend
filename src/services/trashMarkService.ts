import api from "../api";
import type { AxiosResponse } from "axios";
import type { TrashMarkRequest, TrashMarkResponse, MapTrashMark } from "../types/trashMark";

const API_BASE_URL = "/api/trashMarks";

export const createTrashMark = async (
  data: TrashMarkRequest
): Promise<TrashMarkResponse> => {
  const response: AxiosResponse<TrashMarkResponse> = await api.post(
    API_BASE_URL,
    data
  );
  return response.data;
};

export const getAllTrashMarks = async (): Promise<MapTrashMark[]> => {
  const response: AxiosResponse<MapTrashMark[]> = await api.get(API_BASE_URL);
  return response.data;
};
