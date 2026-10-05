import { describe, it, expect } from "vitest";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshAuthToken,
} from "../src/utils/token.utils.js";

describe("JWT Token Utilities", () => {
  const mockUserId = "507f1f77bcf86cd799439011";

  it("should generate and verify an access token", () => {
    const token = generateAccessToken(mockUserId);
    expect(typeof token).toBe("string");

    const decoded = verifyAccessToken(token);
    expect(decoded.userId).toBe(mockUserId);
  });

  it("should generate and verify a refresh token", () => {
    const token = generateRefreshToken(mockUserId);
    expect(typeof token).toBe("string");

    const decoded = verifyRefreshAuthToken(token);
    expect(decoded.userId).toBe(mockUserId);
  });

  it("should throw error when verifying invalid token", () => {
    expect(() => verifyAccessToken("invalid.jwt.token")).toThrow();
  });
});
