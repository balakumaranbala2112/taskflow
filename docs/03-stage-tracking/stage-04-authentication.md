# Stage 04 — Authentication System

## 1. Stage Overview

**Project:** TaskFlow — Personal Task Management Application  
**Stage:** 04 — Authentication System  
**Backend:** Node.js, Express.js, MongoDB, Mongoose  
**Security:** bcrypt, JSON Web Tokens (JWT)

### Objective

Implement a secure authentication system that allows users to:

- Register a new account.
- Store passwords securely using bcrypt hashing.
- Log in using email and password.
- Verify credentials during login.
- Generate a JWT access token after successful authentication.
- Receive consistent API responses.
- Handle duplicate emails and invalid credentials.

At the end of this stage, TaskFlow will support user registration and login. Protected routes and user-specific task access will be implemented in Stage 5.

---

## 2. Why Do We Need Authentication?

Imagine TaskFlow is used by two people:

- Balakumaran
- Arun

Both users create their own tasks.

Without authentication, the backend cannot reliably identify who is making a request. Anyone who knows a task ID could potentially access or modify that task.

Authentication solves the identity problem.

When a user logs in successfully, the backend issues a token that represents the authenticated user.

The token can be sent with subsequent requests so the backend can verify the user's identity.

### Authentication vs Authorization

| Concept | Meaning | TaskFlow Example |
|---|---|---|
| Authentication | Verifying who the user is | Checking email and password |
| Authorization | Checking what the user can access | Allowing a user to access only their own tasks |

**Stage 4 focuses on authentication. Stage 5 introduces authorization.**

---

## 3. Concepts to Understand

### 3.1 Password Hashing

Never store plain-text passwords in MongoDB.

For example, suppose a user registers with:

`MyPassword@123`

Storing the original password is dangerous because anyone who gains access to the database could read it.

Instead, we use bcrypt to generate a password hash.

Example:

```text
Original password:
MyPassword@123

Stored hash:
$2b$10$...
```

During login, bcrypt compares the entered password against the stored hash.

We do not decrypt the hash. Password hashing is designed to be a one-way process.

### 3.2 What Is bcrypt?

bcrypt is a password-hashing library designed to make password guessing computationally expensive.

Important methods:

| Method | Purpose |
|---|---|
| `bcrypt.hash()` | Generate a password hash |
| `bcrypt.compare()` | Compare a plain password with a stored hash |

Example:

```javascript
const hashedPassword = await bcrypt.hash(password, 10);
```

The number `10` is the cost factor, also called the salt rounds setting.

A higher cost factor generally increases the work required to calculate a hash. Choose it based on your application's performance and security requirements.

### 3.3 What Is JWT?

JWT stands for JSON Web Token.

It is a compact, signed token that can carry claims about a user.

A JWT typically contains three parts:

```text
Header.Payload.Signature
```

The backend creates a token after successful login.

Example payload:

```json
{
  "userId": "68df1234567890abcdef1234"
}
```

The token is signed using a secret key stored in the backend environment variables.

The client receives the token and can send it with later API requests.

**Important:** A signed JWT is not automatically encrypted. Do not store passwords or other sensitive information inside its payload.

### 3.4 JWT Methods

| Method | Purpose |
|---|---|
| `jwt.sign()` | Generate a signed token |
| `jwt.verify()` | Verify a token's signature and validity |
| `jwt.decode()` | Read token contents without verifying the signature |

In this stage, we primarily use `jwt.sign()`. Token verification will be implemented in the authentication middleware in Stage 5.

---

## 4. Updated Architecture

### Registration Flow

```text
Client
  |
  | POST /api/v1/auth/register
  | name, email, password
  v
Express Router
  |
  v
Auth Controller
  |
  v
Auth Service
  |
  | Check whether email already exists
  | Hash password using bcrypt
  v
User Model
  |
  v
MongoDB
  |
  | Save new user
  v
Generate JWT
  |
  v
Return user details and token
  |
  v
Client
```

### Login Flow

```text
Client
  |
  | POST /api/v1/auth/login
  | email, password
  v
Express Router
  |
  v
Auth Controller
  |
  v
Auth Service
  |
  | Find user by email
  | Compare password using bcrypt
  |
  +---- Invalid credentials
  |       |
  |       v
  |     Return 401
  |
  +---- Valid credentials
          |
          v
       Generate JWT
          |
          v
       Return token and user details
          |
          v
         Client
```

---

## 5. Required Packages

From the backend directory, install:

```bash
npm install bcrypt jsonwebtoken
```

If these packages are already installed, you do not need to install them again.

### Package responsibilities

| Package | Responsibility |
|---|---|
| `bcrypt` | Password hashing and comparison |
| `jsonwebtoken` | JWT generation and verification |
| `mongoose` | User model and MongoDB operations |
| `express` | API routes and controllers |
| `dotenv` | Environment variable configuration |

---

## 6. Updated Backend Structure

Add the following files to the existing backend structure:

```text
backend/
└── src/
    ├── config/
    │   ├── db.js
    │   └── env.js
    │
    ├── models/
    │   ├── task.model.js
    │   └── user.model.js          # NEW
    │
    ├── routes/
    │   ├── index.js
    │   ├── task.routes.js
    │   └── auth.routes.js         # NEW
    │
    ├── controllers/
    │   ├── task.controller.js
    │   └── auth.controller.js     # NEW
    │
    ├── services/
    │   └── auth.service.js        # NEW
    │
    ├── app.js
    └── server.js
```

The exact folder names should follow your existing project conventions.

### Responsibilities

| File | Responsibility |
|---|---|
| `user.model.js` | Define the User schema |
| `auth.routes.js` | Define registration and login endpoints |
| `auth.controller.js` | Handle HTTP requests and responses |
| `auth.service.js` | Implement authentication business logic |
| `app.js` | Mount authentication routes |
| `server.js` | Start the backend server |

---

## 7. Database Design — User Collection

Create a `User` model with the following fields:

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | String | Yes | User's display name |
| `email` | String | Yes | Unique login identifier |
| `password` | String | Yes | bcrypt password hash |
| `createdAt` | Date | Automatic | Account creation time |
| `updatedAt` | Date | Automatic | Last update time |

### Important Schema Requirements

1. `name` should be trimmed.
2. `email` should be trimmed and normalized to lowercase.
3. `email` should have a unique index.
4. `password` should be required.
5. Timestamps should be enabled.
6. Password hashes must never be returned in API responses.

### Example MongoDB Document

```json
{
  "_id": "68df1234567890abcdef1234",
  "name": "Balakumaran",
  "email": "bkumaran@example.com",
  "password": "$2b$10$...",
  "createdAt": "2026-10-02T10:00:00.000Z",
  "updatedAt": "2026-10-02T10:00:00.000Z"
}
```

The password shown above is a placeholder representing a bcrypt hash, not a real password.

---

## 8. API Design

### Authentication Endpoints

| Method | Endpoint | Purpose | Expected Status |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Create a user account | 201 |
| POST | `/api/v1/auth/login` | Authenticate a user | 200 |

### Registration Request

**Endpoint:**

`POST /api/v1/auth/register`

**Request body:**

```json
{
  "name": "Balakumaran",
  "email": "bkumaran@example.com",
  "password": "MyPassword@123"
}
```

**Expected response:**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "68df1234567890abcdef1234",
      "name": "Balakumaran",
      "email": "bkumaran@example.com"
    },
    "token": "<JWT_ACCESS_TOKEN>"
  }
}
```

The response must not contain the user's password hash.

### Login Request

**Endpoint:**

`POST /api/v1/auth/login`

**Request body:**

```json
{
  "email": "bkumaran@example.com",
  "password": "MyPassword@123"
}
```

**Expected response:**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "68df1234567890abcdef1234",
      "name": "Balakumaran",
      "email": "bkumaran@example.com"
    },
    "token": "<JWT_ACCESS_TOKEN>"
  }
}
```

The actual token will be generated dynamically by the backend.

---

## 9. Environment Variables

Add a JWT secret to the backend `.env` file:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=1d

CLIENT_URL=http://localhost:5173
```

### Security Rules

- Never commit `.env` to GitHub.
- Never expose `JWT_SECRET` to the frontend.
- Use a long, unpredictable secret.
- Keep `.env.example` free of real credentials.
- Use a separate, securely generated secret in production.

Example `.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

---

## 10. Step-by-Step Implementation Plan

### Step 1 — Install Authentication Packages

Install bcrypt and jsonwebtoken.

Verify that they appear in `package.json`.

### Step 2 — Create the User Model

Create `models/user.model.js`.

Define the name, email, and password fields with the schema requirements described above.

Test that Mongoose can create a user document.

### Step 3 — Create the Authentication Service

Create `services/auth.service.js`.

Implement the business logic for:

- Registering a new user.
- Checking for an existing email.
- Hashing the password.
- Saving the user.
- Validating login credentials.
- Generating a JWT.

Keep business logic separate from Express request and response handling.

### Step 4 — Implement Registration

Create the registration controller and route.

Registration logic should:

1. Read the user's name, email, and password.
2. Validate required inputs.
3. Normalize the email.
4. Check whether the email already exists.
5. Hash the password using bcrypt.
6. Create the user in MongoDB.
7. Generate a JWT.
8. Return safe user details and the token.

### Step 5 — Implement Login

Create the login controller and route.

Login logic should:

1. Read email and password.
2. Find the user by email.
3. Return a generic authentication error if the user is not found.
4. Compare the entered password with the stored hash.
5. Return the same generic error if the password is incorrect.
6. Generate a JWT if the credentials are valid.
7. Return safe user details and the token.

Using the same error message for an unknown email and an incorrect password avoids unnecessarily revealing which email addresses have accounts.

### Step 6 — Mount Authentication Routes

Register the authentication router in the main API router.

Ensure the final endpoints are:

```text
POST /api/v1/auth/register
POST /api/v1/auth/login
```

### Step 7 — Test Registration

Use Postman to verify:

- Successful registration.
- Missing name.
- Missing email.
- Missing password.
- Duplicate email.
- Invalid email format, if validation is implemented.
- Password is stored as a hash, not plain text.

### Step 8 — Test Login

Verify:

- Successful login.
- Incorrect password.
- Unknown email.
- Missing credentials.
- Token is generated only after successful authentication.

### Step 9 — Verify JWT

Use a JWT inspection tool to inspect the token's header and payload.

Confirm that:

- The token contains the expected user identifier.
- The token has an expiration claim.
- The token is signed.
- No password or password hash is included in the payload.

Do not share real production tokens or secrets.

### Step 10 — Document and Review

Document the new endpoints, request bodies, responses, error cases, and authentication flow.

Review the code for accidental password exposure.

---

## 11. HTTP Status Codes

| Status | Meaning | Example |
|---|---|---|
| 200 | OK | Successful login |
| 201 | Created | Successful registration |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Invalid login credentials |
| 409 | Conflict | Duplicate email |
| 500 | Internal Server Error | Unexpected server failure |

Use `409 Conflict` for duplicate email registration if that is the response convention adopted by your API.

---

## 12. Testing Checklist

### Registration

- [ ] Register a new user.
- [ ] Verify the user appears in MongoDB.
- [ ] Verify the password is hashed.
- [ ] Verify the response does not expose the password hash.
- [ ] Attempt to register with the same email.
- [ ] Test missing required fields.
- [ ] Verify the returned JWT contains the correct user identifier.

### Login

- [ ] Log in with correct credentials.
- [ ] Verify a token is returned.
- [ ] Log in with an incorrect password.
- [ ] Attempt login with an unknown email.
- [ ] Test missing credentials.
- [ ] Verify failed logins do not generate a token.

### Security

- [ ] `.env` is excluded from Git.
- [ ] JWT secret is not exposed to the frontend.
- [ ] Passwords are never stored in plain text.
- [ ] Password hashes are not returned in responses.
- [ ] JWT payload contains no sensitive information.

---

## 13. Important Concepts Learned

By completing Stage 4, you should be able to explain:

1. What authentication means.
2. The difference between authentication and authorization.
3. Why passwords must be hashed.
4. How bcrypt hashing and comparison work.
5. Why password hashes cannot simply be decrypted.
6. What JWT is and why it is used.
7. The three parts of a JWT.
8. How `jwt.sign()` generates a token.
9. Why JWT secrets belong in environment variables.
10. Why duplicate email registration must be prevented.
11. Why passwords must not be returned in API responses.
12. Why login errors should avoid revealing whether an account exists.

---

## 14. Stage Completion Criteria

Stage 4 is complete when:

- [ ] User model is created.
- [ ] Registration API works.
- [ ] Login API works.
- [ ] Passwords are hashed using bcrypt.
- [ ] Duplicate emails are handled.
- [ ] JWT tokens are generated successfully.
- [ ] API responses exclude password hashes.
- [ ] Invalid credentials are handled correctly.
- [ ] Postman tests pass.
- [ ] Authentication documentation is complete.

### Final Outcome

TaskFlow now supports user registration and login. Users can receive a signed JWT after successful authentication.

However, the existing task endpoints are not yet protected. A valid JWT is generated but is not yet required to access task routes.

**Next Stage: Stage 05 — JWT Middleware & Authorization**

In the next stage, we will:

- Create authentication middleware.
- Read JWT tokens from the `Authorization` header.
- Verify token signatures and expiration.
- Attach the authenticated user to the request.
- Protect task routes.
- Add user ownership to the Task model.
- Ensure users can only access their own tasks.

This completes the authentication foundation required for a secure, multi-user TaskFlow application.
