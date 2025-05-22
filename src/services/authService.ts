import api from "../api";
import type { AxiosResponse } from "axios";
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
} from "../types/auth";

const API_BASE_URL = "/api/users";

export const registerUser = async (
  user: RegisterRequest
): Promise<AuthResponse> => {
  const response: AxiosResponse<AuthResponse> = await api.post(
    `${API_BASE_URL}/register`,
    user
  );
  return response.data;
};

export const loginUser = async (
  loginData: LoginRequest
): Promise<AuthResponse> => {
  const response: AxiosResponse<AuthResponse> = await api.post(
    `${API_BASE_URL}/login`,
    loginData
  );
  return response.data;
};
