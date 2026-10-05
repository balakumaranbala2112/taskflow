import jwt from "jsonwebtoken";
import env from "../config/env.js";

// Access token generation
export const generateAccessToken = (userId) => {
  return jwt.sign({ userId: userId.toString() }, env.accessToken.secret, {
    expiresIn: env.accessToken.expiresIn,
  });
};

// Refresh token generation
export const generateRefreshToken = (userId) => {
  return jwt.sign({ userId: userId.toString() }, env.refreshToken.secret, {
    expiresIn: env.refreshToken.expiresIn,
  });
};

// Access token verification
export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.accessToken.secret);
};

// Refresh token verification
export const verifyRefreshAuthToken = (token) => {
  return jwt.verify(token, env.refreshToken.secret);
};
