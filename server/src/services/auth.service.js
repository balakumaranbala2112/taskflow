import env from "../config/env.js";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import RefreshToken from "../models/refreshToken.model.js";
import AppError from "../utils/AppError.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshAuthToken,
} from "../utils/token.utils.js";

const createAuthSession = async (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const expiresAt = new Date(Date.now() + env.refreshToken.expiresInMs);

  await RefreshToken.create({
    user: userId,
    tokenHash,
    expiresAt,
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new AppError("User already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, env.salt);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  const session = await createAuthSession(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password",
  );

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const session = await createAuthSession(user._id);

  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  };
};

export const refreshAuthSession = async (refreshToken) => {
  // 1. Ensure refresh token exists
  if (!refreshToken) {
    throw new AppError("Refresh token is required", 400);
  }

  // 2. Verify refresh token signature and expiration
  let decoded;

  try {
    decoded = verifyRefreshAuthToken(refreshToken);
  } catch (err) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  // 3. Hash the incoming refresh token
  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  // 4. Find a valid, non-revoked refresh token
  const storedToken = await RefreshToken.findOne({
    tokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!storedToken) {
    throw new AppError("Refresh token is invalid or revoked", 401);
  }

  // 5. Find the associated user
  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new AppError("User associated with this token no longer exists", 401);
  }

  // 6. Revoke the old refresh token (rotation)
  storedToken.revokedAt = new Date();
  await storedToken.save();

  // 7. Create a new authentication session
  const session = await createAuthSession(user._id);

  // 8. Return new tokens and user details
  return {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  };
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  const tokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  await RefreshToken.findOneAndUpdate(
    {
      tokenHash,
      revokedAt: null,
    },
    {
      $set: {
        revokedAt: new Date(),
      },
    },
  );
};
