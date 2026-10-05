import axiosInstance from "./api/axiosInstance";

export async function getDashboardStats() {
  const response = await axiosInstance.get("/dashboard/stats");
  return response.data.data;
}
