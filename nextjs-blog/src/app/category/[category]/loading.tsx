import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto px-4">
        {/* Back Button Skeleton */}
        <div className="h-6 w-32 bg-muted rounded mb-6 animate-pulse"></div>

        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="h-12 w-64 bg-muted rounded mb-4 animate-pulse"></div>
          <div className="h-6 w-48 bg-muted rounded animate-pulse"></div>
        </div>

        {/* Posts Grid Skeleton */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="bg-card border-border">
              <CardHeader>
                <div className="h-6 w-full bg-muted rounded mb-2 animate-pulse"></div>
                <div className="h-6 w-3/4 bg-muted rounded mb-4 animate-pulse"></div>
                <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-full bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="h-8 w-24 bg-muted rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

