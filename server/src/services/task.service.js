import Task from "../models/task.model.js";
import Category from "../models/category.model.js";
import AppError from "../utils/AppError.js";

export const getTasksByUser = async (userId, options = {}) => {
  const page = parseInt(options.page, 10) || 1;

  const limit = parseInt(options.limit, 10) || 10;

  const skip = (page - 1) * limit;

  const filter = {
    user: userId,
    isDeleted: false,
  };

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate("category", "name color")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Task.countDocuments(filter),
  ]);

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const createTaskForUser = async ({
  title,
  description,
  status,
  priority,
  dueDate,
  category,
  userId,
}) => {
  const taskData = {
    title,
    description,
    user: userId,
    category: null,
  };

  if (status) taskData.status = status;

  if (priority) taskData.priority = priority;

  if (dueDate) taskData.dueDate = dueDate;

  if (category) {
    const categoryExists = await Category.exists({
      _id: category,
      user: userId,
    });

    if (!categoryExists) {
      throw new AppError("Category not found", 404);
    }

    taskData.category = category;
  }

  return await Task.create(taskData);
};

export const getTaskByIdAndUser = async (taskId, userId) => {
  return await Task.findOne({
    _id: taskId,
    user: userId,
    isDeleted: false,
  }).populate("category", "name color");
};

export const updateTaskByIdAndUser = async (taskId, userId, updateData) => {
  if (updateData.category) {
    const categoryExists = await Category.exists({
      _id: updateData.category,
      user: userId,
    });

    if (!categoryExists) {
      throw new AppError("Category not found", 404);
    }
  }

  return await Task.findOneAndUpdate(
    {
      _id: taskId,
      user: userId,
      isDeleted: false,
    },
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    },
  ).populate("category", "name color");
};

export const deleteTaskByIdAndUser = async (taskId, userId) => {
  return await Task.findOneAndUpdate(
    {
      _id: taskId,
      user: userId,
      isDeleted: false,
    },
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    },
    {
      new: true,
    },
  );
};

export const restoreTaskByIdAndUser = async (taskId, userId) => {
  return await Task.findOneAndUpdate(
    {
      _id: taskId,
      user: userId,
      isDeleted: true,
    },
    {
      $set: {
        isDeleted: false,
        deletedAt: null,
      },
    },
    {
      new: true,
      runValidators: true,
    },
  ).populate("category", "name color");
};

export const getDeletedTasksByUser = async (userId, options = {}) => {
  const page = parseInt(options.page, 10) || 1;
  const limit = parseInt(options.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const filter = {
    user: userId,
    isDeleted: true,
  };

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate("category", "name color")
      .sort({ deletedAt: -1 })
      .skip(skip)
      .limit(limit),
    Task.countDocuments(filter),
  ]);

  return {
    tasks,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const searchTasksByUser = async (userId, filters = {}) => {
  const {
    search,
    status,
    priority,
    category,
    dueBefore,
    dueAfter,
    overdue,
    sortBy = "createdAt",
    order = "desc",
    page = 1,
    limit = 10,
  } = filters;

  const currentPage = parseInt(page, 10) || 1;
  const currentLimit = parseInt(limit, 10) || 10;
  const skip = (currentPage - 1) * currentLimit;

  // Always enforce ownership and exclude deleted tasks.
  const query = {
    user: userId,
    isDeleted: false,
  };

  // Search by title or description.
  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    query.$or = [
      { title: { $regex: escapedSearch, $options: "i" } },
      {
        description: {
          $regex: escapedSearch,
          $options: "i",
        },
      },
    ];
  }

  // Filter by status.
  if (status) {
    query.status = status;
  }

  // Filter by priority.
  if (priority) {
    query.priority = priority;
  }

  // Filter by category.
  if (category) {
    query.category = category;
  }

  // Filter by due date range.
  if (dueBefore || dueAfter) {
    query.dueDate = {};

    if (dueBefore) {
      const endOfDay = new Date(`${dueBefore}T23:59:59.999Z`);
      query.dueDate.$lte = endOfDay;
    }

    if (dueAfter) {
      const startOfDay = new Date(`${dueAfter}T00:00:00.000Z`);
      query.dueDate.$gte = startOfDay;
    }
  }

  // Filter overdue tasks.
  if (overdue === "true") {
    query.dueDate = {
      $lt: new Date(),
      $ne: null,
    };

    query.status = { $ne: "completed" };
  }

  // Build sort options.
  const sortDirection = order === "asc" ? 1 : -1;

  let sortOptions;

  if (sortBy === "priority") {
    sortOptions = {
      priority: sortDirection,
      createdAt: -1,
    };
  } else {
    sortOptions = {
      [sortBy]: sortDirection,
    };
  }

  const [tasks, total] = await Promise.all([
    Task.find(query)
      .populate("category", "name color")
      .sort(sortOptions)
      .skip(skip)
      .limit(currentLimit),
    Task.countDocuments(query),
  ]);

  return {
    tasks,
    pagination: {
      page: currentPage,
      limit: currentLimit,
      total,
      totalPages: Math.ceil(total / currentLimit) || 1,
    },
  };
};
