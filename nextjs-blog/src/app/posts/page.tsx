import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getAllPosts } from "@/services/post.service";

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
  const isAdmin = session?.user?.isAdmin;

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">All Blog Posts</h1>

          {isAdmin && (
            <Link href="/admin/dashboard">
              <Button className="bg-blue-600 hover:bg-blue-700">Admin Dashboard</Button>
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground">No blogs available.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              return (
                <Card key={post.id} className="h-full bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-xl text-white">{post.title}</CardTitle>

                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-slate-400">
                        By {post.user.name}
                      </span>

                      <span className="inline-flex items-center rounded-md bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-300 border border-blue-700">
                        {post.category}
                      </span>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-slate-400 mb-4">
                      {post.content.substring(0, 150)}...
                    </p>

                    <div className="flex gap-2">
                      <Link href={`/posts/${post.id}`}>
                        <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-800">
                          Read More
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
