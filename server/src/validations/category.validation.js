import { z } from "zod";

// Reusable category fields
const categoryFields = {
  name: z
    .string()
    .trim()
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name cannot exceed 50 characters"),

  description: z
    .string()
    .trim()
    .max(200, "Description cannot exceed 200 characters")
    .optional(),

  color: z
    .string()
    .regex(
      /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/,
      "Color must be a valid hexadecimal color",
    )
    .optional(),
};

// Create category
export const createCategorySchema = z.object({
  body: z.object(categoryFields).strict(),
});

// Update category
export const updateCategorySchema = z.object({
  body: z
    .object({
      name: categoryFields.name.optional(),
      description: categoryFields.description,
      color: categoryFields.color,
    })
    .strict()
    .refine((data) => Object.keys(data).length > 0, {
      message: "Please provide at least one field to update",
    }),
});

// Validate category ID
export const categoryIdSchema = z.object({
  params: z.object({
    categoryId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid category ID"),
  }),
});
