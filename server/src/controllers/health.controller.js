// GET /
export const getHome = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to TaskFlow API",
  });
};

// GET /health
export const getHealth = (req, res) => {
  return res.status(200).json({
    success: true,
    status: "OK",
    message: "TaskFlow API is running",
  });
};

// GET /api/v1
export const getApiVersion = (req, res) => {
  return res.status(200).json({
    success: true,
    version: "v1",
    message: "TaskFlow API v1",
  });
};
