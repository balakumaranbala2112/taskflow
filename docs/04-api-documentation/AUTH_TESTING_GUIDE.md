# TaskFlow Auth API Testing Guide & Mock Data Specification

This document provides a step-by-step guide for testing all authentication endpoints in **TaskFlow**, including cURL commands, Postman / REST client instructions, realistic mock data, and exact expected HTTP responses.

---

## 1. Authentication Architecture Overview

TaskFlow uses a hybrid **Access Token (JWT)** + **Refresh Token (Rotated in DB + Cookie/Body)** architecture:

| Token Type | Purpose | Expiry | Transport |
| :--- | :--- | :--- | :--- |
| **Access Token** | Authorize protected endpoints (`/me`, `/tasks`, etc.) | 15 minutes | `Authorization: Bearer <token>` header or response data |
| **Refresh Token** | Issue new access tokens when expired | 7 days | HttpOnly Cookie `refreshToken` or JSON body `{ "refreshToken": "..." }` |

---

## 2. API Endpoints Summary

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | No | Creates a new user account and starts a session |
| `POST` | `/api/v1/auth/login` | No | Authenticates existing user and issues tokens |
| `GET` | `/api/v1/auth/me` | Yes (`Bearer <access_token>`) | Retrieves current authenticated user profile |
| `POST` | `/api/v1/auth/refresh` | No (requires refresh token in cookie or body) | Rotates refresh token & issues new access token |
| `POST` | `/api/v1/auth/logout` | No (requires refresh token in cookie or body) | Revokes active refresh token and clears auth cookie |

---

## 3. Step-by-Step Testing Guide with Mock Data

Base URL: `http://localhost:5000`

---

### Test 1: Register a New User

#### 1.1 Success Case (201 Created)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/v1/auth/register`
- **Headers:** `Content-Type: application/json`
- **Request Body (Mock Data):**
```json
{
  "name": "Alex Morgan",
  "email": "alex.morgan@example.com",
  "password": "Password@123"
}
```

- **cURL Command:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex Morgan","email":"alex.morgan@example.com","password":"Password@123"}' \
  -c cookies.txt
```

- **Expected Response (Status `201 Created`):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "660c15f9b48c94e823f6e123",
      "name": "Alex Morgan",
      "email": "alex.morgan@example.com"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
*Note: The `Set-Cookie` header also contains `refreshToken=<token>; HttpOnly; Path=/; SameSite=Lax`.*

#### 1.2 Duplicate Email Case (409 Conflict)
- **Request Body:** Send the exact same body again.
- **Expected Response (Status `409 Conflict`):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

#### 1.3 Validation Error - Short Password (400 Bad Request)
- **Request Body:**
```json
{
  "name": "Alex Morgan",
  "email": "alex2@example.com",
  "password": "123"
}
```
- **Expected Response (Status `400 Bad Request`):**
```json
{
  "success": false,
  "message": "Password must be at least 6 characters long"
}
```

---

### Test 2: User Login

#### 2.1 Success Case (200 OK)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/v1/auth/login`
- **Headers:** `Content-Type: application/json`
- **Request Body (Mock Data):**
```json
{
  "email": "alex.morgan@example.com",
  "password": "Password@123"
}
```

- **cURL Command:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex.morgan@example.com","password":"Password@123"}' \
  -c cookies.txt
```

- **Expected Response (Status `200 OK`):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "660c15f9b48c94e823f6e123",
      "name": "Alex Morgan",
      "email": "alex.morgan@example.com"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2.2 Invalid Password (401 Unauthorized)
- **Request Body:**
```json
{
  "email": "alex.morgan@example.com",
  "password": "WrongPassword999"
}
```
- **Expected Response (Status `401 Unauthorized`):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

#### 2.3 User Not Found (401 Unauthorized)
- **Request Body:**
```json
{
  "email": "nonexistent.user@example.com",
  "password": "Password@123"
}
```
- **Expected Response (Status `401 Unauthorized`):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### Test 3: Get Current User Profile (`/me`)

#### 3.1 Success Case (200 OK)
- **Method:** `GET`
- **URL:** `http://localhost:5000/api/v1/auth/me`
- **Headers:** `Authorization: Bearer <YOUR_ACCESS_TOKEN>`

- **cURL Command:**
```bash
curl -X GET http://localhost:5000/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

- **Expected Response (Status `200 OK`):**
```json
{
  "success": true,
  "message": "User profile fetched successfully",
  "data": {
    "id": "660c15f9b48c94e823f6e123",
    "name": "Alex Morgan",
    "email": "alex.morgan@example.com",
    "createdAt": "2026-10-03T12:00:00.000Z",
    "updatedAt": "2026-10-03T12:00:00.000Z"
  }
}
```

#### 3.2 Missing Token (401 Unauthorized)
- **Request:** Omit `Authorization` header.
- **Expected Response (Status `401 Unauthorized`):**
```json
{
  "success": false,
  "message": "Authentication token is required"
}
```

#### 3.3 Expired / Malformed Token (401 Unauthorized)
- **Headers:** `Authorization: Bearer invalid.token.value`
- **Expected Response (Status `401 Unauthorized`):**
```json
{
  "success": false,
  "message": "Invalid or expired authentication token"
}
```

---

### Test 4: Refresh Access Token (`/refresh`)

TaskFlow supports refreshing tokens via **HttpOnly Cookie** (browsers) AND via **JSON body** (Postman / mobile clients / testing tools).

#### 4.1 Option A: Via Cookie (Browser / cURL Cookie Jar)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/v1/auth/refresh`
- **cURL Command:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

#### 4.2 Option B: Via JSON Body (Postman / REST Client)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/v1/auth/refresh`
- **Headers:** `Content-Type: application/json`
- **Request Body (Mock Data):**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- **Expected Response (Status `200 OK`):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "user": {
      "id": "660c15f9b48c94e823f6e123",
      "name": "Alex Morgan",
      "email": "alex.morgan@example.com"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...<NEW_TOKEN>",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...<NEW_REFRESH_TOKEN>"
  }
}
```

#### 4.3 Reusing a Revoked or Invalid Refresh Token (401 Unauthorized)
- **Request Body:** Send the old refresh token that was just rotated.
- **Expected Response (Status `401 Unauthorized`):**
```json
{
  "success": false,
  "message": "Refresh token is invalid or revoked"
}
```

---

### Test 5: Logout (`/logout`)

#### 5.1 Success Case (200 OK)
- **Method:** `POST`
- **URL:** `http://localhost:5000/api/v1/auth/logout`
- **Headers:** `Content-Type: application/json`
- **Request Body (Optional if cookie is present):**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- **cURL Command:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/logout \
  -b cookies.txt \
  -c cookies.txt
```

- **Expected Response (Status `200 OK`):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```
*Note: The cookie `refreshToken` is deleted in the browser with `Max-Age=0` / expired date.*

---

## 4. Protected Tasks Endpoint Quick Verification

To verify that the access token protects all task routes:

### Create Task (`POST /api/v1/tasks`)
- **Headers:**
  - `Authorization: Bearer <ACCESS_TOKEN>`
  - `Content-Type: application/json`
- **Body:**
```json
{
  "title": "Design user dashboard",
  "description": "Create responsive wireframes in Figma",
  "priority": "high",
  "status": "in-progress",
  "dueDate": "2026-10-15T18:00:00.000Z"
}
```

- **Expected Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "_id": "660c16abb48c94e823f6e456",
    "user": "660c15f9b48c94e823f6e123",
    "title": "Design user dashboard",
    "description": "Create responsive wireframes in Figma",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2026-10-15T18:00:00.000Z",
    "createdAt": "2026-10-03T12:05:00.000Z",
    "updatedAt": "2026-10-03T12:05:00.000Z"
  }
}
```

---

## 5. Summary of Bugs Fixed in Backend

1. **Fixed `secure: env.nodeEnv` in Login**: In development mode, `secure` was previously set to truthy `"development"`, preventing browsers and HTTP clients from storing cookies over `http://localhost`.
2. **Removed Blocking `protect` on Logout**: Fixed the issue where users with expired 15-minute access tokens were blocked from logging out.
3. **Supported Refresh Token in Body & Cookie**: Enabled both cookie-based auth (for frontend web apps) and body-based token passing (for Postman, mobile clients, and automated tests).
4. **Removed Massive Console Dump**: Cleaned up `console.log("REQUEST: ", req)` in login which froze server logs.
5. **Added Email Normalization**: Emails are now consistently trimmed and converted to lower case (`.trim().toLowerCase()`) on register & login.
6. **Robust Token Rotation**: Verified signature errors are properly caught and mapped to HTTP 401.
7. **Added MongoDB TTL Index**: Automatically cleans up expired refresh tokens from database.
