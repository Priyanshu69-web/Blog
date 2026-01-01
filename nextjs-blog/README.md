# Next.js Blog Application

A modern, full-stack blog application built with Next.js, TypeScript, Prisma ORM, and NextAuth authentication.

---

## ✨ Features

- ✅ **User Authentication**: Register and login with email/password
- ✅ **Blog Posts**: Create, read, update, and delete blog posts
- ✅ **Categories**: Organize posts by category
- ✅ **Comments**: Public comment system on blog posts
- ✅ **Responsive Design**: Mobile-first UI

---

## 📖 Documentation

Comprehensive documentation is provided in separate files:

| Document | Purpose |
|----------|---------|
| [**PROJECT_DOCUMENTATION.md**](./PROJECT_DOCUMENTATION.md) | Complete guide to every file in the project |
| [**API_DOCUMENTATION.md**](./API_DOCUMENTATION.md) | All API endpoints with examples |
| [**DATABASE_SCHEMA.md**](./DATABASE_SCHEMA.md) | Database models and relationships |
| [**SETUP_AND_DEPLOYMENT.md**](./SETUP_AND_DEPLOYMENT.md) | Setup, building, and deployment guide |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (18+ recommended)
- npm or yarn
- MySQL 5.7+

### Installation
```bash
git clone <repo-url>
cd nextjs-blog
npm install
```

### Environment Setup
Create `.env.local`:
```env
DATABASE_URL="mysql://user:password@localhost:3306/blog_db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
```

### Setup Database
```bash
npx prisma migrate dev --name init
```

### Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

---

## 🛠️ Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Run ESLint
```

---

## 🗄️ Tech Stack

- **Next.js** 16.1.0
- **React** 19.2.3
- **TypeScript** 5
- **Prisma** 7.2.0 ORM
- **NextAuth** 4.24.13
- **Tailwind CSS** 4
- **MySQL** 8.0
- **bcryptjs** for password hashing

---

## 📁 Project Structure

```
src/
├── app/              # Next.js App Router (pages & API routes)
├── components/       # React components
├── lib/              # Utilities and configuration
└── types/            # TypeScript types

prisma/
└── schema.prisma    # Database schema definition
```

---

## 🔗 Key Routes

### Public
- `/` - Home page
- `/posts` - All blog posts
- `/posts/[id]` - Single blog post
- `/register` - User registration
- `/login` - User login

### Protected (Authentication required)
- `/create-post` - Create new blog post
- `/posts/[id]/edit` - Edit blog post (author only)

---

## 🔐 Security Features

- Bcrypt password hashing (10 rounds)
- JWT-based session management
- CSRF protection (NextAuth)
- SQL injection prevention (Prisma ORM)
- Authorization checks on protected routes
- Ownership verification for edit/delete

---

## 🚢 Deployment

Deploy to Vercel (recommended):
```bash
vercel
```

See **SETUP_AND_DEPLOYMENT.md** for AWS, DigitalOcean, Heroku, and other platform guides.

---

## 🐛 Troubleshooting

**Database connection error?**
```bash
# Check MySQL is running
mysql -u root -p -e "SELECT 1"
# Verify DATABASE_URL in .env.local
```

**NextAuth session not working?**
```bash
# Ensure NEXTAUTH_SECRET is set
# Check .env.local (not .env) exists
```

See **SETUP_AND_DEPLOYMENT.md** for more troubleshooting.

---

## 📚 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org)
- [Tailwind Docs](https://tailwindcss.com/docs)

---

**Status**: Production Ready  
**Last Updated**: December 2025  
**Version**: 1.0.0
