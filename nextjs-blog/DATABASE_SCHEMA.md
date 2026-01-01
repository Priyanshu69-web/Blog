# Database Schema Documentation

This document describes the database models, relationships, and data types used in the Next.js Blog application.

## Database Setup

**Database Type**: MySQL  
**ORM**: Prisma  
**Location**: `prisma/schema.prisma`

### Environment Configuration
```env
DATABASE_URL="mysql://username:password@localhost:3306/blog_database"
```

---

## Models

### 1. User Model

Represents a registered user in the application.

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  blogs     Blog[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Fields:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | Int | Primary Key, Auto-increment | Unique user identifier |
| `name` | String | Required | User's display name |
| `email` | String | Unique, Required | User's email address (used for login) |
| `password` | String | Required | Hashed password using bcrypt |
| `blogs` | Blog[] | Relation | List of blog posts created by user |
| `createdAt` | DateTime | Auto-set | Account creation timestamp |
| `updatedAt` | DateTime | Auto-update | Last update timestamp |

#### Constraints:
- Email must be unique across all users
- Password is stored hashed (never store plain text)
- User deletion cascades to remove all associated blogs and comments

#### Example Data:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "password": "$2a$10$...(bcrypt hash)...",
  "createdAt": "2025-12-19T10:00:00Z",
  "updatedAt": "2025-12-19T10:00:00Z"
}
```

---

### 2. Blog Model

Represents a blog post created by a user.

```prisma
model Blog {
  id        Int       @id @default(autoincrement())
  title     String
  content   String    @db.Text
  category  String
  userId    Int
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

#### Fields:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | Int | Primary Key, Auto-increment | Unique blog post identifier |
| `title` | String | Required | Blog post title |
| `content` | String (Text) | Required | Full blog post content (supports large text) |
| `category` | String | Required | Blog category (e.g., "Technology", "Travel") |
| `userId` | Int | Foreign Key, Required | ID of the user who created the post |
| `user` | User | Relationship | Reference to the User who created this post |
| `comments` | Comment[] | Relation | List of comments on this post |
| `createdAt` | DateTime | Auto-set | Post creation timestamp |
| `updatedAt` | DateTime | Auto-update | Last update timestamp |

#### Constraints:
- `userId` references `User.id`
- On user deletion: all blogs are deleted (cascade)
- Content field uses `@db.Text` for unlimited length
- Title and category use default String (255 characters)

#### Indexes (for performance):
- `id` (primary key)
- `userId` (foreign key, for querying user's posts)

#### Example Data:
```json
{
  "id": 1,
  "title": "Getting Started with Next.js",
  "content": "Next.js is a React framework...",
  "category": "Technology",
  "userId": 1,
  "createdAt": "2025-12-19T10:15:00Z",
  "updatedAt": "2025-12-19T10:15:00Z"
}
```

#### Relationships:
```
Blog -> User (Many-to-One)
Blog -> Comment (One-to-Many)
```

---

### 3. Comment Model

Represents a comment on a blog post.

```prisma
model Comment {
  id        Int      @id @default(autoincrement())
  blogId    Int
  blog      Blog     @relation(fields: [blogId], references: [id], onDelete: Cascade)
  name      String
  comment   String   @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Fields:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| `id` | Int | Primary Key, Auto-increment | Unique comment identifier |
| `blogId` | Int | Foreign Key, Required | ID of the blog post being commented on |
| `blog` | Blog | Relationship | Reference to the Blog post |
| `name` | String | Required | Name of the commenter (can be anonymous) |
| `comment` | String (Text) | Required | Comment text content |
| `createdAt` | DateTime | Auto-set | Comment creation timestamp |
| `updatedAt` | DateTime | Auto-update | Last update timestamp |

#### Constraints:
- `blogId` references `Blog.id`
- On blog deletion: all comments are deleted (cascade)
- Comment field uses `@db.Text` for supporting longer comments
- Commenters don't need to be registered users

#### Example Data:
```json
{
  "id": 1,
  "blogId": 1,
  "name": "Jane Smith",
  "comment": "Great article! Very helpful for beginners.",
  "createdAt": "2025-12-19T11:30:00Z",
  "updatedAt": "2025-12-19T11:30:00Z"
}
```

#### Relationships:
```
Comment -> Blog (Many-to-One)
```

---

## Relationships Diagram

```
User (1) ──────────(Many) Blog
 │                         │
 │                         │
 │                    (1)─┤
 │                         │
 │                    (Many)
 │                         │
 │                     Comment
 │
 └─ Each user can create multiple blogs
     Each blog belongs to one user
     Each blog can have multiple comments
     Comments don't directly link to users
```

---

## Data Type Details

### String Fields
- Default length: 255 characters
- Used for: `name`, `email`, `title`, `category`
- Can store Unicode characters

### Text Fields (`@db.Text`)
- Unlimited length (16 MB in MySQL)
- Used for: `password` (hashed), `content`, `comment`
- Allows full blog content and longer comments

### Int (Integer)
- 32-bit signed integer
- Range: -2,147,483,648 to 2,147,483,647
- Used for: `id`, `userId`, `blogId`

### DateTime
- ISO 8601 format
- Timezone-aware (stored as UTC)
- Used for: `createdAt`, `updatedAt` timestamps

---

## Queries and Examples

### Create a User
```javascript
const user = await prisma.user.create({
  data: {
    name: "John Doe",
    email: "john@example.com",
    password: hashedPassword, // bcrypt hash
  },
});
```

### Create a Blog Post
```javascript
const blog = await prisma.blog.create({
  data: {
    title: "My First Post",
    content: "This is the content...",
    category: "Technology",
    userId: 1,
  },
  include: {
    user: { select: { name: true } },
  },
});
```

### Get Blog with Comments
```javascript
const blog = await prisma.blog.findUnique({
  where: { id: 1 },
  include: {
    user: { select: { name: true } },
    comments: {
      orderBy: { createdAt: "desc" },
    },
  },
});
```

### Get All Posts by User
```javascript
const userPosts = await prisma.blog.findMany({
  where: { userId: 1 },
  include: { user: true, comments: true },
  orderBy: { createdAt: "desc" },
});
```

### Add Comment to Post
```javascript
const comment = await prisma.comment.create({
  data: {
    name: "Jane Smith",
    comment: "Great post!",
    blogId: 1,
  },
});
```

### Delete Blog (cascades to comments)
```javascript
await prisma.blog.delete({
  where: { id: 1 },
});
// All associated comments are automatically deleted
```

### Update Blog Post
```javascript
const updated = await prisma.blog.update({
  where: { id: 1 },
  data: {
    title: "Updated Title",
    content: "Updated content",
  },
});
```

---

## Database Migrations

Migrations are stored in `prisma/migrations/` directory.

### Create a migration after schema changes:
```bash
npx prisma migrate dev --name <description>
```

### Apply migrations to production:
```bash
npx prisma migrate deploy
```

### View migration history:
```bash
npx prisma migrate status
```

---

## Indexes and Performance

### Current Indexes:
- `User.id` - Primary key index
- `User.email` - Unique index (for fast email lookups during login)
- `Blog.id` - Primary key index
- `Blog.userId` - Foreign key index (for querying user's posts)
- `Comment.id` - Primary key index
- `Comment.blogId` - Foreign key index (for querying post's comments)

### Query Performance Tips:
1. Use `include` to eagerly load relations
2. Use `select` to limit returned fields
3. Add `orderBy` for consistent sorting
4. Use `where` conditions to filter early

---

## Backup and Restore

### Backup MySQL database:
```bash
mysqldump -u username -p database_name > backup.sql
```

### Restore from backup:
```bash
mysql -u username -p database_name < backup.sql
```

### Using Prisma for backup:
```bash
# Export data
npx prisma db push
npx prisma client generate

# Then use your backup strategy
```

---

## Migration Considerations

### Adding a New Field:
1. Update `schema.prisma`
2. Run `npx prisma migrate dev`
3. Provide default value or set as optional
4. Update API routes and components as needed

### Removing a Field:
1. Update `schema.prisma`
2. Run `npx prisma migrate dev`
3. Update API routes to not use that field
4. Update components if they reference it

### Changing Field Type:
1. Update `schema.prisma`
2. Run `npx prisma migrate dev`
3. Specify transformation for existing data if needed

---

## Data Integrity

### Cascade Rules:
- **User deletion** → All blogs deleted → All comments deleted
- **Blog deletion** → All comments deleted
- **Comment deletion** → No cascading

### Uniqueness Constraints:
- `User.email` must be unique
- `User.id` is unique (primary key)
- `Blog.id` is unique (primary key)
- `Comment.id` is unique (primary key)

### Foreign Key Constraints:
- `Blog.userId` must reference valid `User.id`
- `Comment.blogId` must reference valid `Blog.id`

---

## Growth Projections

### At 1,000 users:
- Users table: ~50 KB
- Blogs table: ~500 KB (assuming 100 posts per user)
- Comments table: ~100 KB

### At 100,000 users:
- Users table: ~5 MB
- Blogs table: ~50 MB
- Comments table: ~10 MB

**Note**: Actual sizes depend on content length and character set.

---

**Last Updated**: December 2025  
**Database Version**: MySQL 5.7+  
**Prisma Version**: ^7.2.0
