import env from "../config/env.js";
import {
  registerUser,
  loginUser,
  refreshAuthSession,
  logoutUser,
} from "../services/auth.service.js";
import AppError from "../utils/AppError.js";

const getCookieOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  maxAge: env.refreshToken.expiresInMs,
  path: "/",
});

// Register controller
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.validatedData.body;

    const result = await registerUser({
      name,
      email,
      password,
    });

    res.cookie("refreshToken", result.refreshToken, getCookieOptions());

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Login controller
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.validatedData.body;

    const result = await loginUser({
      email,
      password,
    });

    res.cookie("refreshToken", result.refreshToken, getCookieOptions());

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET ME
export const getMe = async (req, res, next) => {
  try {
    const user = req.user;

    return res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Logout controller
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (refreshToken) {
      await logoutUser(refreshToken);
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: env.nodeEnv === "production",
      sameSite: env.nodeEnv === "production" ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Refresh Token controller
export const refreshToken = async (req, res, next) => {
  try {
    // 1. Read refresh token from HttpOnly cookie or request body
    const token = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!token) {
      throw new AppError("Refresh token is required in cookie or body", 400);
    }

    // 2. Pass the token to the service
    const result = await refreshAuthSession(token);

    // 3. Set the newly generated refresh token as cookie
    res.cookie("refreshToken", result.refreshToken, getCookieOptions());

    // 4. Return new tokens and user data
    return res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
