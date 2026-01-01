"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  userId: number;
}

export default function EditPostPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/${params.id}`);
        if (res.ok) {
          const postData = await res.json();
          // Check if user owns this post
          if (postData.userId !== parseInt(session.user!.id)) {
            router.push("/posts");
            return;
          }
          setPost(postData);
        } else {
          router.push("/posts");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
        router.push("/posts");
      } finally {
        setIsFetching(false);
      }
    };

    fetchPost();
  }, [session, status, params.id, router]);

  if (status === "loading" || isFetching) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!session || !post) {
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
      const res = await fetch(`/api/posts/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content, category }),
      });

      if (res.ok) {
        setSuccess("Post updated successfully!");
        setTimeout(() => {
          router.push(`/posts/${params.id}`);
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.error || "Error updating post");
      }
    } catch (error) {
      setError("Error updating post");
      console.error("Error updating post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <Link href={`/posts/${params.id}`}>
          <Button variant="outline" className="mb-4">
            ← Back to Post
          </Button>
        </Link>
        <h1 className="text-4xl font-bold">Edit Blog Post</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Post</CardTitle>
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
                defaultValue={post.title}
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
                defaultValue={post.content}
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
                defaultValue={post.category}
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Updating..." : "Update Post"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
