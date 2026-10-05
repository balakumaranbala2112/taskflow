import Category from "../models/category.model.js";
import Task from "../models/task.model.js";

// Create a category for a user
export const createCategoryForUser = async ({
  name,
  description,
  color,
  userId,
}) => {
  return await Category.create({
    name,
    description,
    color,
    user: userId,
  });
};

// Get all categories belonging to a user
export const getCategoriesByUser = async (userId) => {
  return await Category.find({
    user: userId,
  }).sort({ createdAt: -1 });
};

// Get a single category by ID and user
export const getCategoryByIdAndUser = async (categoryId, userId) => {
  return await Category.findOne({
    _id: categoryId,
    user: userId,
  });
};
ss
// Update a category
export const updateCategoryByIdAndUser = async (
  categoryId,
  userId,
  updateData,
) => {
  return await Category.findOneAndUpdate(
    {
      _id: categoryId,
      user: userId,
    },
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    },
  );
};

// Delete a category and nullify references in tasks
export const deleteCategoryByIdAndUser = async (categoryId, userId) => {
  const deletedCategory = await Category.findOneAndDelete({
    _id: categoryId,
    user: userId,
  });

  console.info("Deleted Category: ", deletedCategory);

  if (deletedCategory) {
    // Nullify category references on any tasks owned by this user
    await Task.updateMany(
      {
        category: categoryId,
        user: userId,
      },
      {
        $set: { category: null },
      },
    );
  }

  return deletedCategory;
};
