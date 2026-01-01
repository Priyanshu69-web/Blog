import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-16 md:py-32">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Welcome to <span className="text-primary">Dynamic Blog</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Share your thoughts, stories, and ideas with the world. A modern blogging platform built with Next.js.
            </p>
          </div>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/posts">
              <Button size="lg" className="text-lg px-8">
                Read Posts
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Join Us
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold text-lg mb-2">📝 Easy Publishing</h3>
              <p className="text-muted-foreground">Create and publish blog posts with a simple, intuitive interface.</p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold text-lg mb-2">💬 Community</h3>
              <p className="text-muted-foreground">Engage with readers through comments and discussions.</p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="font-semibold text-lg mb-2">🚀 Modern Tech</h3>
              <p className="text-muted-foreground">Built with Next.js, TypeScript, and modern web standards.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
