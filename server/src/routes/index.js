import { Router } from "express";
import {
  getApiVersion,
  getHealth,
  getHome,
} from "../controllers/health.controller.js";

const router = Router();

router.get("/", getHome);

router.get("/api/health", getHealth);

router.get("/api/v1", getApiVersion);

export default router;
