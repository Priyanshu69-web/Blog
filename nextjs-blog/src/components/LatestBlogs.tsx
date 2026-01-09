import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock blog data - replace with real data from your database
const blogPosts = [
  {
    id: 1,
    title: "Mastering React Hooks: A Complete Guide",
    excerpt: "Learn how to use React hooks effectively to manage state and side effects in functional components.",
    category: "React",
    date: "Jan 8, 2025",
    readTime: "8 min read",
  },
  {
    id: 2,
    title: "Building REST APIs with Node.js and Express",
    excerpt: "Complete tutorial on creating scalable REST APIs with proper error handling and authentication.",
    category: "Node.js",
    date: "Jan 6, 2025",
    readTime: "12 min read",
  },
  {
    id: 3,
    title: "MongoDB Schema Design Best Practices",
    excerpt: "Learn how to design efficient MongoDB schemas for performance and scalability.",
    category: "MongoDB",
    date: "Jan 4, 2025",
    readTime: "10 min read",
  },
  {
    id: 4,
    title: "JavaScript Async/Await Deep Dive",
    excerpt: "Understanding promises, async/await, and error handling in JavaScript.",
    category: "JavaScript",
    date: "Jan 2, 2025",
    readTime: "9 min read",
  },
  {
    id: 5,
    title: "System Design: Building a Scalable Chat Application",
    excerpt: "Learn system design principles by building a real-time chat application architecture.",
    category: "System Design",
    date: "Dec 31, 2024",
    readTime: "15 min read",
  },
  {
    id: 6,
    title: "Full-Stack MERN Application: From Setup to Deployment",
    excerpt: "Complete walkthrough of building and deploying a full-stack application with MongoDB, Express, React, and Node.js.",
    category: "Full Stack",
    date: "Dec 28, 2024",
    readTime: "20 min read",
  },
];

const categoryColors: Record<string, string> = {
  React: "bg-blue-500/10 text-blue-400 border border-blue-500/30",
  "Node.js": "bg-green-500/10 text-green-400 border border-green-500/30",
  MongoDB: "bg-green-600/10 text-green-400 border border-green-600/30",
  JavaScript: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30",
  "System Design": "bg-purple-500/10 text-purple-400 border border-purple-500/30",
  "Full Stack": "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30",
};

export function LatestBlogs() {
  return (
    <section className="py-20 md:py-32 bg-slate-950 text-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Latest Blog Posts</h2>
          <p className="text-lg text-slate-400">Fresh insights, tutorials, and guides published regularly</p>
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {blogPosts.map((post) => (
            <Link href={`/posts/${post.id}`} key={post.id}>
              <article className="group relative h-full p-6 rounded-xl border border-slate-700 bg-slate-900/50 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 cursor-pointer">
                {/* Gradient overlay */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>

                <div className="relative z-10 flex flex-col h-full">
                  {/* Category Tag */}
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[post.category] || categoryColors["Full Stack"]}`}>
                      {post.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-slate-400 text-sm mb-6 flex-grow line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                    <div className="text-xs text-slate-500">
                      <div>{post.date}</div>
                      <div>{post.readTime}</div>
                    </div>
                    <div className="flex items-center gap-1 text-blue-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-lg flex items-center gap-2 mx-auto transition-all hover:gap-3">
              View All Articles
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
