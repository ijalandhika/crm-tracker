import { Skeleton } from "@/components/ui/skeleton";

export const InitLoading = () => {
  return (
    <div className="flex min-h-svh flex-col p-6 md:p-10">
      <Skeleton className="w-full h-6 mb-4" />
      <Skeleton className="w-full h-6 mb-4" />
      <Skeleton className="w-full h-6 mb-4" />
      <Skeleton className="w-full h-6 mb-4" />
      <Skeleton className="w-full h-6 mb-4" />
    </div>
  );
};
