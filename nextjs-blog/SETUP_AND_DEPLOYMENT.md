# Setup and Deployment Guide

Complete guide for setting up the Next.js Blog application locally and deploying to production.

---

## Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Running the Application](#running-the-application)
5. [Building for Production](#building-for-production)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Prerequisites
- **Node.js**: v16 or higher (v18+ recommended)
- **npm**: v7 or higher
- **MySQL**: v5.7 or higher (or MariaDB)
- **Git**: For version control
- **Code Editor**: VS Code recommended

### 1. Clone the Repository
```bash
git clone <repository-url>
cd nextjs-blog
```

### 2. Install Dependencies
```bash
npm install
```

This installs all dependencies listed in `package.json`:
- Next.js framework
- React and React DOM
- NextAuth for authentication
- Prisma ORM
- Tailwind CSS
- TypeScript support

### 3. Set Up Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database Configuration
DATABASE_URL="mysql://user:password@localhost:3306/blog_db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

**Generating NEXTAUTH_SECRET**:
```bash
# Using OpenSSL (on Mac/Linux)
openssl rand -base64 32

# Or generate it online and paste
```

### 4. Initialize Prisma
```bash
# Create database and run migrations
npx prisma migrate dev --name init
```

This command:
- Creates the database if it doesn't exist
- Runs all migrations in `prisma/migrations/`
- Generates Prisma Client
- Optionally seeds the database

### 5. Verify Installation
```bash
# Check if everything is installed correctly
npm run build
```

---

## Environment Configuration

### `.env.local` (Development)
```env
# Database - local MySQL instance
DATABASE_URL="mysql://root:password@localhost:3306/blog_dev"

# NextAuth - local development
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-key-not-for-production"

# Optional: Enable debug logging
NEXTAUTH_DEBUG=true
```

### `.env.production` (Production)
```env
# Database - production MySQL instance
DATABASE_URL="mysql://prod_user:secure_password@db.example.com:3306/blog_prod"

# NextAuth - production domain
NEXTAUTH_URL="https://yourblog.com"
NEXTAUTH_SECRET="<generate-with-openssl-rand>"

# Optional: Disable debug in production
NODE_ENV="production"
```

### Database Connection String Format
```
mysql://username:password@host:port/database_name
```

Examples:
- Local: `mysql://root:password@localhost:3306/blog`
- Remote: `mysql://user:pass@db.myhost.com:3306/blog`
- Docker: `mysql://app:secret@mysql-container:3306/blog`

---

## Database Setup

### Option 1: Local MySQL Installation

#### On macOS (using Homebrew):
```bash
# Install MySQL
brew install mysql

# Start MySQL service
brew services start mysql

# Secure installation
mysql_secure_installation

# Create database and user
mysql -u root -p
```

```sql
-- In MySQL prompt
CREATE DATABASE blog_db;
CREATE USER 'blog_user'@'localhost' IDENTIFIED BY 'secure_password';
GRANT ALL PRIVILEGES ON blog_db.* TO 'blog_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### On Windows:
1. Download MySQL from [mysql.com](https://dev.mysql.com/downloads/mysql/)
2. Run installer and follow setup wizard
3. Default port: 3306
4. Create database and user using MySQL Workbench or command line

#### On Linux (Ubuntu/Debian):
```bash
# Install MySQL
sudo apt-get update
sudo apt-get install mysql-server

# Secure installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p
```

### Option 2: Docker MySQL
```bash
# Run MySQL in Docker
docker run --name blog-mysql \
  -e MYSQL_ROOT_PASSWORD=root_password \
  -e MYSQL_DATABASE=blog_db \
  -e MYSQL_USER=blog_user \
  -e MYSQL_PASSWORD=blog_password \
  -p 3306:3306 \
  -d mysql:8.0

# Connection string for .env.local
DATABASE_URL="mysql://blog_user:blog_password@localhost:3306/blog_db"
```

### Option 3: Managed Database Service
- **AWS RDS**: Amazon Relational Database Service
- **Google Cloud SQL**: Google's managed database
- **Azure Database**: Microsoft's database service
- **DigitalOcean Managed**: DigitalOcean's database option

For managed services:
```env
DATABASE_URL="mysql://username:password@db-instance.region.provider.com:3306/blog_db"
```

### Initialize Database Schema
```bash
# Create/update database tables
npx prisma migrate dev --name initial_setup

# Generate Prisma Client
npx prisma generate

# (Optional) Seed database with test data
npx prisma db seed
```

---

## Running the Application

### Development Server
```bash
npm run dev
```

This starts:
- Next.js development server on `http://localhost:3000`
- Hot reload on file changes
- Source maps for debugging

**Available URLs**:
- Homepage: `http://localhost:3000`
- Posts: `http://localhost:3000/posts`
- Register: `http://localhost:3000/register`
- Login: `http://localhost:3000/login`

### Building for Testing
```bash
# Create optimized production build
npm run build

# Start production server locally
npm run start
```

**Note**: Must be run from the project root directory

---

## Building for Production

### 1. Build the Application
```bash
npm run build
```

This process:
- Compiles TypeScript
- Optimizes React components
- Bundles and minifies code
- Generates `.next/` directory
- Reports any build errors

### 2. Verify Build
```bash
# Test production build locally
npm run start

# Visit http://localhost:3000
# Test all pages and functionality
```

### 3. Optimize for Performance
Check `.next/` directory:
```bash
# View build analysis
npm run build -- --analyze
```

---

## Production Deployment

### Option 1: Deploy to Vercel (Recommended for Next.js)

**Why Vercel**:
- Built by Next.js creators
- Zero-config deployment
- Automatic optimizations
- Easy database integration

#### Steps:
1. **Push to GitHub**:
```bash
git add .
git commit -m "Deploy to Vercel"
git push origin main
```

2. **Connect to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import GitHub repository
   - Vercel auto-detects Next.js

3. **Configure Environment Variables**:
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add:
     - `DATABASE_URL`: Production database URL
     - `NEXTAUTH_URL`: Your production domain (e.g., `https://yourblog.com`)
     - `NEXTAUTH_SECRET`: Generated secret key

4. **Deploy**:
   - Click "Deploy"
   - Vercel builds and deploys automatically
   - Access at `https://<project-name>.vercel.app`

5. **Custom Domain**:
   - In Vercel: Settings → Domains
   - Add your domain
   - Update DNS records as instructed

### Option 2: Deploy to AWS

#### Using AWS Amplify:
```bash
# Install Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

#### Using EC2 + SSH:
```bash
# Build the app
npm run build

# Create .env.production with prod variables
echo "DATABASE_URL=..." >> .env.production
echo "NEXTAUTH_SECRET=..." >> .env.production

# Upload to EC2
scp -r .next/ ubuntu@your-ec2-ip:/home/ubuntu/blog/
scp -r node_modules/ ubuntu@your-ec2-ip:/home/ubuntu/blog/
scp -r prisma/ ubuntu@your-ec2-ip:/home/ubuntu/blog/

# On EC2, start the app
cd /home/ubuntu/blog
npm run start

# (Optional) Use PM2 to keep it running
pm2 start "npm run start" --name blog
pm2 startup
pm2 save
```

### Option 3: Deploy to DigitalOcean

```bash
# Create Droplet (Ubuntu 22.04)
# SSH into droplet

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt-get install mysql-server -y

# Clone your repository
git clone <your-repo-url>
cd nextjs-blog

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
npm install -g pm2
pm2 start "npm run start" --name blog
pm2 startup
pm2 save

# Set up Nginx as reverse proxy
# (Configure Nginx to forward to localhost:3000)
```

### Option 4: Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add MySQL add-on
heroku addons:create jawsdb:kitefin

# Set environment variables
heroku config:set NEXTAUTH_SECRET="your-secret"
heroku config:set NEXTAUTH_URL="https://your-app-name.herokuapp.com"

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

## Post-Deployment Tasks

### 1. Database Backup
```bash
# Daily backup
mysqldump -u user -p database_name > backup-$(date +%Y%m%d).sql

# Or use cron job for automated backups
0 2 * * * mysqldump -u user -p database_name > /backups/backup-$(date +\%Y\%m\%d).sql
```

### 2. Monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor database performance
- Check server logs regularly
- Set up uptime monitoring

### 3. Maintenance
```bash
# Update dependencies monthly
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### 4. Scaling
If needed:
- Increase server resources
- Set up database replication
- Use CDN for static assets
- Implement caching

---

## Troubleshooting

### Error: "DATABASE_URL not found"
```bash
# Verify .env.local exists
ls -la .env.local

# Check database URL format
echo $DATABASE_URL

# Recreate if needed
echo 'DATABASE_URL="mysql://user:password@localhost:3306/blog_db"' > .env.local
```

### Error: "Connection refused"
```bash
# Check if MySQL is running
mysql -u root -p -e "SELECT 1"

# If not running, start MySQL
sudo service mysql start    # Linux
brew services start mysql   # macOS
```

### Error: "Cannot find module..."
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Error: "Prisma Client not generated"
```bash
# Regenerate Prisma Client
npx prisma generate

# Or run migrations (which also generates client)
npx prisma migrate dev
```

### Error: "NextAuth session not working"
```bash
# Verify NEXTAUTH_SECRET is set
echo $NEXTAUTH_SECRET

# Verify it's in .env.local (not .env)
cat .env.local | grep NEXTAUTH_SECRET
```

### Performance Issues
```bash
# Analyze bundle size
npm run build -- --analyze

# Check database queries
npx prisma studio
# This opens web interface to view database

# Enable query logging
# Add to .env: DATABASE_URL_LOGGING="true"
```

### Port 3000 Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

---

## Updating the Application

### Getting Latest Updates
```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Rebuild
npm run build

# Restart application
npm run start
```

### Rolling Back to Previous Version
```bash
# List recent commits
git log --oneline -5

# Revert to specific commit
git revert <commit-hash>

# Or reset to previous state
git reset --hard <commit-hash>
```

---

## Performance Optimization

### Database
```javascript
// Use indexes on frequently queried fields
// Add pagination to reduce data transfer
const posts = await prisma.blog.findMany({
  skip: (page - 1) * limit,
  take: limit,
  orderBy: { createdAt: 'desc' }
});
```

### Frontend
```javascript
// Image optimization
<Image 
  src="/image.jpg"
  width={800}
  height={600}
  placeholder="blur"
  loading="lazy"
/>

// Code splitting
import dynamic from 'next/dynamic';
const SlowComponent = dynamic(() => import('./SlowComponent'));
```

### Caching
```bash
# Set cache headers in next.config.ts
// Add response headers for static assets
// Cache frequently accessed data
```

---

## Security Checklist

- [ ] `NEXTAUTH_SECRET` is long (32+ characters) and random
- [ ] Database user has minimal required permissions
- [ ] HTTPS is enabled in production
- [ ] Environment variables are not in git commits
- [ ] SQL injection prevented by Prisma ORM
- [ ] CSRF protection enabled (NextAuth default)
- [ ] Rate limiting implemented
- [ ] Dependencies are up to date
- [ ] Regular security audits (`npm audit`)
- [ ] Backups are automated and tested

---

**Last Updated**: December 2025  
**Version**: 1.0.0
