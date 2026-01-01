import { prisma } from "@/lib/db";

export async function getAllPosts() {
  return prisma.post.findMany({
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
