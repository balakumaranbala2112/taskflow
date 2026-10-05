import axiosInstance from "./api/axiosInstance";

export async function getTasks(params = {}) {
  const response = await axiosInstance.get("/tasks", { params });
  return response.data.data;
}

export async function getTaskById(taskId) {
  const response = await axiosInstance.get(`/tasks/${taskId}`);
  return response.data.data;
}

export async function createTask(taskData) {
  const response = await axiosInstance.post("/tasks", taskData);
  return response.data.data;
}

export async function updateTask({ taskId, taskData }) {
  const response = await axiosInstance.patch(`/tasks/${taskId}`, taskData);
  return response.data.data;
}

export async function deleteTask(taskId) {
  const response = await axiosInstance.delete(`/tasks/${taskId}`);
  return response.data.data;
}

export async function restoreTask(taskId) {
  const response = await axiosInstance.patch(`/tasks/${taskId}/restore`);
  return response.data.data;
}

export async function getTrashTasks(params = {}) {
  const response = await axiosInstance.get("/tasks/trash", { params });
  return response.data.data;
}

export async function searchTasks(params = {}) {
  // Clean empty params so they don't break validation
  const cleanParams = Object.entries(params).reduce((acc, [key, val]) => {
    if (val !== "" && val !== undefined && val !== null) {
      acc[key] = val;
    }
    return acc;
  }, {});

  const response = await axiosInstance.get("/tasks/search", { params: cleanParams });
  return response.data.data;
}