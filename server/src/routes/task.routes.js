import { Router } from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
  restoreTask,
  getDeletedTasks,
  searchTasks,
} from "../controllers/task.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

import { validate } from "../middlewares/validate.middleware.js";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  taskQuerySchema,
  paginationQuerySchema,
} from "../validations/task.validation.js";

const router = Router();

router.use(protect);

// Trash routes
router.get("/trash", validate(paginationQuerySchema), getDeletedTasks);

// Search routes
router.get("/search", validate(taskQuerySchema), searchTasks);

// Restore route
router.patch("/:taskId/restore", validate(taskIdSchema), restoreTask);

// GET /api/v1/tasks
router.get("/", validate(paginationQuerySchema), getAllTasks);

// POST /api/v1/tasks
router.post("/", validate(createTaskSchema), createTask);

// GET /api/v1/tasks/:taskId
router.get("/:taskId", validate(taskIdSchema), getTaskById);

// PATCH /api/v1/tasks/:taskId (API-001: validate params before body)
router.patch(
  "/:taskId",
  validate(taskIdSchema),
  validate(updateTaskSchema),
  updateTask,
);

// DELETE /api/v1/tasks/:taskId
router.delete("/:taskId", validate(taskIdSchema), deleteTask);

export default router;
