import { Card } from "./card";
import { Skeleton } from "./skeleton";

export function AssistantSkeleton() {
  return (
    <Card className="animate-come-down mt-4 flex w-full justify-center p-6">
      <div className="w-full space-y-4">
        <div className="space-y-2">
          <div className="animate-build-skeleton h-6 w-[300px] rounded-md bg-primary/10 delay-100 ease-out" />
          <div className="animate-build-skeleton delay-120 h-4 w-[400px] rounded-md bg-primary/10 ease-out" />
        </div>
        <div className="animate-build-skeleton delay-140 flex flex-wrap gap-2">
          <div className="animate-build-skeleton delay-140 h-8 w-[75px] rounded-md bg-primary/10 ease-out md:w-[150px]" />
          <div className="animate-build-skeleton delay-160 h-8 w-[78px] rounded-md bg-primary/10 ease-out md:w-[135px]" />
          <div className="animate-build-skeleton delay-180 h-8 w-[83px] rounded-md bg-primary/10 ease-out md:w-[110px]" />
          <div className="animate-build-skeleton h-8 w-[95px] rounded-md bg-primary/10 delay-200 ease-out md:w-[150px]" />
        </div>
        <div className="w-full space-y-2">
          <div className="animate-build-skeleton delay-220 h-8 w-full rounded-md bg-primary/10 ease-out" />
          <div className="animate-build-skeleton delay-240 h-8 w-full rounded-md bg-primary/10 ease-out" />
        </div>
      </div>
    </Card>
  );
}
