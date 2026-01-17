/**
 * Script to create an admin user
 * Usage: node scripts/create-admin.js <email> <password> <name>
 * Example: node scripts/create-admin.js admin@example.com password123 "Admin User"
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function createAdmin() {
  const args = process.argv.slice(2);
  
  if (args.length < 3) {
    console.error("Usage: node scripts/create-admin.js <email> <password> <name>");
    console.error("Example: node scripts/create-admin.js admin@example.com password123 'Admin User'");
    process.exit(1);
  }

  const [email, password, name] = args;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`User with email ${email} already exists.`);
      
      if (existingUser.isAdmin) {
        console.log("User is already an admin. Use a different email or update the existing user.");
        process.exit(1);
      } else {
        // Update existing user to admin
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
          where: { email },
          data: {
            name,
            password: hashedPassword,
            isAdmin: true,
          },
        });
        console.log(`✓ Updated user ${email} to admin successfully!`);
      }
    } else {
      // Create new admin user
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const admin = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          isAdmin: true,
        },
      });

      console.log(`✓ Admin user created successfully!`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Name: ${admin.name}`);
      console.log(`  Is Admin: ${admin.isAdmin}`);
    }
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
