import { describe, it, expect } from "vitest";
import errorHandler from "../src/middlewares/error.middleware.js";
import AppError from "../src/utils/AppError.js";

const createMockReq = () => ({});
const createMockRes = () => {
  const res = {
    headersSent: false,
    statusCode: 200,
    body: null,
  };
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

describe("Global Error Handler Middleware", () => {
  it("should format operational AppError correctly", () => {
    const err = new AppError("Resource not found", 404);
    const req = createMockReq();
    const res = createMockRes();
    const next = () => {};

    errorHandler(err, req, res, next);

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({
      success: false,
      status: "fail",
      message: "Resource not found",
    });
  });

  it("should handle MongoDB CastError as 400 Bad Request", () => {
    const err = new Error("Cast error");
    err.name = "CastError";

    const req = createMockReq();
    const res = createMockRes();
    const next = () => {};

    errorHandler(err, req, res, next);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid resource ID");
  });

  it("should handle duplicate key 11000 error with 409 Conflict", () => {
    const err = new Error("E11000 duplicate key error");
    err.code = 11000;
    err.keyValue = { email: "test@example.com" };

    const req = createMockReq();
    const res = createMockRes();
    const next = () => {};

    errorHandler(err, req, res, next);

    expect(res.statusCode).toBe(409);
    expect(res.body.message).toBe("email already exists");
  });

  it("should mask unhandled 500 errors in production", () => {
    const err = new Error("Database network failure");
    const req = createMockReq();
    const res = createMockRes();
    const next = () => {};

    errorHandler(err, req, res, next);

    expect(res.statusCode).toBe(500);
    expect(res.body.message).toBe("Internal Server Error");
  });
});
