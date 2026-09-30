import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "relative overflow-hidden rounded-md bg-[#EFE8DD]/70 dark:bg-[#20150D]/70 before:absolute before:inset-0 before:-translate-x-full before:animate-[motion-shimmer_1.8s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/30 dark:before:via-white/5 before:to-transparent motion-reduce:before:hidden motion-reduce:animate-pulse",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
