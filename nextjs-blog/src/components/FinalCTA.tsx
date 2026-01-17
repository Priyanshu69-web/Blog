import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-20 md:py-32 bg-background text-foreground relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">Ready to Level Up Your Development Skills?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Start exploring our comprehensive guides and build amazing projects today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/posts">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center transition-all">
                Explore All Articles
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-6 text-lg border-border text-foreground hover:bg-accent w-full sm:w-auto justify-center">
              Start Learning Now
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
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
