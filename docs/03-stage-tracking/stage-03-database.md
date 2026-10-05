# Stage 03 — MongoDB & Mongoose Integration

## 1. Stage Overview

**Project:** TaskFlow — Personal Task Management Application  
**Stage:** 03 — MongoDB & Mongoose Integration  
**Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose

### Objective

Integrate MongoDB into the existing TaskFlow REST API and replace the temporary in-memory task store with a persistent database.

By the end of this stage, the application should support:

- Connecting to MongoDB Atlas.
- Defining a Task schema using Mongoose.
- Creating task documents.
- Fetching all tasks.
- Fetching a task by ID.
- Updating existing tasks.
- Deleting tasks.
- Validating task data through Mongoose.
- Handling database errors.
- Persisting tasks even after restarting the backend.

---

## 2. Why Do We Need a Database?

In Stage 2, we created a REST API using an in-memory JavaScript array.

Example:

```javascript
const tasks = [];

export default tasks;
```

This works for learning CRUD operations, but it has a major limitation.

**All data is lost when the server restarts.**

Imagine creating five tasks and then stopping the Node.js server. When you restart it, the array is initialized again, and all five tasks disappear.

A database solves this problem by storing data persistently.

### In-memory storage vs MongoDB

| Feature | JavaScript Array | MongoDB |
|---|---|---|
| Data persistence | No | Yes |
| Data survives server restart | No | Yes |
| Suitable for production data | No | Yes |
| Query capabilities | Basic JavaScript operations | Rich database queries |
| Data validation | Manual | Schema-based validation with Mongoose |
| Scalability | Limited | Designed for scalable data storage |

---

## 3. What Is MongoDB?

MongoDB is a NoSQL document-oriented database.

Instead of storing data in traditional rows and columns, MongoDB stores documents in collections.

### Relational database terminology vs MongoDB terminology

| Relational Database | MongoDB |
|---|---|
| Database | Database |
| Table | Collection |
| Row | Document |
| Column | Field |
| Primary key | `_id` |
| SQL query | MongoDB query |

### Example Task Document

```json
{
  "_id": "68df1234567890abcdef1234",
  "title": "Learn Node.js",
  "description": "Understand Express and Mongoose",
  "status": "in-progress",
  "priority": "high",
  "dueDate": "2026-10-10T00:00:00.000Z",
  "createdAt": "2026-10-02T10:00:00.000Z",
  "updatedAt": "2026-10-02T10:00:00.000Z"
}
```

This document represents one task stored in MongoDB.

---

## 4. What Is Mongoose?

Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.

It provides a structured way to interact with MongoDB using JavaScript.

Without Mongoose, we can communicate with MongoDB using the native MongoDB driver. Mongoose adds useful features such as:

- Schema definitions.
- Data validation.
- Model-based database operations.
- Middleware and hooks.
- Query helpers.
- Document methods.

### MongoDB vs Mongoose

| MongoDB | Mongoose |
|---|---|
| Database | ODM library |
| Stores documents | Defines how application code interacts with documents |
| Provides database operations | Provides models and schema-based validation |
| Runs as a database service | Runs inside the Node.js application |

**Mental model:** MongoDB is where the data lives. Mongoose is the tool your Node.js application uses to define, validate, and manipulate that data.

---

## 5. Updated Architecture

### Previous Architecture — Stage 2

```text
Client
  |
  v
Express Route
  |
  v
Controller
  |
  v
Service
  |
  v
In-memory JavaScript Array
```

### New Architecture — Stage 3

```text
Client
  |
  v
Express Route
  |
  v
Controller
  |
  v
Service
  |
  v
Mongoose Model
  |
  v
MongoDB Atlas
```

### Request Lifecycle

When a client creates a task:

1. The client sends a POST request.
2. Express receives the request.
3. The router directs it to the task controller.
4. The controller reads the request body.
5. The service or controller calls the Mongoose model.
6. Mongoose validates the data against the schema.
7. Mongoose sends the operation to MongoDB.
8. MongoDB stores the document.
9. Mongoose returns the created document.
10. Express sends the response to the client.

---

## 6. Required Packages

From the backend directory, install Mongoose and dotenv if they are not already installed.

```bash
npm install mongoose dotenv
```

### Package responsibilities

| Package | Responsibility |
|---|---|
| `mongoose` | MongoDB connection, models, schemas, and queries |
| `dotenv` | Loads environment variables from `.env` |
| `express` | HTTP server and routing |
| `nodemon` | Automatically restarts the server during development |

---

## 7. Environment Configuration

Create or update the backend `.env` file.

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=your_mongodb_atlas_connection_string

CLIENT_URL=http://localhost:5173
```

### Important Rules

- Never commit `.env` to GitHub.
- Add `.env` to `.gitignore`.
- Keep a `.env.example` file for documentation.
- Never share database credentials publicly.

### Example `.env.example`

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=
CLIENT_URL=http://localhost:5173
```

---

## 8. MongoDB Atlas Setup

MongoDB Atlas is a cloud-hosted MongoDB service.

### Setup procedure

1. Create a MongoDB Atlas account.
2. Create a project named `TaskFlow`.
3. Create a database cluster.
4. Create a database user with a username and password.
5. Configure network access to allow your development machine to connect.
6. Obtain the MongoDB connection string.
7. Replace the username, password, and database name in the connection string as required.
8. Add the connection string to your backend `.env` file.

### Example connection string

```text
mongodb+srv://username:password@cluster.mongodb.net/taskflow
```

The actual connection string will be different for your cluster.

**Security note:** Avoid allowing unrestricted network access in production. Configure appropriate IP access rules and database permissions.

---

## 9. Backend Structure

The following files are introduced or updated during Stage 3.

```text
backend/
└── src/
    ├── config/
    │   └── db.js
    │
    ├── models/
    │   └── task.model.js
    │
    ├── routes/
    │   ├── index.js
    │   └── task.routes.js
    │
    ├── controllers/
    │   └── task.controller.js
    │
    ├── services/
    │   └── task.service.js
    │
    ├── middlewares/
    │   └── error.middleware.js
    │
    ├── app.js
    └── server.js
```

The exact structure may differ slightly depending on the existing Stage 2 implementation.

---

## 10. Database Connection

Create a dedicated database configuration module.

**File:** `src/config/db.js`

Responsibilities:

- Import Mongoose.
- Read the MongoDB connection string.
- Establish a database connection.
- Log successful connections.
- Handle connection failures.

### Why separate the database connection?

Keeping database configuration separate from `server.js` improves organization and makes the application easier to maintain.

### Important startup rule

The Express server should begin listening only after MongoDB connects successfully.

```text
Start application
      |
      v
Connect to MongoDB
      |
      +---- Connection successful
      |           |
      |           v
      |      Start Express server
      |
      +---- Connection failed
                  |
                  v
             Log error
             Exit process
```

This prevents the application from accepting requests when its required database is unavailable.

---

## 11. Task Schema Design

Create the Mongoose schema in:

`src/models/task.model.js`

### Task fields

| Field | Type | Required | Default |
|---|---|---|---|
| `title` | String | Yes | — |
| `description` | String | Yes | — |
| `status` | String | No | `todo` |
| `priority` | String | No | `medium` |
| `dueDate` | Date | No | — |
| `createdAt` | Date | Automatic | Current timestamp |
| `updatedAt` | Date | Automatic | Current timestamp |

### Status values

```text
todo
in-progress
completed
```

### Priority values

```text
low
medium
high
```

### Schema responsibilities

- Ensure required fields are provided.
- Restrict status to allowed values.
- Restrict priority to allowed values.
- Apply defaults when optional values are omitted.
- Automatically maintain timestamps.

### Why use timestamps?

With the Mongoose option:

```javascript
{
  timestamps: true
}
```

Mongoose automatically manages:

- `createdAt` — when the document was created.
- `updatedAt` — when the document was last updated.

These fields are useful for sorting tasks, tracking activity, and building dashboards.

---

## 12. CRUD Operations Using Mongoose

### 12.1 Create a Task

Mongoose method:

```javascript
Task.create()
```

Purpose:

- Creates a new task document.
- Validates the document against the schema.
- Saves the document to MongoDB.
- Returns the created document.

Expected HTTP status:

`201 Created`

### 12.2 Fetch All Tasks

Mongoose method:

```javascript
Task.find()
```

Purpose:

- Retrieves matching documents.
- Returns an array of task documents.
- Returns an empty array if no tasks exist.

Expected HTTP status:

`200 OK`

### 12.3 Fetch Task by ID

Mongoose method:

```javascript
Task.findById(taskId)
```

Purpose:

- Searches for a document using its MongoDB `_id`.
- Returns the matching document or `null`.

Expected HTTP statuses:

- `200 OK` when the task exists.
- `404 Not Found` when the task does not exist.
- `400 Bad Request` when the supplied ID is invalid.

### 12.4 Update a Task

Mongoose method:

```javascript
Task.findByIdAndUpdate(taskId, updateData, {
  new: true,
  runValidators: true,
});
```

Important options:

| Option | Meaning |
|---|---|
| `new: true` | Return the updated document |
| `runValidators: true` | Apply schema validators to updated values |

Expected HTTP statuses:

- `200 OK` when the task is updated.
- `404 Not Found` when the task does not exist.
- `400 Bad Request` when the ID or updated data is invalid.

### 12.5 Delete a Task

Mongoose method:

```javascript
Task.findByIdAndDelete(taskId)
```

Purpose:

- Finds a document by ID.
- Deletes it from MongoDB.
- Returns the deleted document or `null`.

Expected HTTP statuses:

- `200 OK` when the task is deleted.
- `404 Not Found` when the task does not exist.
- `400 Bad Request` when the ID is invalid.

---

## 13. API Endpoints

The existing Stage 2 API contract remains unchanged.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/tasks` | Fetch all tasks |
| POST | `/api/v1/tasks` | Create a task |
| GET | `/api/v1/tasks/:taskId` | Fetch a task by ID |
| PATCH | `/api/v1/tasks/:taskId` | Update a task |
| DELETE | `/api/v1/tasks/:taskId` | Delete a task |

The important change is behind the API: data is now stored in MongoDB rather than a JavaScript array.

---

## 14. Error Handling

Database operations can fail for several reasons:

- MongoDB connection issues.
- Invalid ObjectId values.
- Mongoose validation failures.
- Missing documents.
- Unexpected server errors.

### Common error types

| Error | Meaning | Expected Handling |
|---|---|---|
| `ValidationError` | Document violates schema rules | 400 |
| `CastError` | Invalid value for a Mongoose type | 400 |
| Missing document | No matching task exists | 404 |
| Unexpected database failure | Database operation failed | 500 |

### Important distinction

A database operation that returns `null` is not necessarily an exception.

For example:

```javascript
const task = await Task.findById(taskId);
```

If the task doesn't exist, Mongoose normally returns `null`. It does not automatically throw a not-found error.

The controller must check for this case and return an appropriate response.

Centralized error handling and reusable asynchronous error utilities will be developed further in Stage 6.

---

## 15. Testing Strategy

Use Postman or cURL to test the API.

### Test 1 — Create a Task

Request:

```http
POST /api/v1/tasks
```

Body:

```json
{
  "title": "Learn MongoDB",
  "description": "Understand Mongoose CRUD operations",
  "status": "in-progress",
  "priority": "high"
}
```

Verify:

- Response status is `201`.
- A task document is returned.
- MongoDB contains the new document.
- `createdAt` and `updatedAt` are generated.

### Test 2 — Fetch All Tasks

Request:

```http
GET /api/v1/tasks
```

Verify:

- Response status is `200`.
- The response contains an array.
- Created tasks appear in the result.

### Test 3 — Fetch a Task by ID

Request:

```http
GET /api/v1/tasks/<taskId>
```

Verify:

- The correct task is returned.
- A nonexistent ID returns `404`.
- An invalid ID returns `400`.

### Test 4 — Update a Task

Request:

```http
PATCH /api/v1/tasks/<taskId>
```

Body:

```json
{
  "status": "completed"
}
```

Verify:

- Response status is `200`.
- The status changes to `completed`.
- `updatedAt` changes.
- Other task fields remain unchanged.

### Test 5 — Delete a Task

Request:

```http
DELETE /api/v1/tasks/<taskId>
```

Verify:

- Response status is `200`.
- The task is removed from MongoDB.
- Fetching the deleted task returns `404`.

### Test 6 — Persistence Verification

1. Create multiple tasks.
2. Stop the backend server.
3. Restart the backend.
4. Fetch all tasks again.

Expected result:

Previously created tasks should still exist.

This confirms that the application is using persistent MongoDB storage rather than temporary in-memory data.

---

## 16. Common Problems and Troubleshooting

### Problem 1 — MongoDB connection failure

Possible causes:

- Incorrect connection string.
- Incorrect database credentials.
- IP address not allowed in Atlas.
- Network or DNS connectivity issues.

Check the MongoDB connection string and Atlas network access settings.

### Problem 2 — `Operation buffering timed out`

Possible causes:

- Database connection was not established.
- The server accepted requests before MongoDB connected.
- MongoDB became unavailable.

Ensure the server starts only after a successful database connection.

### Problem 3 — Invalid ObjectId

Possible cause:

A client sent an invalid MongoDB ID.

Solution:

Validate IDs before performing database operations using:

```javascript
mongoose.isValidObjectId(taskId)
```

### Problem 4 — Validation error

Possible causes:

- Missing required fields.
- Invalid status.
- Invalid priority.
- Incorrect field types.

Check the request body and compare it with the Task schema.

### Problem 5 — Data disappears after restart

Possible cause:

The application is still using the in-memory array rather than MongoDB.

Verify that all CRUD operations use the Mongoose model.

---

## 17. Key Concepts Learned

By completing Stage 3, you should be able to explain:

1. What MongoDB is.
2. What MongoDB Atlas is.
3. The difference between SQL and NoSQL databases.
4. What a collection and document are.
5. What Mongoose is.
6. The difference between a schema and a model.
7. How Mongoose connects to MongoDB.
8. How `Model.create()` works.
9. How `Model.find()` works.
10. How `Model.findById()` works.
11. How `Model.findByIdAndUpdate()` works.
12. How `Model.findByIdAndDelete()` works.
13. Why `runValidators` is important.
14. What MongoDB ObjectId represents.
15. Why database operations are asynchronous.
16. Why a server should wait for database connectivity before accepting requests.
17. Why persistent storage is necessary for real applications.

---

## 18. Stage Completion Checklist

### Database Setup

- [ ] MongoDB Atlas cluster created.
- [ ] Database user configured.
- [ ] Network access configured.
- [ ] Connection string added to `.env`.
- [ ] `.env` excluded from Git.
- [ ] Mongoose connection successful.

### Data Modeling

- [ ] Task schema created.
- [ ] Required fields configured.
- [ ] Status enum configured.
- [ ] Priority enum configured.
- [ ] Default values configured.
- [ ] Timestamps enabled.

### CRUD Operations

- [ ] Create task works.
- [ ] Fetch all tasks works.
- [ ] Fetch task by ID works.
- [ ] Update task works.
- [ ] Delete task works.
- [ ] Missing tasks return 404.
- [ ] Invalid IDs are handled correctly.
- [ ] Validation errors are handled correctly.

### Verification

- [ ] All endpoints tested using Postman or cURL.
- [ ] Documents visible in MongoDB Atlas.
- [ ] Data persists after server restart.
- [ ] Temporary in-memory task store removed.
- [ ] Stage documentation completed.

---

## 19. Final Outcome

At the end of Stage 3, TaskFlow has transitioned from a temporary in-memory REST API to a database-backed REST API.

The application now supports persistent task storage, Mongoose schema validation, and complete CRUD operations.

**Next Stage: Stage 04 — Authentication System**

In Stage 4, we will introduce:

- User registration.
- User login.
- User schema.
- Password hashing using bcrypt.
- JWT token generation.
- Duplicate email handling.
- Secure authentication responses.

This will establish the identity foundation required to build a secure multi-user task management application.