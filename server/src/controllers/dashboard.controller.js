import { getDashboardStats } from "../services/dashboard.service.js";

import { sendSuccess } from "../utils/apiResponse.js";

export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const stats = await getDashboardStats(userId);

    return sendSuccess(
      res,
      200,
      "Dashboard statistics fetched successfully",
      stats,
    );
  } catch (error) {
    next(error);
  }
};
