import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ApplicationsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Filter bar skeleton */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full sm:w-96 rounded-xl" />
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>

      {/* Status tabs skeleton */}
      <div className="flex items-center gap-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-lg" />
        ))}
      </div>

      {/* Table skeleton */}
      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-xl" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-28 hidden sm:block" />
                <Skeleton className="h-4 w-20 hidden md:block" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
