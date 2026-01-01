const fs = require('fs');
const path = require('path');

// Create directories
const dirs = [
  'src/app/login',
  'src/app/api/auth/[...nextauth]',
  'src/app/api/posts/[id]/comments',
];

dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Create login/page.tsx
const loginContent = `"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/posts");
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      setError("An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}`;

fs.writeFileSync(path.join(__dirname, 'src/app/login/page.tsx'), loginContent);
console.log('Created src/app/login/page.tsx');

// Create create-post/page.tsx
const createPostContent = `"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function CreatePostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (status === "loading") {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const category = formData.get("category") as string;

    if (!title || !content || !category) {
      setError("All fields are required!");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, category }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Post created successfully!");
        setTimeout(() => {
          router.push("/posts");
        }, 2000);
      } else {
        setError(data.error || "Error creating post");
      }
    } catch (error) {
      setError("Error creating post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <Link href="/posts">
          <Button variant="outline" className="mb-4">
            ← Back to Posts
          </Button>
        </Link>
        <h1 className="text-4xl font-bold">Create New Blog Post</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Post</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-100 border border-green-200 rounded-md">
              <p className="text-green-800">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <Input
                id="title"
                name="title"
                type="text"
                placeholder="Enter post title"
                required
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium mb-2"
              >
                Content
              </label>
              <Textarea
                id="content"
                name="content"
                rows={8}
                placeholder="Write your blog content here..."
                required
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-2"
              >
                Category
              </label>
              <Input
                id="category"
                name="category"
                type="text"
                placeholder="e.g., Technology, Travel, Food"
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creating..." : "Create Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}`;

fs.writeFileSync(path.join(__dirname, 'src/app/create-post/page.tsx'), createPostContent);
console.log('Created src/app/create-post/page.tsx');

// Create auth/[...nextauth]/route.ts
const authRouteContent = `import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };`;

fs.writeFileSync(path.join(__dirname, 'src/app/api/auth/[...nextauth]/route.ts'), authRouteContent);
console.log('Created src/app/api/auth/[...nextauth]/route.ts');

// Create comments route
const commentsRouteContent = `import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/posts/[id]/comments - Create a comment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = parseInt(params.id);
    const { name, comment } = await request.json();

    if (!name || !comment) {
      return NextResponse.json(
        { error: "Name and comment are required" },
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
        name,
        comment,
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
}`;

fs.writeFileSync(path.join(__dirname, 'src/app/api/posts/[id]/comments/route.ts'), commentsRouteContent);
console.log('Created src/app/api/posts/[id]/comments/route.ts');

console.log('All files created successfully!');
