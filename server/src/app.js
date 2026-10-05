import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import env from "./config/env.js";
import errorHandler from "./middlewares/error.middleware.js";
import notFound from "./middlewares/notFound.middleware.js";
import { authLimiter, apiLimiter } from "./middlewares/rateLimit.middleware.js";
import setupSwagger from "./config/swagger.js";

/* Routes */
import indexRoutes from "./routes/index.js";
import taskRoutes from "./routes/task.routes.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

/* Security & parsing middlewares */
app.use(
  helmet({
    contentSecurityPolicy: false, // Required for Swagger UI static and inline styling
  }),
);

app.use(
  cors({
    origin: env.clientUrl,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

// Body parser with explicit limit
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(hpp());

/* Swagger Documentation */
setupSwagger(app);

/* API Routes */
app.use("/", indexRoutes);

// Authentication routes (dedicated strict limiter)
app.use("/api/v1/auth", authLimiter, authRoutes);

// Protected resource routes (API limiter applied across all data endpoints)
app.use("/api/v1/tasks", apiLimiter, taskRoutes);
app.use("/api/v1/categories", apiLimiter, categoryRoutes);
app.use("/api/v1/dashboard", apiLimiter, dashboardRoutes);

/* 404 Handler */
app.use(notFound);

/* Global Error Handler */
app.use(errorHandler);

export default app;
