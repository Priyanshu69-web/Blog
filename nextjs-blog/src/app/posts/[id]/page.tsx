import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";

interface Comment {
  id: number;
  name: string;
  comment: string;
  createdAt: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  userId: number;
  user: {
    name: string;
  };
  comments: Comment[];
}

async function getPost(id: string): Promise<Post | null> {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/posts/${id}`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch post");
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching post:", error);
    return null;
  }
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  const session = await getServerSession(authOptions);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/posts">
          <Button variant="outline" className="mb-4">
            ← Back to Posts
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold">{post.title}</h1>
          {session?.user?.id === post.userId.toString() && (
            <div className="flex gap-2">
              <Link href={`/posts/${post.id}/edit`}>
                <Button variant="secondary">Edit</Button>
              </Link>
              <form
                action={`/api/posts/${post.id}`}
                method="POST"
                className="inline"
              >
                <input type="hidden" name="_method" value="DELETE" />
                <Button
                  type="submit"
                  variant="destructive"
                  onClick={(e) => {
                    if (
                      !confirm("Are you sure you want to delete this post?")
                    ) {
                      e.preventDefault();
                    }
                  }}
                >
                  Delete
                </Button>
              </form>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <span className="text-muted-foreground">By {post.user.name}</span>
          <span className="inline-flex items-center rounded-md bg-secondary px-3 py-1 text-sm font-medium">
            {post.category}
          </span>
        </div>

        <div className="prose prose-lg max-w-none">
          <p className="whitespace-pre-wrap">{post.content}</p>
        </div>
      </div>

      {/* Comments Section */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">
          Comments ({post.comments.length})
        </h2>

        {/* Add Comment Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add a Comment</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={`/api/posts/${post.id}/comments`} method="POST">
              <div className="space-y-4">
                <div>
                  <Input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    required
                  />
                </div>
                <div>
                  <Textarea
                    name="comment"
                    placeholder="Write your comment..."
                    rows={4}
                    required
                  />
                </div>
                <Button type="submit">Post Comment</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Comments List */}
        {post.comments.length === 0 ? (
          <p className="text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{comment.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground">{comment.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
