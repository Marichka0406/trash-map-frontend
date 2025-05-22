export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  points: number;
  avatar: string
  createdAt: Date;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}


export interface LoginRequest {
  email: string;
  password: string;
}
