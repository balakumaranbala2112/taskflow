import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: [true, "Task Title is required"],
      trim: true,
      minlength: [3, "Task title must contain at least 3 characters"],
    },

    description: {
      type: String,
      required: [true, "Task Description is required"],
    },

    status: {
      type: String,
      enum: {
        values: ["todo", "in-progress", "completed"],
        message: "{VALUE} is not a valid status",
      },
      default: "todo",
    },

    priority: {
      type: String,
      enum: {
        values: ["low", "medium", "high"],
        message: "{VALUE} is not a valid priority",
      },
      default: "medium",
    },

    dueDate: {
      type: Date,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Compound indexes (compound indexes with { user: 1, ... } prefix cover single-field user queries)
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, isDeleted: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;
