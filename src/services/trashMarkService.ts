import api from "../api";
import type { AxiosResponse } from "axios";
import type { TrashMarkRequest, TrashMarkResponse } from "../types/trashMark";

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
