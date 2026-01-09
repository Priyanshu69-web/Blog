import { CheckCircle2 } from "lucide-react";

const benefits = [
  {
    title: "Practical Tutorials",
    description: "Hands-on guides with code examples you can run immediately and learn from.",
  },
  {
    title: "Beginner to Advanced",
    description: "Start from the basics and progress to advanced concepts and architectural patterns.",
  },
  {
    title: "Real-World Projects",
    description: "Learn through building actual projects with modern best practices and patterns.",
  },
  {
    title: "Complex Made Simple",
    description: "Technical concepts broken down into digestible, easy-to-understand explanations.",
  },
];

export function WhyMyBlogSpace() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Benefits list */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Why MyBlogSpace?</h2>
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <CheckCircle2 className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                    <p className="text-slate-400">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Visual showcase */}
          <div className="relative">
            {/* Code Block Visual */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-700 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-slate-400 ml-4">example.js</span>
              </div>

              {/* Code content */}
              <div className="p-6 font-mono text-sm">
                <div className="text-slate-500">
                  <div><span className="text-blue-400">const</span> <span className="text-cyan-300">buildProject</span> = <span className="text-purple-400">async</span> () =&gt; {"{"}
                  </div>
                  <div className="ml-4">
                    <span className="text-slate-500">// Learn step by step</span>
                  </div>
                  <div className="ml-4">
                    <span className="text-blue-400">const</span> <span className="text-cyan-300">skills</span> = []
                  </div>
                  <div className="ml-4">
                    <span className="text-blue-400">for</span> <span className="text-slate-300">(</span><span className="text-blue-400">let</span> <span className="text-cyan-300">topic</span> <span className="text-blue-400">of</span> [<span className="text-green-400">'React'</span>, <span className="text-green-400">'Node'</span>, <span className="text-green-400">'MongoDB'</span>]) {"{"}
                  </div>
                  <div className="ml-8">
                    <span className="text-cyan-300">skills</span>.<span className="text-purple-400">push</span>(<span className="text-blue-400">await</span> <span className="text-purple-400">learn</span>(<span className="text-cyan-300">topic</span>))
                  </div>
                  <div className="ml-4">{"}"}</div>
                  <div className="ml-4">
                    <span className="text-blue-400">return</span> <span className="text-cyan-300">buildAwesomeApp</span>(<span className="text-cyan-300">skills</span>)
                  </div>
                  <div>{"}"}</div>
                </div>
              </div>
            </div>

            {/* Floating element */}
            <div className="absolute -bottom-6 -right-6 w-40 h-40 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
