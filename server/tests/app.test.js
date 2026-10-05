import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";

describe("Application Route Integration Tests", () => {
  it("GET / should return welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Welcome to TaskFlow API");
  });

  it("GET /api/health should return running status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe("OK");
    expect(res.body.message).toBe("TaskFlow API is running");
  });

  it("GET /api/v1 should return API version info", async () => {
    const res = await request(app).get("/api/v1");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.version).toBe("v1");
  });

  it("GET /api-docs.json should return raw OpenAPI specification", async () => {
    const res = await request(app).get("/api-docs.json");
    expect(res.status).toBe(200);
    expect(res.body.openapi).toBe("3.0.3");
    expect(res.body.info.title).toBe("TaskFlow API");
    expect(res.body.paths["/api/v1/tasks"]).toBeDefined();
    expect(res.body.paths["/api/v1/auth/login"]).toBeDefined();
  });

  it("GET /api-docs/ should serve Swagger UI HTML", async () => {
    const res = await request(app).get("/api-docs/");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("text/html");
  });

  it("GET /unknown-route should return 404 with standard shape", async () => {
    const res = await request(app).get("/unknown-route");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toContain("Route not Found");
  });

  it("POST /api/v1/auth/register should fail validation if body is empty", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it("GET /api/v1/tasks without auth header should fail with 401", async () => {
    const res = await request(app).get("/api/v1/tasks");
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Authentication token is required");
  });
});
