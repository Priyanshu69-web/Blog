import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/posts/[id]/comments - Create a comment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);
    
    // Handle both JSON and FormData
    let body;
    const contentType = request.headers.get("content-type");
    
    if (contentType?.includes("application/json")) {
      body = await request.json();
    } else {
      const formData = await request.formData();
      body = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        comment: formData.get("comment") as string,
      };
    }

    const { name, email, comment } = body;

    // At least one of name or email is required
    if ((!name || name.trim() === "") && (!email || email.trim() === "")) {
      return NextResponse.json(
        { error: "Either name or email is required" },
        { status: 400 }
      );
    }

    if (!comment || comment.trim() === "") {
      return NextResponse.json(
        { error: "Comment text is required" },
        { status: 400 }
      );
    }

    // Check if blog post exists
    const blog = await prisma.blog.findUnique({
      where: { id: postId },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const newComment = await prisma.comment.create({
      data: {
        name: name?.trim() || null,
        email: email?.trim() || null,
        comment: comment.trim(),
        blogId: postId,
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
