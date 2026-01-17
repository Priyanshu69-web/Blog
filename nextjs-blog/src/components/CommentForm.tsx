"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface CommentFormProps {
  postId: number;
}

export function CommentForm({ postId }: CommentFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate: at least one of name or email must be provided
    if (!name.trim() && !email.trim()) {
      setError("Please provide either your name or email");
      setIsLoading(false);
      return;
    }

    if (!comment.trim()) {
      setError("Comment text is required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim() || null,
          email: email.trim() || null,
          comment: comment.trim(),
        }),
      });

      if (response.ok) {
        // Clear form
        setName("");
        setEmail("");
        setComment("");
        // Refresh the page to show new comment
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to post comment");
      }
    } catch (error) {
      setError("An error occurred while posting the comment");
      console.error("Comment error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="mb-6 bg-slate-900 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Add a Comment</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 p-4 bg-red-900/20 border border-red-700 rounded-md">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name (optional)"
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
              />
            </div>
            <div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email (optional)"
                className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
              />
            </div>
          </div>
          <div className="text-xs text-slate-400">
            Please provide either name or email (or both)
          </div>
          <div>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment..."
              rows={4}
              required
              className="bg-slate-800 border-slate-700 text-white placeholder-slate-500"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? "Posting..." : "Post Comment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
