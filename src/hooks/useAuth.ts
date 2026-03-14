"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, register, LoginData, RegisterData } from "@/api/auth";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (data: LoginData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await login(data);

      localStorage.setItem("token", response.token);

      router.push("/profile");

      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (data: RegisterData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await register(data);

      localStorage.setItem("token", response.token);

      router.push("/profile");

      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка регистрации");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  return {
    loading,
    error,
    handleLogin,
    handleRegister,
    logout,
  };
}
