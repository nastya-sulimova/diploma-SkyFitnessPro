export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
};
