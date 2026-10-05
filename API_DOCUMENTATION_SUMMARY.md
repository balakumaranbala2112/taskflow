# TaskFlow API — OpenAPI 3.0 Documentation Summary

This document summarizes the complete OpenAPI 3.0.3 specification and interactive Swagger UI setup for the TaskFlow backend.

---

## 📊 Documentation Statistics

| Module | Tag | Endpoints Documented | Security Scheme |
|---|---|---|---|
| **General** | `General` | 3 (`/`, `/api/health`, `/api/v1`) | None (Public) |
| **Authentication** | `Auth` | 5 (`register`, `login`, `me`, `refresh`, `logout`) | `bearerAuth`, `cookieAuth` |
| **Tasks** | `Tasks` | 8 (`list`, `create`, `getById`, `update`, `delete`, `restore`, `trash`, `search`) | `bearerAuth` |
| **Categories** | `Categories` | 5 (`list`, `create`, `getById`, `update`, `delete`) | `bearerAuth` |
| **Dashboard** | `Dashboard` | 1 (`stats`) | `bearerAuth` |
| **TOTAL** | — | **22 Endpoints** | **100% Spec Coverage** |

---

## 🌐 How to Access the Documentation

### 1. Interactive Swagger UI
When the development or production server is running:
- **URL**: `http://localhost:5000/api-docs`

### 2. Raw OpenAPI 3.0 JSON Specification
- **URL**: `http://localhost:5000/api-docs.json`
- **File**: `server/docs/openapi.json`

### 3. Raw OpenAPI 3.0 YAML Specification
- **File**: `server/docs/openapi.yaml`

---

## 🔑 Authentication Guide in Swagger UI

### Step 1: Obtain a JWT Access Token
1. In Swagger UI, expand the **`Auth`** tag.
2. Open the **`POST /api/v1/auth/login`** (or **`POST /api/v1/auth/register`**) endpoint.
3. Click **Try it out** and execute with valid credentials:
   ```json
   {
     "email": "jane.doe@example.com",
     "password": "StrongP@ssword123"
   }
   ```
4. Copy the `accessToken` string from the `200` JSON response.

### Step 2: Authorize in Swagger UI
1. Scroll to the top of Swagger UI and click the green **`Authorize 🔓`** button.
2. In the **`bearerAuth`** field, paste your JWT token.
3. Click **Authorize** then **Close**.
4. The lock icon will change to locked (🔒). All subsequent requests under `Tasks`, `Categories`, and `Dashboard` will automatically include the `Authorization: Bearer <token>` header.

---

## 🚀 How to Import into Postman / Insomnia

1. Open Postman.
2. Click **Import** (top left).
3. Select file `taskflow/server/docs/openapi.json` (or `taskflow/server/docs/openapi.yaml`), or choose **Link** and enter:
   ```
   http://localhost:5000/api-docs.json
   ```
4. Postman will automatically generate a complete Collection with all 22 requests, headers, route parameters, and schema validations.

---

## 📝 How to Add or Update Documentation for Future Endpoints

TaskFlow maintains a centralized, single-source-of-truth specification in `server/docs/openapi.yaml`.

To document a new route:
1. Open `server/docs/openapi.yaml`.
2. Under `paths:`, define the path, HTTP method, `tags`, `summary`, `operationId`, `parameters`, `requestBody`, and all `responses`.
3. If new data structures are introduced, define reusable schemas under `components.schemas`.
4. Validate the updated specification:
   ```bash
   cd server
   npx swagger-cli validate docs/openapi.yaml
   ```
5. Regenerate the JSON export:
   ```bash
   npm test
   ```
   Swagger UI will automatically reload the updated documentation without requiring any server rebuilds.
