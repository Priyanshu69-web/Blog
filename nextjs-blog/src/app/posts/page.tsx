import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { BlogListing } from "@/components/BlogListing";

export default async function PostsPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.isAdmin;

  return <BlogListing isAdmin={isAdmin} />;
}
