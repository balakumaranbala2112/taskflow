import { describe, it, expect } from "vitest";
import { sendSuccess, sendError } from "../src/utils/apiResponse.js";
import AppError from "../src/utils/AppError.js";

// Mock Express response object
const createMockRes = () => {
  const res = {};
  res.statusCode = 200;
  res.body = null;
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.body = data;
    return res;
  };
  return res;
};

describe("apiResponse Utility", () => {
  describe("sendSuccess", () => {
    it("should format a standard success response with default code 200", () => {
      const res = createMockRes();
      sendSuccess(res, 200, "Operation completed");

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        success: true,
        message: "Operation completed",
      });
    });

    it("should include data payload when provided", () => {
      const res = createMockRes();
      const payload = { id: "123", name: "Task 1" };
      sendSuccess(res, 201, "Created", payload);

      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual({
        success: true,
        message: "Created",
        data: payload,
      });
    });

    it("should automatically add count property when data is an array", () => {
      const res = createMockRes();
      const list = [{ id: 1 }, { id: 2 }, { id: 3 }];
      sendSuccess(res, 200, "Fetched", list);

      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(3);
      expect(res.body.data).toEqual(list);
    });
  });

  describe("sendError", () => {
    it("should format a standard error response", () => {
      const res = createMockRes();
      sendError(res, 404, "Resource not found");

      expect(res.statusCode).toBe(404);
      expect(res.body).toEqual({
        success: false,
        message: "Resource not found",
      });
    });

    it("should include validation errors array when provided", () => {
      const res = createMockRes();
      const errors = [{ field: "email", message: "Invalid email" }];
      sendError(res, 400, "Validation failed", errors);

      expect(res.statusCode).toBe(400);
      expect(res.body).toEqual({
        success: false,
        message: "Validation failed",
        errors,
      });
    });
  });
});

describe("AppError Class", () => {
  it("should create operational error with status fail for 4xx", () => {
    const error = new AppError("Bad request", 400);
    expect(error.message).toBe("Bad request");
    expect(error.statusCode).toBe(400);
    expect(error.status).toBe("fail");
    expect(error.isOperational).toBe(true);
  });

  it("should create operational error with status error for 5xx", () => {
    const error = new AppError("Server failure", 500);
    expect(error.statusCode).toBe(500);
    expect(error.status).toBe("error");
    expect(error.isOperational).toBe(true);
  });
});
