import { LandingHero } from "@/components/LandingHero";
import { FeaturedTopics } from "@/components/FeaturedTopics";
import { WhyMyBlogSpace } from "@/components/WhyMyBlogSpace";
import { LatestBlogs } from "@/components/LatestBlogs";
import { AboutSection } from "@/components/AboutSection";
import { FinalCTA } from "@/components/FinalCTA";
import { LandingFooter } from "@/components/LandingFooter";

export default function Home() {
  return (
    <main className="bg-background">
      <LandingHero />
      <FeaturedTopics />
      <WhyMyBlogSpace />
      <LatestBlogs />
      <AboutSection />
      <FinalCTA />
      <LandingFooter />
    </main>
  );
}
