import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

// GET /api/posts - Get all posts with search, pagination, and category filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "9");
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (search) {
      // MySQL doesn't support mode: "insensitive", but case-insensitive search works by default in MySQL
      const searchLower = search.toLowerCase();
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
        { category: { contains: search } },
      ];
    }

    if (category) {
      where.category = category;
    }

    // Get total count for pagination
    const total = await prisma.blog.count({ where });

    // Get posts with pagination
    const posts = await prisma.blog.findMany({
      where,
      include: {
        user: { select: { name: true } },
        comments: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    // Get all unique categories for filter
    const categories = await prisma.blog.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      categories: categories.map((c) => c.category),
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized - Admin only" }, { status: 401 });
    }

    const { title, content, category } = await request.json();

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const post = await prisma.blog.create({
      data: {
        title,
        content,
        category,
        userId: parseInt(session.user.id),
      },
      include: { user: { select: { name: true } } },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
