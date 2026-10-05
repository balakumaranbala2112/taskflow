import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import YAML from "yaml";
import swaggerUi from "swagger-ui-express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read openapi.yaml from server/docs
const openapiPath = path.resolve(__dirname, "../../docs/openapi.yaml");
const openapiFile = fs.readFileSync(openapiPath, "utf8");
export const openapiDocument = YAML.parse(openapiFile);

/**
 * Mounts Swagger UI and raw OpenAPI JSON specification onto Express app.
 * @param {import('express').Express} app - Express application instance
 */
export const setupSwagger = (app) => {
  // Expose raw OpenAPI JSON spec
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.json(openapiDocument);
  });

  // Custom UI styling
  const swaggerUiOptions = {
    customSiteTitle: "TaskFlow API Docs",
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
    },
  };

  // Mount Swagger UI at /api-docs
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(openapiDocument, swaggerUiOptions),
  );
};

export default setupSwagger;
