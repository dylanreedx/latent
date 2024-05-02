import { Skeleton } from "./skeleton";

export default function QuestionCardSkeleton() {
  return (
    <div className="mx-auto mt-32 flex min-h-screen max-w-3xl">
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-[300px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-[450px]" />
          <Skeleton className="h-8 w-[450px]" />
          <Skeleton className="h-8 w-[450px]" />
          <Skeleton className="h-8 w-[450px]" />
        </div>
      </div>
    </div>
  );
}
