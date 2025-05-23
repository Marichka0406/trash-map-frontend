export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: 'user' | 'admin'
  points: number;
  avatar: string
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
