import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  userId: number;
  createdAt: string;
  user: {
    name: string;
  };
}

async function getCategoryPosts(category: string): Promise<{ posts: Post[]; category: string } | null> {
  try {
    const decodedCategory = decodeURIComponent(category);
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/posts?category=${encodeURIComponent(decodedCategory)}&limit=50`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error("Failed to fetch posts");
    }
    const data = await res.json();
    return {
      posts: data.posts || [],
      category: decodedCategory,
    };
  } catch (error) {
    console.error("Error fetching category posts:", error);
    return null;
  }
}

// Strip HTML tags for preview
function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").substring(0, 150);
}

// Format date
function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const data = await getCategoryPosts(params.category);

  if (!data) {
    notFound();
  }

  const { posts, category } = data;

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Category Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Category: {category}
          </h1>
          <p className="text-lg text-muted-foreground">
            {posts.length} {posts.length === 1 ? "post" : "posts"} found in this category
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold mb-2 text-foreground">No posts found</h2>
              <p className="text-muted-foreground mb-6">
                There are no posts in the "{category}" category yet.
              </p>
              <Link href="/posts">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Browse All Posts
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`}>
                <Card className="h-full bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer">
                  <CardHeader>
                    <CardTitle className="text-xl text-card-foreground line-clamp-2">
                      {post.title}
                    </CardTitle>

                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-sm text-muted-foreground">
                        By {post.user.name}
                      </span>
                      <Badge variant="category">{post.category}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {stripHtml(post.content)}...
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(post.createdAt)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border text-foreground hover:bg-accent"
                      >
                        Read More →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

