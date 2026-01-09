export function AboutSection() {
  return (
    <section className="py-20 md:py-32 bg-linear-to-b from-slate-950 to-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              About MyBlogSpace
            </h2>
          </div>

          {/* Content */}
          <div className="space-y-6 text-lg text-slate-300">
            <p>
              MyBlogSpace is a developer-focused blog platform designed to help
              programmers, tech learners, and startup enthusiasts master modern
              web development technologies.
            </p>

            <p>
              Whether you're just starting your coding journey or looking to
              deepen your expertise, we provide practical tutorials, real-world
              projects, and in-depth guides that break down complex concepts
              into digestible pieces.
            </p>

            <p>
              Our content covers the full MERN stack (MongoDB, Express, React,
              Node.js), system design principles, JavaScript mastery, and
              everything in between. Each article is carefully crafted with
              runnable code examples and best practices you can use immediately
              in your projects.
            </p>

            <p className="text-slate-400 italic">
              "Build better software by learning from those who code daily."
            </p>

            {/* Mission Statement Card */}
            <div className="mt-8 p-6 rounded-xl border border-slate-700 bg-slate-900/50">
              <h3 className="text-xl font-bold mb-4 text-blue-400">
                Our Mission
              </h3>
              <p className="text-slate-300">
                To democratize technical knowledge and empower developers at
                every level to build production-ready applications with
                confidence, clean code, and modern best practices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
