import { Skeleton } from "./skeleton";

export default function QuestionCardSkeleton() {
  return (
    <div className="mx-auto mt-32 flex w-full">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="animate-build-skeleton h-6 w-[300px] rounded-md bg-primary/10 delay-100" />
          <div className="animate-build-skeleton h-4 w-[200px] rounded-md bg-primary/10 delay-200" />
        </div>
        <div className="space-y-2">
          <div className="animate-build-skeleton h-8 w-[350px] rounded-md bg-primary/10 delay-300 md:w-[450px]" />
          <div className="animate-build-skeleton delay-400 h-8 w-[350px] rounded-md bg-primary/10 md:w-[450px]" />
          <div className="animate-build-skeleton h-8 w-[350px] rounded-md bg-primary/10 delay-500 md:w-[450px]" />
          <div className="animate-build-skeleton delay-600 h-8 w-[350px] rounded-md bg-primary/10 md:w-[450px]" />
        </div>
      </div>
    </div>
  );
}
