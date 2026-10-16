import { DecorativeDotCluster } from '@/components/ui/decorative-dot-cluster';
import { TrustBar } from '@/components/shared/trust-bar';

export function OrderConfirmationSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1D120A] flex flex-col">
      {/* 1. Hero Breadcrumbs Header Banner Skeleton */}
      <section className="relative w-full overflow-hidden bg-[#FAF8F5] border-b border-[#E7DED0]/60 pt-28 sm:pt-32 pb-12 sm:pb-16 text-center">
        <div className="absolute left-4 sm:left-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-50">
          <DecorativeDotCluster className="w-full h-full" />
        </div>
        <div className="absolute right-4 sm:right-12 top-1/2 -translate-y-1/2 w-32 sm:w-44 h-20 pointer-events-none opacity-50 transform rotate-180">
          <DecorativeDotCluster className="w-full h-full" />
        </div>

        <div className="vakaa-container relative z-10 space-y-4">
          <div className="h-9 sm:h-12 w-64 sm:w-80 bg-stone-200/70 dark:bg-stone-800 rounded-2xl mx-auto animate-pulse" />
          <div className="h-4 w-44 sm:w-56 bg-stone-200/50 dark:bg-stone-800/60 rounded-full mx-auto animate-pulse" />
        </div>
      </section>

      {/* 2. Main Order Confirmation Content Skeleton */}
      <main className="vakaa-container py-10 sm:py-14 max-w-3xl flex-1 space-y-8">
        {/* Visual Status Indicator Skeleton */}
        <div className="text-center space-y-3.5">
          <div className="flex justify-center">
            <div className="size-16 rounded-full bg-stone-200/80 dark:bg-stone-800 animate-pulse" />
          </div>
          <div className="h-7 sm:h-8 w-56 sm:w-72 bg-stone-200/80 dark:bg-stone-800 rounded-xl mx-auto animate-pulse" />
          <div className="h-4 w-72 sm:w-96 bg-stone-200/50 dark:bg-stone-800/60 rounded-full mx-auto animate-pulse" />
        </div>

        {/* 3. Golden Header Order Card Skeleton */}
        <div className="rounded-xl overflow-hidden border border-stone-200/80 dark:border-stone-800 shadow-sm bg-white dark:bg-[#1A120B]">
          {/* VAKAA Luxury Banner Header Skeleton */}
          <div className="bg-[#1D120A] dark:bg-stone-900 text-[#FAF8F5] px-5 py-4 sm:px-7 sm:py-5 grid grid-cols-2 sm:grid-cols-4 gap-4 animate-pulse">
            <div className="space-y-1.5">
              <div className="h-2.5 w-16 bg-white/40 rounded-full" />
              <div className="h-4 w-24 bg-white/70 rounded-md" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 w-20 bg-white/40 rounded-full" />
              <div className="h-4 w-28 bg-white/70 rounded-md" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 w-24 bg-white/40 rounded-full" />
              <div className="h-4 w-32 bg-white/70 rounded-md" />
            </div>
            <div className="space-y-1.5">
              <div className="h-2.5 w-14 bg-white/40 rounded-full" />
              <div className="h-4 w-20 bg-white/70 rounded-md" />
            </div>
          </div>

          {/* Order Body Details Skeleton */}
          <div className="p-6 sm:p-7 space-y-6">
            {/* Status Alert Pill Skeleton */}
            <div className="h-12 w-full rounded-lg bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/40 animate-pulse" />

            {/* Items List Skeleton */}
            <div className="space-y-4 pt-2">
              <div className="h-4 w-28 bg-stone-200/70 dark:bg-stone-800 rounded-md animate-pulse" />
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center gap-4 py-3 border-b border-stone-100 dark:border-stone-800/60 last:border-0">
                  <div className="size-16 rounded-xl bg-stone-200/60 dark:bg-stone-800 shrink-0 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-44 bg-stone-200/70 dark:bg-stone-800 rounded-md animate-pulse" />
                    <div className="h-3 w-20 bg-stone-200/50 dark:bg-stone-800/60 rounded-md animate-pulse" />
                  </div>
                  <div className="h-4 w-16 bg-stone-200/70 dark:bg-stone-800 rounded-md shrink-0 animate-pulse" />
                </div>
              ))}
            </div>

            {/* Delivery & Customer Info Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-stone-200/70 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 space-y-2 animate-pulse">
                <div className="h-3.5 w-32 bg-stone-200/70 dark:bg-stone-800 rounded-md" />
                <div className="h-3 w-48 bg-stone-200/50 dark:bg-stone-800/60 rounded-md" />
                <div className="h-3 w-40 bg-stone-200/50 dark:bg-stone-800/60 rounded-md" />
              </div>
              <div className="p-4 rounded-xl border border-stone-200/70 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 space-y-2 animate-pulse">
                <div className="h-3.5 w-28 bg-stone-200/70 dark:bg-stone-800 rounded-md" />
                <div className="h-3 w-44 bg-stone-200/50 dark:bg-stone-800/60 rounded-md" />
                <div className="h-3 w-36 bg-stone-200/50 dark:bg-stone-800/60 rounded-md" />
              </div>
            </div>

            {/* Total Summary Skeleton */}
            <div className="pt-4 border-t border-stone-200/80 dark:border-stone-800 flex justify-between items-baseline animate-pulse">
              <div className="h-5 w-20 bg-stone-200/70 dark:bg-stone-800 rounded-md" />
              <div className="h-8 w-32 bg-stone-200/80 dark:bg-stone-800 rounded-lg" />
            </div>

            {/* Action Buttons Skeleton */}
            <div className="pt-4 border-t border-stone-200/80 dark:border-stone-800 flex flex-col sm:flex-row gap-3.5 animate-pulse">
              <div className="flex-1 h-12 rounded-full bg-stone-200/80 dark:bg-stone-800" />
              <div className="flex-1 h-12 rounded-full bg-stone-200/50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700" />
              <div className="flex-1 h-12 rounded-full bg-stone-200/50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700" />
            </div>
          </div>
        </div>
      </main>

      {/* 4. Universal Trust Bar */}
      <TrustBar />
    </div>
  );
}
