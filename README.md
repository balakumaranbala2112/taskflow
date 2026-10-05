# TaskFlow — Modern Full-Stack Task & Workflow Management

TaskFlow is a production-ready, performant, and secure RESTful backend API designed for task organization, categorization, analytics, and workflow management. Built with modern Node.js, Express 5, MongoDB / Mongoose 9, and Zod validation.

---

## 🚀 Tech Stack & Architecture

- **Runtime**: Node.js (ESM `"type": "module"`)
- **Web Framework**: [Express 5](https://expressjs.com/)
- **API Documentation**: [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express) & OpenAPI 3.0.3
- **Database & ODM**: MongoDB with [Mongoose 9](https://mongoosejs.com/)
- **Schema Validation**: [Zod 4](https://zod.dev/)
- **Authentication**: JWT (Access Token + Rotating Refresh Token stored in HttpOnly Cookies & MongoDB TTL collections) + `bcrypt`
- **Security**: `helmet`, `cors`, `hpp`, `express-rate-limit`
- **Test Runner**: [Vitest](https://vitest.dev/) & [Supertest](https://github.com/ladjs/supertest)

```
Client ──▶ Express ──▶ Helmet / CORS / HPP / Rate Limiter
                      ──▶ Cookie Parser / JSON Parser (100kb limit)
                      ──▶ Swagger UI (/api-docs, /api-docs.json)
                      ──▶ Router ──▶ Zod Validator ──▶ Auth Protect (JWT)
                                                  ──▶ Controller ──▶ Service ──▶ Mongoose / MongoDB
                                                  ──▶ Centralized Error Handler
```

---

## 📖 Interactive API Documentation

TaskFlow includes an interactive Swagger UI documentation interface and raw OpenAPI 3.0 spec:

- **Swagger UI Interface**: [`http://localhost:5000/api-docs`](http://localhost:5000/api-docs)
- **Raw OpenAPI JSON Spec**: [`http://localhost:5000/api-docs.json`](http://localhost:5000/api-docs.json)
- **OpenAPI YAML Spec File**: [`server/docs/openapi.yaml`](server/docs/openapi.yaml)
- **OpenAPI JSON Spec File**: [`server/docs/openapi.json`](server/docs/openapi.json)

For detailed endpoint documentation notes and Swagger authorization instructions, see [API_DOCUMENTATION_SUMMARY.md](API_DOCUMENTATION_SUMMARY.md).

---

## 🛠️ Project Structure

```
taskflow/
├── .editorconfig                # Global formatting standard (LF, 2 spaces)
├── API_DOCUMENTATION_SUMMARY.md # Complete API doc statistics & Swagger authorization guide
├── README.md                    # Project documentation
└── server/
    ├── .env.example             # Environment variables template
    ├── package.json             # Scripts & dependencies
    ├── docs/
    │   ├── openapi.yaml         # Centralized OpenAPI 3.0.3 YAML definition
    │   └── openapi.json         # Exported OpenAPI 3.0.3 JSON for Postman / API tools
    ├── src/
    │   ├── server.js            # Entry point, graceful shutdown & uncaught rejection handlers
    │   ├── app.js               # Express application initialization & middleware stack
    │   ├── config/
    │   │   ├── db.js            # MongoDB connection manager
    │   │   ├── env.js           # Centralized, immutable environment configuration
    │   │   └── swagger.js       # Swagger UI configuration & OpenAPI spec loader
    │   ├── controllers/         # Thin HTTP request & response handlers
    │   ├── services/            # Business logic, aggregation pipelines & data access
    │   ├── models/              # Mongoose schemas & compound indexes
    │   ├── middlewares/         # Auth, Zod validation, rate limiting & global error handling
    │   ├── validations/         # Strict Zod schemas for query, params, and body
    │   ├── routes/              # Express 5 versioned route definitions
    │   └── utils/               # AppError, token utilities & standardized apiResponse
    └── tests/                   # Automated Vitest & Supertest test suites
```

---

## ⚙️ Environment Variables

Create a `server/.env` file with the following keys (see [server/.env.example](server/.env.example)):

| Variable | Type | Default | Description |
|---|---|---|---|
| `PORT` | Number | `5000` | Port for the Express HTTP server |
| `NODE_ENV` | String | `development` | `development` or `production` |
| `CLIENT_URL` | String | `http://localhost:3000` | Allowed frontend origin for CORS |
| `MONGODB_URI` | String | `mongodb://localhost:27017/taskflow` | MongoDB connection URI |
| `SALT_ROUNDS` | Number | `10` | bcrypt hashing cost factor |
| `ACCESS_TOKEN_SECRET` | String | *Required in prod* | Secret key for access JWTs |
| `ACCESS_TOKEN_EXPIRES_IN`| String | `15m` | Lifetime of access token (e.g., `15m`) |
| `REFRESH_TOKEN_SECRET` | String | *Required in prod* | Secret key for refresh JWTs |
| `REFRESH_TOKEN_EXPIRES_IN`| String | `7d` | Lifetime of refresh token (e.g., `7d`) |

---

## 📡 API Reference Overview

All responses follow a consistent envelope contract:
```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... }
}
```

### 1. Health & Info
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/` | Welcome message | Public |
| `GET` | `/api/health` | Service health status | Public |
| `GET` | `/api/v1` | API version metadata | Public |
| `GET` | `/api-docs` | Interactive Swagger UI | Public |
| `GET` | `/api-docs.json` | Raw OpenAPI 3.0.3 specification | Public |

### 2. Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new user account | Public |
| `POST` | `/api/v1/auth/login` | Login user & issue tokens | Public |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile | Bearer Token |
| `POST` | `/api/v1/auth/refresh` | Rotate and issue new access & refresh tokens | Cookie / Body |
| `POST` | `/api/v1/auth/logout` | Revoke session & clear auth cookies | Public / Auth |

### 3. Task Management (`/api/v1/tasks`)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/v1/tasks?page=1&limit=10` | Get paginated tasks for current user | Bearer Token |
| `POST` | `/api/v1/tasks` | Create new task | Bearer Token |
| `GET` | `/api/v1/tasks/:taskId` | Get task details by ID | Bearer Token |
| `PATCH` | `/api/v1/tasks/:taskId` | Update task details | Bearer Token |
| `DELETE` | `/api/v1/tasks/:taskId` | Soft-delete task (move to trash) | Bearer Token |
| `PATCH` | `/api/v1/tasks/:taskId/restore` | Restore soft-deleted task | Bearer Token |
| `GET` | `/api/v1/tasks/trash?page=1&limit=10` | Get paginated soft-deleted tasks | Bearer Token |
| `GET` | `/api/v1/tasks/search?...` | Search, filter, and sort tasks with pagination | Bearer Token |

### 4. Categories (`/api/v1/categories`)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/v1/categories` | Get all categories for current user | Bearer Token |
| `POST` | `/api/v1/categories` | Create user category | Bearer Token |
| `GET` | `/api/v1/categories/:categoryId` | Get category by ID | Bearer Token |
| `PATCH` | `/api/v1/categories/:categoryId` | Update category details | Bearer Token |
| `DELETE` | `/api/v1/categories/:categoryId` | Delete category & nullify task references | Bearer Token |

### 5. Analytics Dashboard (`/api/v1/dashboard`)
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/v1/dashboard/stats` | Aggregated metrics (status, priority, categories) via `$facet` | Bearer Token |

---

## 🧪 Testing

TaskFlow includes comprehensive automated unit and integration tests covering utilities, token verification, Zod validation, error handling, API routes, and Swagger endpoints.

Run the test suite:
```bash
cd server
npm test
```

Watch mode for development:
```bash
npm run test:watch
```

---

## 🏃 Getting Started Locally

1. **Clone and navigate**:
   ```bash
   cd taskflow/server
   ```
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment**:
   ```bash
   cp .env.example .env
   ```
4. **Start the development server**:
   ```bash
   npm run dev
   ```
   - API Server: `http://localhost:5000`
   - Interactive Swagger UI: `http://localhost:5000/api-docs`
