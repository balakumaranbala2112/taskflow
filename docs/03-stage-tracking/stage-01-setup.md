# Stage 01 — Project Setup & Architecture

**Project:** TaskFlow — MERN Stack Task Management System  
**Stage:** 01  
**Status:** In Progress  
**Focus:** Project initialization, folder structure, environment configuration, Express server setup, MongoDB connection, and health-check API.

---

## 1. Objective

Establish the foundation of the TaskFlow application by creating the frontend and backend projects, configuring the development environment, connecting MongoDB Atlas, and verifying communication with the Express server.

By the end of this stage, the project should have a working development environment with a React frontend, an Express backend, and a functional health-check endpoint.

---

## 2. Project Overview

TaskFlow is a full-stack task management application that allows users to organize, manage, and track their daily tasks.

The application will eventually support:

- User registration and authentication.
- Task creation, updating, and deletion.
- Task status and priority management.
- Category-based organization.
- Search, filtering, sorting, and pagination.
- Dashboard statistics.
- Secure user-specific data access.

During Stage 01, the focus is exclusively on establishing the technical foundation. Business features will be implemented in subsequent stages.

---

## 3. Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | Building the user interface |
| Vite | Development server and build tooling |
| React Router DOM | Client-side navigation |
| Axios | HTTP communication with the backend |
| Zustand | Client-side state management |
| TanStack Query | Server-state management and caching |
| Tailwind CSS | Styling and responsive layouts |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modeling |
| dotenv | Environment variable management |
| CORS | Cross-origin request configuration |
| Helmet | HTTP security headers |
| Nodemon | Automatic server restarts during development |

### Development Tools

- Visual Studio Code
- Git and GitHub
- Postman
- cURL
- MongoDB Atlas
- npm

---

## 4. Initial Project Structure

The initial project structure is organized into separate frontend, backend, CLI, and documentation directories.

```text
TaskFlow/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env.example
│   └── package.json
│
├── cli/
│
├── docs/
│   ├── 01-project-planning/
│   ├── 02-architecture/
│   ├── 03-database-design/
│   ├── 04-api-documentation/
│   ├── 05-stage-tracking/
│   ├── 06-learning-notes/
│   ├── 07-testing/
│   └── 08-deployment/
│
├── .gitignore
└── README.md
```

The folder structure will expand as new features are introduced.

---

## 5. Backend Architecture

The backend follows a layered architecture to separate HTTP handling, business logic, database operations, and configuration.

| File / Directory | Responsibility |
|---|---|
| `server.js` | Starts the HTTP server and initializes the database connection |
| `app.js` | Configures Express, middleware, and route registration |
| `config/` | Stores application and database configuration |
| `routes/` | Defines API endpoints and maps them to controllers |
| `controllers/` | Handles incoming requests and outgoing responses |
| `services/` | Contains business logic and application operations |
| `models/` | Defines MongoDB schemas using Mongoose |
| `middlewares/` | Handles authentication, validation, and errors |
| `utils/` | Contains reusable helper functions |

### Request Lifecycle

```text
Client Request
      |
      v
Express Application
      |
      v
Middleware
      |
      v
Route
      |
      v
Controller
      |
      v
Service
      |
      v
Database Model
      |
      v
MongoDB
      |
      v
HTTP Response
```

This separation improves maintainability, testability, and readability as the application grows.

---

## 6. Environment Configuration

Environment variables are used to store configuration values that should not be hardcoded into the application.

### Backend Environment Variables

| Variable | Purpose |
|---|---|
| `PORT` | Port on which the Express server listens |
| `NODE_ENV` | Application environment |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret used for signing authentication tokens |
| `CLIENT_URL` | Frontend origin allowed by CORS |

The actual `.env` file must remain private and must not be committed to Git.

A `.env.example` file should be maintained with placeholder values to help other developers configure the application.

---

## 7. Database Configuration

**Database:** MongoDB Atlas

MongoDB Atlas provides the cloud-hosted database used by TaskFlow.

During this stage:

1. Create or configure the MongoDB Atlas project.
2. Create a database cluster.
3. Configure database access credentials.
4. Configure network access.
5. Obtain the MongoDB connection string.
6. Store the connection string in the backend environment file.
7. Establish the connection using Mongoose.
8. Verify successful database connectivity.

The database will initially contain no application collections. Collections will be created as models and records are introduced in later stages.

---

## 8. Health-Check API

### Endpoint

| Property | Value |
|---|---|
| Method | GET |
| URL | `/api/health` |
| Authentication | Not required |
| Purpose | Verify backend availability |

### Expected Behavior

The endpoint should return a successful HTTP response when the backend is running.

It should provide basic information about the service status and, where configured, database connectivity.

### Example Response

```json
{
  "status": "OK",
  "message": "TaskFlow API is running"
}
```

The actual response structure should match the implementation.

### Testing

**Using cURL:**

```powershell
curl.exe http://localhost:5000/api/health
```

**Using Postman:**

1. Create a new GET request.
2. Enter `http://localhost:5000/api/health`.
3. Send the request.
4. Verify the HTTP status and response body.

### Expected Result

- The server is reachable.
- The health-check endpoint responds successfully.
- The response is valid JSON.
- The backend remains running after the request.

---

## 9. Key Concepts Learned

| Concept | Learning Outcome |
|---|---|
| Node.js | Understanding the JavaScript runtime environment |
| Express.js | Creating and configuring an HTTP server |
| REST API | Understanding client-server communication |
| Middleware | Understanding request processing |
| Environment variables | Separating configuration from source code |
| MongoDB Atlas | Understanding cloud database connectivity |
| Mongoose | Connecting Node.js applications to MongoDB |
| CORS | Understanding cross-origin browser requests |
| cURL | Testing HTTP endpoints from the terminal |
| Postman | Testing API requests and responses |
| Project architecture | Separating application responsibilities |

---

## 10. Common Issues & Troubleshooting

| Issue | Possible Cause | Troubleshooting |
|---|---|---|
| Connection refused | Backend server is not running | Start the Express server |
| Incorrect port | Client and server use different ports | Verify the configured port |
| Route not found | Health endpoint is not registered correctly | Check route registration |
| MongoDB connection failure | Invalid URI or network configuration | Verify Atlas credentials and network access |
| Environment variable undefined | Missing or incorrectly loaded `.env` file | Check environment configuration |
| CORS error | Frontend origin is not allowed | Verify CORS configuration |
| Module not found | Missing dependency or incorrect import | Verify package installation and import paths |

---

## 11. Stage Completion Checklist

### Project Setup

- [ ] Root project directory created.
- [ ] Frontend and backend directories created.
- [ ] Documentation structure created.
- [ ] Backend npm project initialized.
- [ ] React + Vite project initialized.
- [ ] Required dependencies installed.
- [ ] Environment variables configured.
- [ ] `.gitignore` configured.

### Backend

- [ ] Express application configured.
- [ ] Server entry point created.
- [ ] Middleware registered.
- [ ] Database connection configured.
- [ ] MongoDB Atlas connection verified.
- [ ] Health-check endpoint implemented.
- [ ] Server starts without errors.

### Testing

- [ ] Health endpoint tested using Postman.
- [ ] Health endpoint tested using cURL.
- [ ] Successful HTTP response verified.
- [ ] Server logs reviewed.
- [ ] Initial architecture documented.

---

## 12. Final Outcome

At the completion of Stage 01, TaskFlow should have a working development foundation consisting of:

- A React frontend initialized with Vite.
- An Express backend running locally.
- A configured MongoDB Atlas connection.
- Environment-based configuration.
- A functional health-check endpoint.
- A documented project structure.
- Verified API connectivity through Postman and cURL.

**Next Stage:** Stage 02 — Express Fundamentals & REST API Design.

The next stage will introduce task CRUD operations using temporary in-memory data to establish a clear understanding of REST APIs before integrating persistent database operations.
