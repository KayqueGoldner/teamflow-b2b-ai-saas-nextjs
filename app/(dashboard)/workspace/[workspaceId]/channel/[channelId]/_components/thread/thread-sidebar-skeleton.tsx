import { Skeleton } from "@/components/ui/skeleton";

interface ThreadSidebarSkeletonProps {}

export const ThreadSidebarSkeleton = ({}: ThreadSidebarSkeletonProps) => {
  return (
    <div className="flex h-full w-120 flex-col border-l">
      {/* header */}
      <div className="flex h-14 items-center justify-between border-b px-4">
        <div className="flex items-center gap-x-2">
          <Skeleton className="size-4" />
          <Skeleton className="h-4 w-16" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="size-8" />
        </div>
      </div>

      {/* main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="border-b bg-muted/20 p-4">
          <div className="flex gap-3">
            <Skeleton className="size-8 shrink-0 rounded-full" />
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>

              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>

        {/* thread replies */}
        <div className="p-2">
          <div className="mb-3 px-2">
            <Skeleton className="h-3 w-16" />
          </div>

          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex gap-3 px-2">
                <Skeleton className="size-8 shrink-0 rounded-full" />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>

                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* thread reply form */}
      <div className="border-t p-4">
        <Skeleton className="h-56 w-full rounded-md" />
      </div>
    </div>
  );
};
