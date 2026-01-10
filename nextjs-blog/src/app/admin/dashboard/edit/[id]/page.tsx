"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const categories = [
  "JavaScript",
  "React",
  "Node.js",
  "MongoDB",
  "System Design",
  "Web Development",
  "Other",
];

export default function EditPostPage() {
  const params = useParams();
  const id = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "JavaScript",
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/posts/${id}`);
        if (response.ok) {
          const post = await response.json();
          setFormData({
            title: post.title,
            content: post.content,
            category: post.category,
          });
        } else {
          setError("Failed to load post");
        }
      } catch (error) {
        setError("An error occurred while loading the post");
        console.error("Fetch post error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Title and content are required");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update post");
      }
    } catch (error) {
      setError("An error occurred while updating the post");
      console.error("Update post error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Loading post...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Back Button */}
          <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* Card */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-white text-2xl">Edit Post</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-md"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-slate-200 mb-2">
                    Post Title
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                    placeholder="Enter post title"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-200 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-slate-200 mb-2">
                    Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    required
                    value={formData.content}
                    onChange={handleChange}
                    rows={10}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-500"
                    placeholder="Write your post content here..."
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Link href="/admin/dashboard" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-slate-600 text-slate-200 hover:bg-slate-800"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
