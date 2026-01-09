import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAllPosts } from "@/services/post.service";
import DeletePostButton from "@/components/DeletePostButton";

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  userId: number;
  user: {
    name: string;
  };
}

export default async function PostsPage() {
  let posts: Post[] = [];
  try {
    posts = await getAllPosts();
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }
  
  const session = await getServerSession(authOptions);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">All Blog Posts</h1>

        {session?.user && (
          <Link href="/create-post">
            <Button>Create New Post</Button>
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <p className="text-center text-muted-foreground">No blogs available.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const isOwner =
              session?.user?.id && Number(session.user.id) === post.userId;

            return (
              <Card key={post.id} className="h-full">
                <CardHeader>
                  <CardTitle className="text-xl">{post.title}</CardTitle>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-muted-foreground">
                      By {post.user.name}
                    </span>

                    <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium">
                      {post.category}
                    </span>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {post.content.substring(0, 150)}...
                  </p>

                  <div className="flex gap-2">
                    <Link href={`/posts/${post.id}`}>
                      <Button variant="outline" size="sm">
                        Read More
                      </Button>
                    </Link>

                    {isOwner && (
                      <>
                        <Link href={`/posts/${post.id}/edit`}>
                          <Button variant="secondary" size="sm">
                            Edit
                          </Button>
                        </Link>

                        <DeletePostButton postId={post.id} />
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
