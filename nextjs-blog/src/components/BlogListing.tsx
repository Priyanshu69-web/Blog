"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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

interface BlogListingProps {
  isAdmin?: boolean;
}

function BlogListingContent({ isAdmin }: BlogListingProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"));
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    fetchPosts();
  }, [searchParams]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      const currentSearch = searchParams.get("search") || "";
      const currentCategory = searchParams.get("category") || "";
      const currentPage = searchParams.get("page") || "1";

      if (currentSearch) params.append("search", currentSearch);
      if (currentCategory) params.append("category", currentCategory);
      params.append("page", currentPage);
      params.append("limit", "9");

      const response = await fetch(`/api/posts?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts || []);
        setCategories(data.categories || []);
        setPagination(data.pagination || { page: 1, limit: 9, total: 0, totalPages: 1 });
        setPage(data.pagination?.page || 1);
        setSelectedCategory(currentCategory);
        setSearch(currentSearch);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateURL({ search, page: 1 });
  };

  const handleCategoryChange = (category: string) => {
    const newCategory = selectedCategory === category ? "" : category;
    setSelectedCategory(newCategory);
    updateURL({ category: newCategory, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateURL({ page: newPage.toString() });
  };

  const updateURL = (params: { search?: string; category?: string; page?: string | number }) => {
    const newParams = new URLSearchParams(searchParams.toString());
    
    if (params.search !== undefined) {
      if (params.search) newParams.set("search", params.search);
      else newParams.delete("search");
    }
    
    if (params.category !== undefined) {
      if (params.category) newParams.set("category", params.category);
      else newParams.delete("category");
    }
    
    if (params.page !== undefined) {
      if (params.page === 1) newParams.delete("page");
      else newParams.set("page", params.page.toString());
    }

    router.push(`/posts?${newParams.toString()}`);
  };

  // Strip HTML tags for preview
  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, "").substring(0, 150);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-foreground">All Blog Posts</h1>

          {isAdmin && (
            <Link href="/admin/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Admin Dashboard</Button>
            </Link>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-4">
            <Input
              type="text"
              placeholder="Search posts by title, content, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-background border-border text-foreground placeholder-muted-foreground"
            />
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Search
            </Button>
            {search && (
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearch("");
                  updateURL({ search: "", page: 1 });
                }}
                className="border-border text-foreground hover:bg-accent"
              >
                Clear
              </Button>
            )}
          </form>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "" ? "default" : "outline"}
                onClick={() => handleCategoryChange("")}
                className={
                  selectedCategory === ""
                    ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                    : "border-border text-foreground hover:bg-accent"
                }
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => handleCategoryChange(category)}
                  className={
                    selectedCategory === category
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "border-border text-foreground hover:bg-accent"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No blogs found. Try adjusting your search or filter.</p>
          </div>
        ) : (
          <>
            {/* Posts Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="h-full bg-card border-border hover:border-primary/50 transition-colors"
                >
                  <CardHeader>
                    <CardTitle className="text-xl text-card-foreground line-clamp-2">{post.title}</CardTitle>

                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-sm text-muted-foreground">By {post.user.name}</span>

                      <Badge variant="category">{post.category}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {stripHtml(post.content)}...
                    </p>

                    <div className="flex gap-2">
                      <Link href={`/posts/${post.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border text-foreground hover:bg-accent"
                        >
                          Read More
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="border-border text-foreground hover:bg-accent disabled:opacity-50"
                >
                  Previous
                </Button>

                <div className="flex gap-2">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNum === 1 ||
                      pageNum === pagination.totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <Button
                          key={pageNum}
                          variant={pageNum === page ? "default" : "outline"}
                          onClick={() => handlePageChange(pageNum)}
                          className={
                            pageNum === page
                              ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                              : "border-border text-foreground hover:bg-accent"
                          }
                        >
                          {pageNum}
                        </Button>
                      );
                    } else if (pageNum === page - 2 || pageNum === page + 2) {
                      return (
                        <span key={pageNum} className="text-muted-foreground px-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === pagination.totalPages}
                  className="border-border text-foreground hover:bg-accent disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            )}

            {/* Results Info */}
            <div className="text-center mt-4 text-muted-foreground text-sm">
              Showing {posts.length > 0 ? (page - 1) * pagination.limit + 1 : 0} to{" "}
              {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} posts
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function BlogListing({ isAdmin }: BlogListingProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><p className="text-muted-foreground">Loading...</p></div>}>
      <BlogListingContent isAdmin={isAdmin} />
    </Suspense>
  );
}
