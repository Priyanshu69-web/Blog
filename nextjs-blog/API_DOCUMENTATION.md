# API Routes Documentation

This document provides detailed information about all API endpoints in the Next.js Blog application.

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://yourdomain.com/api`

---

## Authentication Endpoints

### POST `/api/auth/[...nextauth]`
**Purpose**: NextAuth.js authentication handler (dynamic route)

**Handles**:
- `POST /api/auth/signin` - Sign in with credentials
- `POST /api/auth/signout` - Sign out and clear session
- `GET /api/auth/session` - Get current session
- `GET /api/auth/providers` - List available providers

**Credentials Provider Fields**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response** (on successful signin):
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  },
  "expires": "2025-01-19T17:28:59.597Z"
}
```

---

## User Endpoints

### POST `/api/register`
**Purpose**: Register a new user account

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Validation**:
- All fields (name, email, password) are required
- Email must be unique (checked against database)
- Password is hashed with bcrypt (10 rounds)

**Response** (201 Created):
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses**:
- `400 Bad Request`: Missing required fields
  ```json
  { "error": "All fields are required" }
  ```
- `400 Bad Request`: Email already exists
  ```json
  { "error": "User already exists" }
  ```
- `500 Internal Server Error`: Server error during registration

---

## Blog Post Endpoints

### GET `/api/posts`
**Purpose**: Fetch all blog posts

**Authentication**: Not required

**Query Parameters**: None

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "My First Blog Post",
    "content": "This is the blog content...",
    "category": "Technology",
    "userId": 1,
    "createdAt": "2025-12-19T10:00:00Z",
    "updatedAt": "2025-12-19T10:00:00Z",
    "user": {
      "name": "John Doe"
    },
    "comments": [
      {
        "id": 1,
        "name": "Jane Smith",
        "comment": "Great post!",
        "createdAt": "2025-12-19T11:00:00Z"
      }
    ]
  }
]
```

**Ordering**: By creation date (newest first)

---

### POST `/api/posts`
**Purpose**: Create a new blog post

**Authentication**: Required (JWT token)

**Request Headers**:
```
Content-Type: application/json
Authorization: Bearer <token> (sent automatically by NextAuth)
```

**Request Body**:
```json
{
  "title": "My Blog Post Title",
  "content": "This is the full content of the blog post...",
  "category": "Technology"
}
```

**Validation**:
- All fields (title, content, category) are required
- User must be authenticated
- Content is stored as TEXT in database (supports large content)

**Response** (201 Created):
```json
{
  "id": 1,
  "title": "My Blog Post Title",
  "content": "This is the full content...",
  "category": "Technology",
  "userId": 1,
  "createdAt": "2025-12-19T10:00:00Z",
  "updatedAt": "2025-12-19T10:00:00Z",
  "user": {
    "name": "John Doe"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: User not authenticated
- `400 Bad Request`: Missing required fields
- `500 Internal Server Error`: Server error

---

### GET `/api/posts/[id]`
**Purpose**: Fetch a specific blog post with all comments

**Authentication**: Not required

**URL Parameters**:
- `id`: Blog post ID (integer)

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "My Blog Post Title",
  "content": "Full content...",
  "category": "Technology",
  "userId": 1,
  "createdAt": "2025-12-19T10:00:00Z",
  "updatedAt": "2025-12-19T10:00:00Z",
  "user": {
    "name": "John Doe"
  },
  "comments": [
    {
      "id": 1,
      "blogId": 1,
      "name": "Jane Smith",
      "comment": "Great post!",
      "createdAt": "2025-12-19T11:00:00Z",
      "updatedAt": "2025-12-19T11:00:00Z"
    }
  ]
}
```

**Comments**: Ordered by creation date (newest first)

**Error Responses**:
- `404 Not Found`: Post doesn't exist
- `500 Internal Server Error`: Server error

---

### PUT `/api/posts/[id]`
**Purpose**: Update an existing blog post

**Authentication**: Required (JWT token)

**Authorization**: Only the post author can update

**URL Parameters**:
- `id`: Blog post ID (integer)

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "category": "Updated Category"
}
```

**Validation**:
- All fields are required
- User must be authenticated
- User must be the post author

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Updated Title",
  "content": "Updated content...",
  "category": "Updated Category",
  "userId": 1,
  "createdAt": "2025-12-19T10:00:00Z",
  "updatedAt": "2025-12-19T12:00:00Z",
  "user": {
    "name": "John Doe"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User doesn't own the post
- `404 Not Found`: Post doesn't exist
- `400 Bad Request`: Missing required fields

---

### DELETE `/api/posts/[id]`
**Purpose**: Delete a blog post

**Authentication**: Required (JWT token)

**Authorization**: Only the post author can delete

**URL Parameters**:
- `id`: Blog post ID (integer)

**Response** (200 OK):
```json
{
  "message": "Post deleted successfully"
}
```

**Cascade Behavior**:
- All associated comments are automatically deleted
- Defined in Prisma schema: `onDelete: Cascade`

**Error Responses**:
- `401 Unauthorized`: User not authenticated
- `403 Forbidden`: User doesn't own the post
- `404 Not Found`: Post doesn't exist

---

## Comment Endpoints

### POST `/api/posts/[id]/comments`
**Purpose**: Add a comment to a blog post

**Authentication**: Not required

**URL Parameters**:
- `id`: Blog post ID (integer)

**Request Headers**:
```
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Jane Smith",
  "comment": "This is a great post! I really enjoyed reading it."
}
```

**Validation**:
- Both `name` and `comment` are required
- Blog post must exist
- No authentication required (anonymous comments)

**Response** (201 Created):
```json
{
  "id": 1,
  "blogId": 1,
  "name": "Jane Smith",
  "comment": "This is a great post!",
  "createdAt": "2025-12-19T11:00:00Z",
  "updatedAt": "2025-12-19T11:00:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Missing name or comment field
- `404 Not Found`: Blog post doesn't exist
- `500 Internal Server Error`: Server error

---

## Authentication Flow

### Login Flow:
1. User submits email and password to `/api/auth/signin`
2. NextAuth verifies credentials against database
3. Password compared with stored hash using bcrypt
4. On success: JWT token created and stored in httpOnly cookie
5. Session returned with user ID, email, and name

### Logout Flow:
1. User calls `/api/auth/signout`
2. Session cookie cleared
3. User redirected (default behavior)

### Session Retrieval:
1. Frontend calls `useSession()` hook
2. Returns current session or null if not authenticated
3. Session includes user ID for authorization checks

---

## Error Handling

### Standard Error Format:
```json
{
  "error": "Error message describing what went wrong"
}
```

### HTTP Status Codes:
- `200 OK`: Successful request
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Authenticated but not authorized
- `404 Not Found`: Resource doesn't exist
- `500 Internal Server Error`: Server error

---

## Rate Limiting

Currently no rate limiting is implemented. For production, consider:
- Implement rate limiting middleware
- Use packages like `next-rate-limit` or similar
- Add IP-based or user-based rate limiting

---

## Security Considerations

1. **Authentication**:
   - All write operations require authentication
   - Credentials sent via HTTPS only (production)
   - Passwords hashed with bcrypt (10 rounds)

2. **Authorization**:
   - Edit/Delete operations check post ownership
   - User ID compared from JWT token

3. **Input Validation**:
   - All endpoints validate required fields
   - SQL injection prevented by Prisma ORM

4. **CORS**:
   - Currently configured for same-origin requests
   - Cross-origin requests follow Next.js defaults

---

## Testing with cURL

### Register a user:
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"password123"}'
```

### Get all posts:
```bash
curl http://localhost:3000/api/posts
```

### Get specific post:
```bash
curl http://localhost:3000/api/posts/1
```

### Create a post (requires authentication):
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"title":"My Post","content":"Content here","category":"Tech"}'
```

---

**Last Updated**: December 2025
