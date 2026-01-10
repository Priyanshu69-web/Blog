"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Trash2, Edit, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Blog {
  id: number;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  userId?: number;
  user?: { name: string };
}

export function AdminBlogList({ initialPosts }: { initialPosts: Blog[] }) {
  const [posts, setPosts] = useState(initialPosts);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== id));
      } else {
        alert("Failed to delete post");
      }
    } catch (error) {
      alert("Error deleting post");
      console.error("Delete error:", error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">All Posts</h2>
        <span className="text-slate-400">{posts.length} posts</span>
      </div>

      {posts.length === 0 ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="text-center py-12">
            <p className="text-slate-400">No posts yet. Create your first post!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {post.title}
                        </h3>
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                          {post.content}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center rounded-md bg-blue-900/30 px-2 py-1 text-xs font-medium text-blue-300 border border-blue-700">
                            {post.category}
                          </span>
                          <span className="text-xs text-slate-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <Link href={`/posts/${post.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto border-slate-600 text-slate-200 hover:bg-slate-800"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </Link>

                        <Link href={`/admin/dashboard/edit/${post.id}`}>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="w-full sm:w-auto bg-blue-900 hover:bg-blue-800 text-blue-100"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        </Link>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(post.id)}
                          disabled={deletingId === post.id}
                          className="w-full sm:w-auto"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          {deletingId === post.id ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
