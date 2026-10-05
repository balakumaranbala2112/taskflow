import { Router } from "express";

import {
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from "../validations/category.validation.js";

import { validate } from "../middlewares/validate.middleware.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = Router();

// Protect all category routes
router.use(protect);

// Create a category
router.post("/", validate(createCategorySchema), createCategory);

// Get all categories
router.get("/", getAllCategories);

// Get a single category
router.get("/:categoryId", validate(categoryIdSchema), getCategory);

// Update a category
router.patch(
  "/:categoryId",
  validate(categoryIdSchema),
  validate(updateCategorySchema),
  updateCategory,
);

// Delete a category
router.delete("/:categoryId", validate(categoryIdSchema), deleteCategory);

export default router;
