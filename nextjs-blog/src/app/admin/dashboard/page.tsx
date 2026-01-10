import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllPosts } from "@/services/post.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AdminBlogList } from "@/components/AdminBlogList";

interface Blog {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  userId: number;
  user: {
    name: string;
  };
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.isAdmin) {
    redirect("/login");
  }

  let posts: Blog[] = [];
  try {
    const fetchedPosts = await getAllPosts();
    posts = fetchedPosts.map((post: any) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      category: post.category,
      createdAt: post.createdAt,
      userId: post.userId,
      user: post.user,
    }));
  } catch (error) {
    console.error("Failed to fetch posts:", error);
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage your blog posts</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-200">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-400">{posts.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-200">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-400">{posts.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-slate-200">Admin Access</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-slate-400">Manage all content</div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="mb-8">
          <Link href="/admin/dashboard/create">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              + Create New Post
            </Button>
          </Link>
        </div>

        {/* Blog List */}
        <AdminBlogList initialPosts={posts} />
      </div>
    </div>
  );
}
