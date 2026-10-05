# Stage 02 — Express Fundamentals & REST API Design

**Project:** TaskFlow — Task Management REST API  
**Stage:** 02  
**Status:** Completed

## 1. Objective

The objective of this stage was to understand Express.js fundamentals and build a RESTful API for managing tasks.

This stage focused on understanding how HTTP requests flow through an Express application, designing REST endpoints, implementing CRUD operations, handling errors, and testing APIs using Postman and cURL.

## 2. Concepts Learned

- Express.js application setup and configuration
- Request and response objects (`req` and `res`)
- HTTP methods: GET, POST, PATCH, DELETE
- REST API principles and resource-based URL design
- Route creation and route mounting
- Controllers and separation of concerns
- Middleware and JSON request parsing
- HTTP status codes
- Request body and URL parameter handling
- Error handling and consistent JSON responses
- API testing using Postman and cURL

## 3. Project Structure

```text
src/
├── controllers/
│   └── task.controller.js
├── routes/
│   ├── index.js
│   └── task.routes.js
├── services/
│   └── task.service.js
├── data/
│   └── task.store.js
├── app.js
└── server.js
```

**Responsibilities:**

- `app.js` — Configures Express, middleware, and route mounting.
- `server.js` — Starts the HTTP server.
- `routes/` — Defines API endpoints and connects them to controllers.
- `controllers/` — Handles HTTP requests and sends responses.
- `services/` — Contains task-related business logic.
- `data/` — Stores temporary in-memory task data.

## 4. Task Resource Design

The Task resource was designed with the following fields:

| Field | Type | Description |
|---|---|---|
| id | String | Unique task identifier |
| title | String | Task title |
| description | String | Task details |
| status | String | Current task status |
| priority | String | Task priority |
| dueDate | Date | Task deadline |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Last modification timestamp |

Allowed status values:

- `todo`
- `in-progress`
- `completed`

Allowed priority values:

- `low`
- `medium`
- `high`

## 5. REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Retrieve all tasks |
| GET | `/api/tasks/:id` | Retrieve a task by ID |
| POST | `/api/tasks` | Create a new task |
| PATCH | `/api/tasks/:id` | Update an existing task |
| DELETE | `/api/tasks/:id` | Delete a task |

## 6. HTTP Status Codes

| Status Code | Meaning | Usage |
|---|---|---|
| 200 | OK | Successful retrieval, update, or deletion |
| 201 | Created | Task successfully created |
| 400 | Bad Request | Invalid request data |
| 404 | Not Found | Task does not exist |
| 500 | Internal Server Error | Unexpected server-side error |

## 7. Request and Response Examples

### Create Task

**Request:**

```http
POST /api/tasks
Content-Type: application/json
```

```json
{
  "title": "Learn Express.js",
  "description": "Understand REST API development",
  "status": "todo",
  "priority": "high"
}
```

**Expected response:** `201 Created`

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "1",
    "title": "Learn Express.js",
    "description": "Understand REST API development",
    "status": "todo",
    "priority": "high"
  }
}
```

### Get All Tasks

**Request:**

```http
GET /api/tasks
```

**Expected response:** `200 OK`

```json
{
  "success": true,
  "data": []
}
```

### Get Task by ID

**Request:**

```http
GET /api/tasks/1
```

**Expected response:** `200 OK`

Returns the matching task or `404 Not Found` if it does not exist.

### Update Task

**Request:**

```http
PATCH /api/tasks/1
Content-Type: application/json
```

```json
{
  "status": "completed"
}
```

**Expected response:** `200 OK`

Returns the updated task.

### Delete Task

**Request:**

```http
DELETE /api/tasks/1
```

**Expected response:** `200 OK` or `204 No Content`, depending on the implemented response format.

## 8. Testing

The endpoints were tested using Postman and cURL.

Testing covered:

- Successful task creation
- Retrieving all tasks
- Retrieving a task by ID
- Updating task fields
- Deleting a task
- Handling invalid task IDs
- Handling missing tasks
- Handling malformed request bodies
- Verifying HTTP status codes and JSON responses

## 9. Challenges and Solutions

| Challenge | Solution |
|---|---|
| Understanding route mounting | Separated main routes and task routes |
| Mixing business logic with route definitions | Introduced controller and service layers |
| Handling missing task IDs | Added appropriate 404 responses |
| Inconsistent API responses | Standardized JSON response structure |
| Understanding HTTP status codes | Applied status codes based on operation results |
| Testing API requests | Used Postman and cURL |

## 10. Completion Checklist

- [x] Set up Express.js application
- [x] Configured JSON middleware
- [x] Designed RESTful task endpoints
- [x] Implemented CRUD operations
- [x] Separated routes and controllers
- [x] Understood HTTP status codes
- [x] Implemented error handling
- [x] Tested endpoints using API clients
- [x] Understood the request-response lifecycle

## 11. Key Takeaways

By completing this stage, I developed a practical understanding of Express.js and REST API development.

I learned how to structure a backend application, design resource-based endpoints, handle client requests, implement CRUD operations, and return meaningful HTTP responses.

The in-memory implementation established the foundation for integrating MongoDB and Mongoose in the subsequent stages.

---

**Next Stage:** MongoDB & Mongoose Integration
