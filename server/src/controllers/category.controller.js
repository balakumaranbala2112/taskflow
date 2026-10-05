import {
  createCategoryForUser,
  getCategoriesByUser,
  getCategoryByIdAndUser,
  updateCategoryByIdAndUser,
  deleteCategoryByIdAndUser,
} from "../services/category.service.js";

import { sendSuccess } from "../utils/apiResponse.js";
import AppError from "../utils/AppError.js";

// Create a new category
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, color } = req.validatedData.body;
    const userId = req.user._id;

    const category = await createCategoryForUser({
      name,
      description,
      color,
      userId,
    });

    return sendSuccess(res, 201, "Category created successfully", category);
  } catch (error) {
    next(error);
  }
};

// Get all categories belonging to the logged-in user
export const getAllCategories = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const categories = await getCategoriesByUser(userId);

    return sendSuccess(res, 200, "Categories fetched successfully", categories);
  } catch (error) {
    next(error);
  }
};

// Get a single category
export const getCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.validatedData.params;
    const userId = req.user._id;

    const category = await getCategoryByIdAndUser(categoryId, userId);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return sendSuccess(res, 200, "Category fetched successfully", category);
  } catch (error) {
    next(error);
  }
};

// Update a category
export const updateCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.validatedData.params;
    const updateData = req.validatedData.body;
    const userId = req.user._id;

    const category = await updateCategoryByIdAndUser(
      categoryId,
      userId,
      updateData,
    );

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return sendSuccess(res, 200, "Category updated successfully", category);
  } catch (error) {
    next(error);
  }
};

// Delete a category
export const deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.validatedData.params;
    const userId = req.user._id;

    const category = await deleteCategoryByIdAndUser(categoryId, userId);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return sendSuccess(res, 200, "Category deleted successfully", category);
  } catch (error) {
    next(error);
  }
};
