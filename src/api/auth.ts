import { API_BASE_URL } from "@/utils/constants";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  message?: string;
}

export interface ErrorResponse {
  message: string;
}

export async function login(data: LoginData): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/fitness/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error: ErrorResponse = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/fitness/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error: ErrorResponse = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}
