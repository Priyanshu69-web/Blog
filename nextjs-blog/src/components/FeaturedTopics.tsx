import { Code2, Zap, BookOpen, Lightbulb } from "lucide-react";

const topics = [
  {
    icon: Code2,
    title: "JavaScript",
    description:
      "ES6+, async/await, closures, and modern JavaScript patterns explained with real examples.",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: Zap,
    title: "React",
    description:
      "Components, hooks, state management, and building scalable React applications.",
    color: "from-blue-400 to-cyan-500",
  },
  {
    icon: BookOpen,
    title: "Node.js",
    description:
      "Server-side JavaScript, Express, middleware, and building REST APIs from scratch.",
    color: "from-green-400 to-emerald-500",
  },
  {
    icon: Lightbulb,
    title: "MongoDB",
    description:
      "NoSQL databases, document modeling, aggregations, and database optimization.",
    color: "from-green-500 to-teal-500",
  },
];

const additionalTopics = [
  {
    icon: Code2,
    title: "System Design",
    description:
      "Scalability, microservices, caching strategies, and designing large systems.",
    color: "from-purple-400 to-pink-500",
  },
  {
    icon: Zap,
    title: "Real-World Projects",
    description:
      "Full-stack applications, deployment, debugging, and production best practices.",
    color: "from-indigo-400 to-blue-500",
  },
];

export function FeaturedTopics() {
  return (
    <section className="py-20 md:py-32 bg-slate-950 text-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured Topics
          </h2>
          <p className="text-lg text-slate-400">
            Dive deep into essential web development technologies
          </p>
        </div>

        {/* Topic Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {topics.map((topic, index) => {
            const IconComponent = topic.icon;
            return (
              <div
                key={index}
                className="group relative p-8 rounded-xl border border-slate-700 bg-slate-900/50 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
              >
                {/* Gradient background on hover */}
                <div
                  className={`absolute inset-0 rounded-xl bg-linear-to-r ${topic.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div
                    className={`inline-flex p-3 rounded-lg bg-linear-to-r ${topic.color} text-white mb-4`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 text-white">
                    {topic.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 leading-relaxed">
                    {topic.description}
                  </p>

                  {/* Hover indicator */}
                  <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Explore</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional topics */}
        {/* <div className="grid md:grid-cols-2 gap-6">
          {additionalTopics.map((topic, index) => {
            const IconComponent = topic.icon;
            return (
              <div
                key={index}
                className="group relative p-8 rounded-xl border border-slate-700 bg-slate-900/50 hover:border-slate-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1"
              >
                <div
                  className={`absolute inset-0 rounded-xl bg-linear-to-r ${topic.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>

                <div className="relative z-10">
                  <div
                    className={`inline-flex p-3 rounded-lg bg-linear-to-r ${topic.color} text-white mb-4`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold mb-3 text-white">
                    {topic.title}
                  </h3>
                  <p className="text-slate-400 leading-relaxed">
                    {topic.description}
                  </p>

                  <div className="mt-4 flex items-center gap-2 text-blue-400 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Explore</span>
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div> */}
      </div>
    </section>
  );
}
