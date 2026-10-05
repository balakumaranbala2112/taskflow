import axiosInstance from "./api/axiosInstance";

export async function getCategories() {
  const response = await axiosInstance.get("/categories");
  return response.data.data;
}

export async function getCategoryById(categoryId) {
  const response = await axiosInstance.get(`/categories/${categoryId}`);
  return response.data.data;
}

export async function createCategory(categoryData) {
  const response = await axiosInstance.post("/categories", categoryData);
  return response.data.data;
}

export async function updateCategory(categoryId, categoryData) {
  const response = await axiosInstance.patch(`/categories/${categoryId}`, categoryData);
  return response.data.data;
}

export async function deleteCategory(categoryId) {
  const response = await axiosInstance.delete(`/categories/${categoryId}`);
  return response.data.data;
}
