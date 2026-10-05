import { z } from "zod";

const categoryIdField = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID")
  .nullable()
  .optional();

export const createTaskSchema = z.object({
  body: z.object({
    title: z
      .string()
      .trim()
      .min(1, "Title is required")
      .max(100, "Title cannot exceed 100 characters"),

    description: z
      .string()
      .trim()
      .min(1, "Description is required")
      .max(1000, "Description cannot exceed 1000 characters"),

    status: z.enum(["todo", "in-progress", "completed"]).optional(),

    priority: z.enum(["low", "medium", "high"]).optional(),

    dueDate: z.iso.datetime().optional().nullable(),

    category: categoryIdField,
  }),
});

export const updateTaskSchema = z.object({
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(1, "Title cannot be empty")
        .max(100, "Title cannot exceed 100 characters")
        .optional(),

      description: z
        .string()
        .trim()
        .min(1, "Description cannot be empty")
        .max(1000, "Description cannot exceed 1000 characters")
        .optional(),

      status: z.enum(["todo", "in-progress", "completed"]).optional(),

      priority: z.enum(["low", "medium", "high"]).optional(),

      dueDate: z.iso.datetime().optional().nullable(),

      category: categoryIdField,
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "Please provide at least one field to update",
    }),
});

export const taskIdSchema = z.object({
  params: z.object({
    taskId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid task ID"),
  }),
});

export const paginationQuerySchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .pipe(z.number().int().min(1)),

    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .pipe(z.number().int().min(1).max(100)),
  }),
});

export const taskQuerySchema = z.object({
  query: z.object({
    search: z.string().trim().max(100).optional(),

    status: z.enum(["todo", "in-progress", "completed"]).optional(),

    priority: z.enum(["low", "medium", "high"]).optional(),

    category: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID").optional(),

    dueBefore: z.iso.date().optional(),

    dueAfter: z.iso.date().optional(),

    overdue: z.enum(["true", "false"]).optional(),

    sortBy: z.enum(["createdAt", "dueDate", "title", "priority"]).optional(),

    order: z.enum(["asc", "desc"]).optional(),

    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .pipe(z.number().int().min(1)),

    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .pipe(z.number().int().min(1).max(100)),
  }),
});
