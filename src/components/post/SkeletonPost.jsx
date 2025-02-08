import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonPost() {
  return [...Array(12)].map((_, index) => (
    <div key={index} className="h-[22rem] w-full">
      <Skeleton className="w-full h-full rounded-xl" />
    </div>
  ));
}
