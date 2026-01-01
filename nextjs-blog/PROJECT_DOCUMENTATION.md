# Next.js Blog Application Documentation

A comprehensive Next.js blog application with TypeScript, Prisma ORM, NextAuth authentication, and Tailwind CSS styling. This documentation explains each file in the project, its purpose, and functionality.

## 📁 Project Structure Overview

```
nextjs-blog/
├── src/
│   ├── app/                      # Next.js App Router directory
│   │   ├── api/                  # API routes
│   │   ├── create-post/          # Create blog post page
│   │   ├── login/                # Login page
│   │   ├── posts/                # All posts and individual post pages
│   │   ├── register/             # User registration page
│   │   ├── layout.tsx            # Root layout component
│   │   ├── page.tsx              # Home page
│   │   └── globals.css           # Global styles
│   ├── components/               # Reusable React components
│   │   ├── Footer.tsx            # Footer component
│   │   ├── Providers.tsx         # Session provider wrapper
│   │   └── ui/                   # UI component library (shadcn/ui)
│   ├── lib/                      # Utility functions and configurations
│   │   ├── auth.ts               # NextAuth authentication config
│   │   ├── db.ts                 # Prisma client instance
│   │   ├── utils.ts              # Utility functions
│   │   └── next-auth.d.ts        # TypeScript type definitions
│   └── types/                    # TypeScript type definitions
├── prisma/                       # Prisma ORM configuration
│   └── schema.prisma             # Database schema
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── next.config.ts                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.mjs            # PostCSS configuration
├── eslint.config.mjs             # ESLint configuration
└── .env                          # Environment variables (DATABASE_URL, NEXTAUTH_SECRET, etc.)
```

---

## 📄 File-by-File Documentation

### **Root Configuration Files**

#### `package.json`
**Purpose**: Defines project metadata, dependencies, and npm scripts
**Key Dependencies**:
- `next`: Latest Next.js framework
- `react` & `react-dom`: React library
- `next-auth`: Authentication solution
- `@prisma/client`: ORM client
- `tailwindcss`: Utility-first CSS framework
- `typescript`: Type safety

**Scripts**:
- `npm run dev`: Start development server
- `npm run build`: Production build
- `npm run start`: Run production server
- `npm run lint`: Run ESLint

---

#### `tsconfig.json`
**Purpose**: TypeScript compiler configuration
**Key Settings**:
- `strict: true`: Enables all strict type checking options
- `moduleResolution: "bundler"`: Modern module resolution
- `paths`: Path aliases (`@/*` maps to `./src/*`)
- Configured for React 19 with JSX support

---

#### `next.config.ts`
**Purpose**: Next.js framework configuration
**Current Configuration**: Default settings with room for custom configuration

---

#### `tailwind.config.js`
**Purpose**: Tailwind CSS customization
**Contains**: Theme extensions, plugins, and utility configurations

---

#### `postcss.config.mjs`
**Purpose**: PostCSS configuration for CSS processing
**Includes**: Tailwind CSS and autoprefixer plugins

---

#### `.env`
**Purpose**: Environment variables for database and authentication
**Key Variables**:
- `DATABASE_URL`: MySQL database connection string
- `NEXTAUTH_URL`: Base URL for authentication (e.g., http://localhost:3000)
- `NEXTAUTH_SECRET`: Secret key for session encryption (must be set in production)

---

### **Prisma ORM Files**

#### `prisma/schema.prisma`
**Purpose**: Defines the database schema and models
**Models**:

1. **User Model**
   - `id`: Unique identifier (auto-increment)
   - `name`: User's display name
   - `email`: Unique email address
   - `password`: Hashed password
   - `blogs`: Relationship to Blog posts
   - `createdAt` & `updatedAt`: Timestamps

2. **Blog Model**
   - `id`: Unique identifier (auto-increment)
   - `title`: Blog post title
   - `content`: Blog post content (stored as TEXT)
   - `category`: Blog category
   - `userId`: Foreign key to User
   - `user`: Relationship to User
   - `comments`: Relationship to Comments
   - `createdAt` & `updatedAt`: Timestamps

3. **Comment Model**
   - `id`: Unique identifier (auto-increment)
   - `blogId`: Foreign key to Blog
   - `blog`: Relationship to Blog
   - `name`: Commenter's name
   - `comment`: Comment text (stored as TEXT)
   - `createdAt` & `updatedAt`: Timestamps

---

### **Source Code Files**

#### `src/lib/db.ts`
**Purpose**: Prisma client singleton instance
**Functionality**:
- Creates a single Prisma client instance
- Prevents multiple instances in development (hot reload issue)
- Exported as `prisma` for use throughout the app
**Usage**: `import { prisma } from "@/lib/db"`

---

#### `src/lib/auth.ts`
**Purpose**: NextAuth.js authentication configuration
**Features**:
- Credentials provider for email/password authentication
- Bcrypt password hashing and comparison
- JWT session strategy
- Custom session and JWT callbacks
- Stores user ID in JWT token
**Configuration**:
- Sign-in page: `/login`
- Sign-up page: `/register`
- Provider: CredentialsProvider (email/password)
**Exports**: `authOptions` used by NextAuth route handler

---

#### `src/lib/utils.ts`
**Purpose**: Utility functions for the application
**Main Function**: `cn()` - Tailwind CSS class merging using `clsx` and `tailwind-merge`
**Usage**: Safely combines Tailwind classes without conflicts

---

#### `src/lib/next-auth.d.ts`
**Purpose**: TypeScript type augmentation for NextAuth
**Functionality**: Extends NextAuth types to include custom `id` field in user object
**Ensures**: Type safety when accessing `session.user.id`

---

### **App Pages**

#### `src/app/layout.tsx`
**Purpose**: Root layout component wrapping all pages
**Functionality**:
- Imports Google Fonts (Geist Sans and Mono)
- Sets up global CSS styling
- Wraps children with SessionProvider (for authentication)
- Sets metadata (title and description)
**Child**: All pages are rendered as children of this layout

---

#### `src/app/page.tsx`
**Purpose**: Home/landing page
**Content**: Welcome page with Next.js template content
**Note**: This can be customized to show blog overview or recent posts

---

#### `src/app/register/page.tsx`
**Purpose**: User registration page
**Type**: Client component (`"use client"`)
**Features**:
- Form for name, email, password
- Form validation
- API call to `/api/register`
- Success/error message handling
- Redirect to login on success
**Endpoint**: POST `/api/register`

---

#### `src/app/login/page.tsx`
**Purpose**: User login page
**Type**: Client component
**Features**:
- Form for email and password
- Uses NextAuth `signIn()` function
- Credentials provider authentication
- Error handling for invalid credentials
- Redirect to posts on success
**Endpoint**: Uses NextAuth credentials provider

---

#### `src/app/posts/page.tsx`
**Purpose**: Display all blog posts
**Type**: Server component (async)
**Features**:
- Fetches all posts from `/api/posts`
- Displays posts in a grid layout (responsive: 1 col mobile, 2 tablets, 3 desktop)
- Shows post title, author, category, preview
- "Create New Post" button for authenticated users
- "Read More", "Edit", "Delete" buttons for post actions
- Edit/Delete only visible to post author
**Data Fetching**: Server-side with `cache: "no-store"` for real-time data

---

#### `src/app/posts/[id]/page.tsx`
**Purpose**: Display individual blog post with comments
**Type**: Server component (async)
**Features**:
- Fetches post by ID from `/api/posts/[id]`
- Shows post title, author, category, full content
- Edit/Delete buttons for post owner
- Comments section with list of existing comments
- Form to add new comments (no authentication required)
- Handles 404 for non-existent posts
**Functionality**:
- Comment author can leave name and comment
- Comments displayed in chronological order (newest first)

---

#### `src/app/posts/[id]/edit/page.tsx`
**Purpose**: Edit existing blog post
**Type**: Client component
**Features**:
- Session verification (redirects to login if not authenticated)
- Ownership check (only post author can edit)
- Form to edit title, content, category
- Success/error messaging
- API call to PUT `/api/posts/[id]`
- Redirect to post view on success
**Security**: Checks both authentication and post ownership

---

#### `src/app/create-post/page.tsx`
**Purpose**: Create new blog post
**Type**: Client component
**Features**:
- Session verification (redirects to login)
- Form for title, content, category
- API call to POST `/api/posts`
- Success/error messaging
- Redirect to all posts on success
**Note**: Must be logged in to create posts

---

### **API Routes**

#### `src/app/api/register/route.ts`
**Purpose**: User registration endpoint
**Method**: POST
**Request Body**:
```json
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123"
}
```
**Response**: User object with ID, name, email
**Functionality**:
- Validates all fields are provided
- Checks if user already exists
- Hashes password with bcrypt
- Creates new user in database
- Returns user data (excluding password)

---

#### `src/app/api/posts/route.ts`
**Purpose**: Blog posts endpoints
**Methods**:
1. **GET**: Fetch all posts
   - Returns all posts with user info and comments
   - Ordered by creation date (newest first)
   
2. **POST**: Create new post
   - Requires authentication
   - Request body: `{ title, content, category }`
   - Creates post associated with logged-in user
   - Returns created post with author info

---

#### `src/app/api/posts/[id]/route.ts`
**Purpose**: Individual post operations
**Methods**:
1. **GET**: Fetch single post
   - Returns post with comments ordered by date (newest first)
   - Returns 404 if post not found

2. **PUT**: Update post
   - Requires authentication
   - Checks if user owns the post
   - Updates title, content, category
   - Request body: `{ title, content, category }`

3. **DELETE**: Delete post
   - Requires authentication
   - Checks if user owns the post
   - Deletes post and associated comments (cascade)

---

#### `src/app/api/posts/[id]/comments/route.ts`
**Purpose**: Add comments to posts
**Method**: POST
**Request Body**:
```json
{
  "name": "Commenter Name",
  "comment": "Comment text"
}
```
**Functionality**:
- No authentication required
- Validates name and comment are provided
- Creates comment associated with post
- Returns comment with timestamp

---

#### `src/app/api/auth/[...nextauth]/route.ts`
**Purpose**: NextAuth authentication handler
**Functionality**:
- Handles all authentication endpoints
- GET request for session info
- POST request for sign-in
- Integrates with NextAuth configuration

---

### **Components**

#### `src/components/Providers.tsx`
**Purpose**: Provider wrapper for client-side features
**Type**: Client component
**Functionality**:
- Wraps SessionProvider from NextAuth
- Provides session context to all child components
- Required for `useSession()` hook to work
**Usage**: Wraps the entire app in layout.tsx

---

#### `src/components/Footer.tsx`
**Purpose**: Footer component
**Type**: Server component
**Content**: Copyright notice and branding
**Styling**: Uses primary color from theme
**Usage**: Can be included in layout or individual pages

---

#### `src/components/ui/button.tsx`
**Purpose**: Reusable button component
**Type**: Headless UI component using Radix UI
**Features**:
- Multiple variants: default, destructive, outline, secondary, ghost, link
- Multiple sizes: default, sm, lg, icon variants
- Accessible with focus states
- Supports icon combinations
- Disabled state styling
**Usage**: `<Button variant="destructive">Delete</Button>`

---

#### `src/components/ui/card.tsx`
**Purpose**: Card container component
**Type**: Composite component
**Sub-components**:
- `Card`: Main container with border and shadow
- `CardHeader`: Header section with special grid layout
- `CardTitle`: Bold title text
- `CardDescription`: Muted subtitle text
- `CardContent`: Main content area with padding
- `CardFooter`: Footer section for actions
- `CardAction`: Right-aligned action area
**Usage**: Used throughout for organizing content

---

#### `src/components/ui/input.tsx`
**Purpose**: Text input component
**Features**:
- Supports all HTML input types
- Styled text input field
- Focus and disabled states
- File upload styling
- Accessible outline focus
**Usage**: `<Input type="email" placeholder="Enter email" />`

---

#### `src/components/ui/textarea.tsx`
**Purpose**: Multi-line text input
**Features**:
- Flexible height (min-height: 64px)
- Field sizing support
- Styled border and focus state
- Supports rows attribute
**Usage**: `<Textarea rows={8} placeholder="Write content" />`

---

## 🔐 Authentication Flow

1. **Registration**:
   - User fills registration form
   - POST `/api/register` with name, email, password
   - Password hashed with bcrypt (10 rounds)
   - User created in database
   - Redirect to login

2. **Login**:
   - User enters email and password
   - Credentials sent to NextAuth
   - NextAuth verifies against database
   - JWT token created and stored in session
   - User ID included in token
   - Redirect to posts page

3. **Session Persistence**:
   - JWT token stored in session cookie
   - Session provider wraps entire app
   - `useSession()` hook provides session info
   - `getServerSession()` for server components

---

## 📝 Database Operations

### Creating a Post
1. User navigates to `/create-post`
2. Fills title, content, category
3. POST `/api/posts` with data
4. Prisma creates blog entry with user association
5. Redirect to `/posts`

### Reading Posts
- GET `/api/posts` - Returns all posts with user and comment data
- GET `/api/posts/[id]` - Returns single post with comments

### Updating a Post
1. User navigates to `/posts/[id]/edit`
2. Edits title, content, category
3. PUT `/api/posts/[id]` with new data
4. Prisma updates blog entry
5. Redirect to post view

### Deleting a Post
1. User clicks delete button on post
2. DELETE `/api/posts/[id]` request
3. Post deleted (cascade deletes comments)
4. Redirect to posts page

---

## 🎨 Styling

- **Framework**: Tailwind CSS with v4 (using new @apply syntax)
- **UI Components**: Built with shadcn/ui patterns
- **Color System**: CSS variables for theming
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: Supported with dark: classes

---

## 🚀 Deployment Checklist

1. Set up MySQL database and get connection string
2. Create `.env.production` with:
   - `DATABASE_URL`: Production database URL
   - `NEXTAUTH_URL`: Production domain
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
3. Run `prisma migrate deploy` for production database
4. Build: `npm run build`
5. Start: `npm run start`

---

## ⚙️ Development Setup

1. Install dependencies: `npm install`
2. Set up `.env` with database URL
3. Run migrations: `npx prisma migrate dev`
4. Start dev server: `npm run dev`
5. Open http://localhost:3000

---

## 🐛 Common Issues & Fixes

### Issue: Database connection failed
**Solution**: Verify DATABASE_URL in .env points to running MySQL instance

### Issue: NextAuth session not working
**Solution**: Ensure NEXTAUTH_SECRET is set and Providers wrapper is in layout

### Issue: Comments not showing
**Solution**: Check blog post exists and comments relation is included in POST request

### Issue: Edit/Delete buttons not showing
**Solution**: Verify user ID in session matches post userId (convert to string for comparison)

---

## 📚 Tech Stack

- **Frontend**: React 19 with Next.js 16
- **Backend**: Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js v4
- **Styling**: Tailwind CSS v4
- **Type Safety**: TypeScript 5
- **Password Hashing**: bcryptjs
- **UI Components**: Custom Radix UI-based components

---

**Created**: December 2025  
**Last Updated**: December 2025  
**Version**: 1.0.0
