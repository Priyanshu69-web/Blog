# Quick Setup Guide for MyBlogSpace

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Create a `.env.local` file:
```
DATABASE_URL="mysql://user:password@localhost:3306/blog_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret"
```

### 3. Update Database Schema
```bash
npx prisma migrate dev --name add_admin_field
npx prisma generate
```

### 4. Create First Admin User
Create a file `create-admin.js`:
```javascript
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      isAdmin: true,
    },
  });
  
  console.log('Admin created:', admin);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run it:
```bash
node create-admin.js
```

### 5. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

## 📱 Features

### Mobile Navbar
- Responsive hamburger menu (mobile)
- Smooth Framer Motion animations
- Dark theme matching the landing page
- Admin-specific navigation

### Admin Features
- **Login:** `/login` - Admin-only authentication
- **Dashboard:** `/admin/dashboard` - View all posts
- **Create:** `/admin/dashboard/create` - Create new blog post
- **Edit:** `/admin/dashboard/edit/[id]` - Edit existing post
- **Delete:** Admin can delete posts from dashboard

### Public Features
- **Home:** `/` - Landing page with hero section
- **Blogs:** `/posts` - View all published blogs
- **Read:** `/posts/[id]` - Read full blog post

## 🔐 Authentication

### Admin Login
- Only users with `isAdmin = true` can login
- Email: `admin@example.com`
- Password: `admin123` (change this!)

### Regular Users
- No registration or login needed
- Can only view blogs

## 📁 Project Structure

```
src/
├── app/
│   ├── admin/
│   │   └── dashboard/
│   │       ├── page.tsx (Dashboard)
│   │       ├── create/ (Create post)
│   │       └── edit/[id]/ (Edit post)
│   ├── api/
│   │   ├── auth/[...nextauth]/ (NextAuth routes)
│   │   └── posts/ (Blog API)
│   ├── login/ (Admin login page)
│   ├── posts/ (Public blogs page)
│   ├── layout.tsx (Root layout with navbar)
│   └── page.tsx (Landing page)
├── components/
│   ├── Navbar.tsx (Mobile navbar with animations)
│   ├── AdminBlogList.tsx (Admin blog management)
│   └── (other components)
├── lib/
│   ├── auth.ts (NextAuth configuration)
│   └── db.ts (Prisma client)
├── middleware.ts (Route protection)
└── types/
    └── next-auth.d.ts (Type definitions)
```

## 🎨 Design

- **Colors:** Dark theme (slate-950 background)
- **Animations:** Framer Motion for smooth transitions
- **Components:** Tailwind CSS + shadcn/ui
- **Typography:** Inter font

## 🔧 Available Commands

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start

# Lint
npm run lint

# Database migrations
npx prisma migrate dev
npx prisma studio  # Visual database editor
```

## ⚠️ Important Notes

1. **Database Migration:** After updating schema, run migrations:
   ```bash
   npx prisma migrate dev
   ```

2. **Admin Creation:** First admin must be created via script
   - Users can't self-register
   - Must set `isAdmin: true` in database

3. **Secrets:** 
   - Generate a secure `NEXTAUTH_SECRET`
   - Change default admin password

4. **Deployment:** 
   - Update `NEXTAUTH_URL` for your domain
   - Set all environment variables in production

## 🐛 Troubleshooting

### Database Connection Error
- Check MySQL is running
- Verify DATABASE_URL is correct
- Ensure database exists

### Login Not Working
- Verify user exists in database with `isAdmin = true`
- Check credentials in create-admin.js
- Check NEXTAUTH_SECRET is set

### Navbar Not Showing
- Clear browser cache
- Restart development server
- Check browser console for errors

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Framer Motion](https://www.framer.com/motion)
- [Tailwind CSS](https://tailwindcss.com)
