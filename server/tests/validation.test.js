import { describe, it, expect } from "vitest";
import {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
  taskQuerySchema,
  paginationQuerySchema,
} from "../src/validations/task.validation.js";
import {
  registerSchema,
  loginSchema,
} from "../src/validations/auth.validation.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../src/validations/category.validation.js";

describe("Task Validation Schemas", () => {
  describe("createTaskSchema", () => {
    it("should accept valid task payload", () => {
      const valid = {
        body: {
          title: "Complete Backend Audit",
          description: "Verify all endpoints and models",
          status: "in-progress",
          priority: "high",
        },
      };
      const result = createTaskSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should reject task with missing title", () => {
      const invalid = {
        body: {
          description: "Missing title",
        },
      };
      const result = createTaskSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should reject task with invalid category ObjectId", () => {
      const invalid = {
        body: {
          title: "Task with bad category",
          description: "desc",
          category: "not-an-objectid",
        },
      };
      const result = createTaskSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("updateTaskSchema", () => {
    it("should reject empty update body", () => {
      const empty = {
        body: {},
      };
      const result = updateTaskSchema.safeParse(empty);
      expect(result.success).toBe(false);
    });

    it("should accept single field update", () => {
      const valid = {
        body: {
          status: "completed",
        },
      };
      const result = updateTaskSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });

  describe("taskIdSchema", () => {
    it("should accept valid 24-character hex ObjectId", () => {
      const valid = {
        params: {
          taskId: "507f1f77bcf86cd799439011",
        },
      };
      const result = taskIdSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should reject invalid taskId", () => {
      const invalid = {
        params: {
          taskId: "invalid-id",
        },
      };
      const result = taskIdSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });
  });

  describe("paginationQuerySchema", () => {
    it("should provide default page and limit when empty query", () => {
      const empty = { query: {} };
      const result = paginationQuerySchema.safeParse(empty);
      expect(result.success).toBe(true);
      expect(result.data.query.page).toBe(1);
      expect(result.data.query.limit).toBe(10);
    });

    it("should coerce string numbers to integer", () => {
      const query = {
        query: {
          page: "3",
          limit: "25",
        },
      };
      const result = paginationQuerySchema.safeParse(query);
      expect(result.success).toBe(true);
      expect(result.data.query.page).toBe(3);
      expect(result.data.query.limit).toBe(25);
    });
  });
});

describe("Auth Validation Schemas", () => {
  it("should validate register payload with minimum 8-char password", () => {
    const valid = {
      body: {
        name: "Alice Smith",
        email: "alice@example.com",
        password: "securePassword123",
      },
    };
    const result = registerSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("should reject short passwords under 8 chars", () => {
    const invalid = {
      body: {
        name: "Alice Smith",
        email: "alice@example.com",
        password: "short",
      },
    };
    const result = registerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("should normalize and trim valid login payload", () => {
    const valid = {
      body: {
        email: "alice@example.com",
        password: "securePassword123",
      },
    };
    const result = loginSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });
});

describe("Category Validation Schemas", () => {
  it("should accept valid category with hex color", () => {
    const valid = {
      body: {
        name: "Work",
        description: "Work related tasks",
        color: "#3B82F6",
      },
    };
    const result = createCategorySchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("should reject invalid color format", () => {
    const invalid = {
      body: {
        name: "Work",
        color: "blue",
      },
    };
    const result = createCategorySchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });
});
