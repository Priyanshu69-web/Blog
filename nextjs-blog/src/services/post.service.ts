import { prisma } from "@/lib/db";

export async function getAllPosts() {
  return prisma.blog.findMany({
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
