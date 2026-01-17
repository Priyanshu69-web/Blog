import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { CommentForm } from "@/components/CommentForm";

interface Comment {
  id: number;
  name: string | null;
  email: string | null;
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/posts">
          <Button variant="outline" className="mb-4 border-border text-foreground hover:bg-accent">
            ← Back to Posts
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-4xl font-bold text-foreground">{post.title}</h1>
          {session?.user?.isAdmin && (
            <div className="flex gap-2">
              <Link href={`/admin/dashboard/edit/${post.id}`}>
                <Button variant="secondary" className="bg-secondary hover:bg-secondary/80 text-secondary-foreground">
                  Edit
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <span className="text-muted-foreground">By {post.user.name}</span>
          <Badge variant="category">{post.category}</Badge>
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <div 
            className="text-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>

      {/* Comments Section */}
      <div className="border-t border-border pt-8">
        <h2 className="text-2xl font-bold mb-6 text-foreground">
          Comments ({post.comments.length})
        </h2>

        {/* Add Comment Form */}
        <CommentForm postId={post.id} />

        {/* Comments List */}
        {post.comments.length === 0 ? (
          <p className="text-muted-foreground">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className="space-y-4">
            {post.comments.map((comment) => (
              <Card key={comment.id} className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-card-foreground">
                          {comment.name || comment.email || "Anonymous"}
                        </span>
                        {comment.email && comment.name && (
                          <span className="text-xs text-muted-foreground">
                            ({comment.email})
                          </span>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-card-foreground">{comment.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
