import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-r from-blue-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Level Up Your Development Skills?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Start exploring our comprehensive guides and build amazing projects today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/posts">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-slate-100 px-8 py-6 text-lg rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center transition-all">
                Explore All Articles
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-white text-white hover:bg-white/10 w-full sm:w-auto justify-center">
              Start Learning Now
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-slate-300">
            <div>✓ 100% Free & Open</div>
            <div>✓ Updated Weekly</div>
            <div>✓ Beginner Friendly</div>
            <div>✓ Production Ready</div>
          </div>
        </div>
      </div>
    </section>
  );
}
