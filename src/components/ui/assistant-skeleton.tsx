import { Card } from "./card";
import { Skeleton } from "./skeleton";

export function AssistantSkeleton() {
  return (
    <Card className="mt-4 flex w-full justify-center  p-12">
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-[300px]" />
          <Skeleton className="h-4 w-[400px]" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-[50px] md:w-[150px]" />
          <Skeleton className="h-8 w-[75px] md:w-[135px]" />
          <Skeleton className="h-8 w-[70px] md:w-[110px]" />
          <Skeleton className="h-8 w-[80px] md:w-[150px]" />
        </div>
        <div className="w-full space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </Card>
  );
}
