import api from "../api"
import type { AxiosResponse } from "axios"
import type { User } from "../types/auth"

export const getUserById = async (id: string): Promise<User> => {
  const response: AxiosResponse<User> = await api.get(`/api/users/${id}`)
  return response.data
}