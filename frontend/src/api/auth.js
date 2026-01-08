import { api } from "./client";

export const registerUser = async (data) => {
  const res = await api.post("/api/auth/register", data);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/api/auth/login", data);
  return res.data;
};

export const googleLogin = () => {
  const base = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
  window.location.href = `${base}/api/auth/google`;
};
