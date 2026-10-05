import {
  getTasksByUser,
  createTaskForUser,
  getTaskByIdAndUser,
  updateTaskByIdAndUser,
  deleteTaskByIdAndUser,
  restoreTaskByIdAndUser,
  getDeletedTasksByUser,
  searchTasksByUser,
} from "../services/task.service.js";

import { sendSuccess } from "../utils/apiResponse.js";
import AppError from "../utils/AppError.js";

// GET ALL TASKS
export const getAllTasks = async (req, res, next) => {
  try {
    const queryOptions = req.validatedData?.query || {};

    const result = await getTasksByUser(req.user._id, queryOptions);

    return sendSuccess(res, 200, "Tasks fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

// CREATE TASK
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate, category } =
      req.validatedData.body;

    const task = await createTaskForUser({
      title,
      description,
      status,
      priority,
      dueDate,
      category,
      userId: req.user._id,
    });

    return sendSuccess(res, 201, "Task created successfully", task);
  } catch (error) {
    next(error);
  }
};

// GET TASK BY ID
export const getTaskById = async (req, res, next) => {
  try {
    const { taskId } = req.validatedData.params;

    const task = await getTaskByIdAndUser(taskId, req.user._id);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    return sendSuccess(res, 200, "Task retrieved successfully", task);
  } catch (error) {
    next(error);
  }
};

// UPDATE TASK
export const updateTask = async (req, res, next) => {
  try {
    const { taskId } = req.validatedData.params;

    const updateData = req.validatedData.body;

    const task = await updateTaskByIdAndUser(taskId, req.user._id, updateData);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    return sendSuccess(res, 200, "Task updated successfully", task);
  } catch (error) {
    next(error);
  }
};

// DELETE TASK (soft delete)
export const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.validatedData.params;
    const userId = req.user._id;

    const task = await deleteTaskByIdAndUser(taskId, userId);

    if (!task) {
      throw new AppError("Task not found", 404);
    }

    return sendSuccess(res, 200, "Task moved to trash successfully", task);
  } catch (error) {
    next(error);
  }
};

// RESTORE TASK
export const restoreTask = async (req, res, next) => {
  try {
    const { taskId } = req.validatedData.params;

    const userId = req.user._id;

    const task = await restoreTaskByIdAndUser(taskId, userId);

    if (!task) {
      throw new AppError("Deleted task not found", 404);
    }

    return sendSuccess(res, 200, "Task restored successfully", task);
  } catch (error) {
    next(error);
  }
};

// GET DELETED TASKS (trash)
export const getDeletedTasks = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const queryOptions = req.validatedData?.query || {};

    const result = await getDeletedTasksByUser(userId, queryOptions);

    return sendSuccess(res, 200, "Deleted tasks fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

// SEARCH TASKS
export const searchTasks = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const filters = req.validatedData.query;

    const result = await searchTasksByUser(userId, filters);

    return sendSuccess(res, 200, "Tasks search completed", result);
  } catch (error) {
    next(error);
  }
};
