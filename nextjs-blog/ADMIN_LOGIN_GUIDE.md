# Admin Login Guide

## How Admin Login Works

### Overview
- **Login Page**: `/login`
- **Requirements**: Admin user must exist in database with `isAdmin: true`
- **Authentication**: Email and password (hashed with bcrypt)
- **After Login**: Redirects to `/admin/dashboard`

---

## Steps to Login

### Step 1: Create an Admin User

You need to create an admin user in your database first. You have **3 options**:

#### Option 1: Using the Script (Recommended) ✨

Run the provided script to create an admin user:

```bash
node scripts/create-admin.js <email> <password> <name>
```

**Example:**
```bash
node scripts/create-admin.js admin@example.com mypassword123 "Admin User"
```

This will:
- Hash the password automatically
- Create the user with `isAdmin: true`
- Handle existing users (updates to admin if needed)

#### Option 2: Using Prisma Studio

1. Run Prisma Studio:
   ```bash
   npx prisma studio
   ```

2. Navigate to the `User` model
3. Click "Add record"
4. Fill in:
   - `name`: Admin's name
   - `email`: Admin's email
   - `password`: Use bcrypt to hash (see Option 3)
   - `isAdmin`: **Set to `true`** (important!)
   - `createdAt`: Current date/time
   - `updatedAt`: Current date/time

#### Option 3: Direct SQL (Advanced)

```sql
INSERT INTO User (name, email, password, isAdmin, createdAt, updatedAt)
VALUES ('Admin User', 'admin@example.com', '$2a$10$hashedpassword', true, NOW(), NOW());
```

**To hash password manually:**
```javascript
const bcrypt = require('bcryptjs');
const hashed = await bcrypt.hash('yourpassword', 10);
console.log(hashed);
```

---

### Step 2: Access Login Page

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to: `http://localhost:3000/login`

---

### Step 3: Enter Credentials

On the login page, enter:
- **Email**: The email of the admin user you created
- **Password**: The password you set for that admin user

Click "Login"

---

### Step 4: Access Dashboard

After successful login, you'll be redirected to:
- `/admin/dashboard`

From here you can:
- View all blog posts
- Create new posts
- Edit existing posts
- Delete posts

---

## Security Features

✅ **Admin-Only Login**: Only users with `isAdmin: true` can login  
✅ **Password Hashing**: Passwords are hashed using bcrypt  
✅ **Protected Routes**: Middleware protects `/admin/*` routes  
✅ **Session-Based**: Uses NextAuth sessions with JWT strategy  

---

## Troubleshooting

### "Invalid email or password" Error

**Possible causes:**
1. User doesn't exist in database
2. User exists but `isAdmin` is `false`
3. Incorrect email or password
4. Password in database is not properly hashed

**Solution:**
- Verify user exists: Check database or Prisma Studio
- Verify `isAdmin: true`: User must have this field set to `true`
- Verify password: Make sure password is bcrypt hashed (not plain text)
- Try creating user again with the script

### "Only admins can login" Error

The user exists but `isAdmin` is `false`.

**Solution:**
Update the user in database:
```sql
UPDATE User SET isAdmin = true WHERE email = 'your@email.com';
```

Or use the script to update an existing user to admin.

### Can't Access Admin Dashboard After Login

Check:
1. Session is active (check browser cookies)
2. Middleware is working correctly
3. You're accessing `/admin/dashboard` (not other paths)

---

## Quick Setup Example

```bash
# 1. Create admin user
node scripts/create-admin.js admin@myblog.com admin123 "Blog Admin"

# 2. Start server
npm run dev

# 3. Login at http://localhost:3000/login
#    Email: admin@myblog.com
#    Password: admin123

# 4. You'll be redirected to /admin/dashboard
```

---

## Multiple Admin Users

You can create multiple admin users by running the script multiple times with different emails:

```bash
node scripts/create-admin.js admin1@example.com password1 "Admin 1"
node scripts/create-admin.js admin2@example.com password2 "Admin 2"
```

All users with `isAdmin: true` can login and access the admin dashboard.

