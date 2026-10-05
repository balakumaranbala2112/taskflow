import mongoose from "mongoose";
import Task from "../models/task.model.js";

export const getDashboardStats = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const now = new Date();

  const [result] = await Task.aggregate([
    {
      $match: {
        user: userObjectId,
        isDeleted: false,
      },
    },
    {
      $facet: {
        summary: [
          {
            $group: {
              _id: null,
              totalTasks: { $sum: 1 },
              completedTasks: {
                $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
              },
              pendingTasks: {
                $sum: {
                  $cond: [
                    { $in: ["$status", ["todo", "in-progress"]] },
                    1,
                    0,
                  ],
                },
              },
              overdueTasks: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $ne: ["$status", "completed"] },
                        { $ne: ["$dueDate", null] },
                        { $lt: ["$dueDate", now] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ],
        tasksByStatus: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ],
        tasksByPriority: [
          {
            $group: {
              _id: "$priority",
              count: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
        ],
        tasksByCategory: [
          {
            $group: {
              _id: "$category",
              count: { $sum: 1 },
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "_id",
              foreignField: "_id",
              as: "categoryDetails",
            },
          },
          {
            $unwind: {
              path: "$categoryDetails",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              _id: 0,
              category: "$_id",
              categoryName: {
                $ifNull: ["$categoryDetails.name", "Uncategorized"],
              },
              count: 1,
            },
          },
          { $sort: { count: -1 } },
        ],
      },
    },
  ]);

  const summary = result?.summary?.[0]
    ? {
        totalTasks: result.summary[0].totalTasks,
        completedTasks: result.summary[0].completedTasks,
        pendingTasks: result.summary[0].pendingTasks,
        overdueTasks: result.summary[0].overdueTasks,
      }
    : {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        overdueTasks: 0,
      };

  return {
    summary,
    tasksByStatus: result?.tasksByStatus || [],
    tasksByPriority: result?.tasksByPriority || [],
    tasksByCategory: result?.tasksByCategory || [],
  };
};
