import { rateLimit } from "express-rate-limit";

// Authentication rate limiter
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 30,

  message: {
    success: false,
    message: "Too many authentication attempts. Please try again later.",
  },

  standardHeaders: "draft-8",

  legacyHeaders: false,
});

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  limit: 300,

  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },

  standardHeaders: "draft-8",

  legacyHeaders: false,
});
