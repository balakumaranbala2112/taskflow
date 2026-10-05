import axiosInstance from "./api/axiosInstance";

export async function registerUser(userData) {
  const response = await axiosInstance.post(`/auth/register`, userData);
  return response.data.data;
}

export async function loginUser(credentials) {
  const response = await axiosInstance.post(`/auth/login`, credentials);
  return response.data.data;
}

export async function getMe() {
  const response = await axiosInstance.get(`/auth/me`);
  return response.data.data;
}

export async function logoutUser() {
  const response = await axiosInstance.post(`/auth/logout`, {});
  return response.data;
}

export async function refreshAccessToken() {
  const response = await axiosInstance.post(`/auth/refresh`);
  return response.data.data;
}