import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/SectionHeading";
import Link from "next/link";

interface Post {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  user: {
    name: string;
  };
}

async function getLatestPosts(): Promise<Post[]> {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/posts?limit=6`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) {
      return [];
    }
    const data = await res.json();
    return data.posts || [];
  } catch (error) {
    console.error("Error fetching latest posts:", error);
    return [];
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

// Calculate read time (rough estimate: 200 words per minute)
function calculateReadTime(content: string): string {
  const text = stripHtml(content);
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
}

export async function LatestBlogs() {
  const posts = await getLatestPosts();

  return (
    <section className="py-20 md:py-32 bg-background text-foreground">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <SectionHeading
          title="Latest Blog Posts"
          description="Fresh insights, tutorials, and guides published regularly"
        />

        {/* Blog Grid */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold mb-2 text-foreground">No posts yet</h3>
              <p className="text-muted-foreground">
                Check back soon for new blog posts!
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {posts.map((post) => (
                <Link href={`/posts/${post.id}`} key={post.id}>
                  <article className="group relative h-full p-6 rounded-xl border border-border bg-card/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 cursor-pointer">
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>

                    <div className="relative z-10 flex flex-col h-full">
                      {/* Category Tag */}
                      <div className="mb-4">
                        <Badge variant="category">{post.category}</Badge>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-muted-foreground text-sm mb-6 flex-grow line-clamp-3">
                        {stripHtml(post.content)}
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="text-xs text-muted-foreground">
                          <div>{formatDate(post.createdAt)}</div>
                          <div>{calculateReadTime(post.content)}</div>
                        </div>
                        <div className="flex items-center gap-1 text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span>Read</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center">
              <Link href="/posts">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-lg flex items-center gap-2 mx-auto transition-all hover:gap-3">
                  View All Articles
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
