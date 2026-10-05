import dotenv from "dotenv";
dotenv.config();

// Helper to parse duration strings like "15m", "7d", "24h", "60s" into milliseconds
export const parseDurationToMs = (duration, fallbackMs) => {
  if (typeof duration === "number") return duration;
  if (!duration || typeof duration !== "string") return fallbackMs;

  const match = duration.trim().match(/^(\d+)([smhd])$/);

  if (!match) return fallbackMs;

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
    case "d":
      return value * 24 * 60 * 60 * 1000;
    default:
      return fallbackMs;
  }
};

// Validate required secrets in production
const isProduction = process.env.NODE_ENV === "production";

if (isProduction) {
  const required = [
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "MONGODB_URI",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables in production: ${missing.join(", ")}`,
    );
  }
}

const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

const env = Object.freeze({
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",

  mongo: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/taskflow",
  },

  salt: Number(process.env.SALT_ROUNDS) || 10,

  accessToken: {
    secret:
      process.env.ACCESS_TOKEN_SECRET ||
      "taskflow_access_token_secret_key_default_32bytes",
    expiresIn: accessTokenExpiresIn,
    expiresInMs: parseDurationToMs(accessTokenExpiresIn, 15 * 60 * 1000),
  },

  refreshToken: {
    secret:
      process.env.REFRESH_TOKEN_SECRET ||
      "taskflow_refresh_token_secret_key_default_32bytes",
    expiresIn: refreshTokenExpiresIn,
    expiresInMs: parseDurationToMs(
      refreshTokenExpiresIn,
      7 * 24 * 60 * 60 * 1000,
    ),
  },
});

export default env;
