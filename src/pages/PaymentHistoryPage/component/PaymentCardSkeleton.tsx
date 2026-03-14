import { Skeleton } from '@/components/ui/skeleton'

export default function PaymentCardSkeleton() {
  return (
    <div className="rounded-[24px] border border-zinc-200 bg-white px-6 py-5 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1">
          <Skeleton className="mb-3 h-4 w-24 rounded-md" />
          <Skeleton className="h-8 w-64 rounded-md" />
          <div className="mt-4 flex flex-wrap gap-2">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className="h-4 w-36 rounded-md" />
            <Skeleton className="h-4 w-24 rounded-md" />
          </div>
        </div>

        <Skeleton className="h-10 w-28 rounded-full" />
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>
    </div>
  )
}
