import React from "react";

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-28 pb-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      {/* ─── Header & Search Toolbar Skeleton ──────────────────── */}
      <div className="mb-10 text-center flex flex-col items-center">
        <div className="h-3 w-32 bg-[#E8DDD0] rounded-full mb-3 animate-pulse" />
        <div className="h-10 w-64 sm:w-96 bg-[#E8DDD0] rounded-2xl mb-4 animate-pulse" />
        <div className="h-4 w-72 sm:w-[480px] bg-[#E8DDD0]/60 rounded-full animate-pulse" />
      </div>

      {/* Category Pills & Filter Bar Skeleton */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-[#ECE6DF]">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-9 w-24 sm:w-28 rounded-full bg-[#E8DDD0]/70 animate-pulse flex-shrink-0" />
          ))}
        </div>
        <div className="h-10 w-48 sm:w-64 rounded-full bg-[#E8DDD0]/70 animate-pulse" />
      </div>

      {/* ─── 8-Card Responsive Product Grid Skeleton ───────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div
            key={idx}
            className="rounded-3xl border border-[#ECE6DF] bg-white p-4 shadow-sm overflow-hidden flex flex-col justify-between"
          >
            {/* Image Placeholder */}
            <div className="relative w-full aspect-square rounded-2xl bg-[#E8DDD0]/50 mb-4 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/70 shadow-sm" />
            </div>

            {/* Content Details */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="h-3 w-20 bg-[#E8DDD0]/60 rounded-full animate-pulse" />
                <div className="h-3 w-12 bg-[#4A6741]/15 rounded-full animate-pulse" />
              </div>

              <div className="h-5 w-3/4 bg-[#E8DDD0] rounded-md animate-pulse" />
              <div className="h-3.5 w-full bg-[#E8DDD0]/40 rounded-md animate-pulse" />

              <div className="pt-3 border-t border-[#ECE6DF]/60 flex items-center justify-between">
                <div>
                  <div className="h-2.5 w-10 bg-[#E8DDD0]/50 rounded-full mb-1" />
                  <div className="h-5 w-16 bg-[#E8DDD0] rounded-md" />
                </div>
                <div className="h-9 w-24 rounded-full bg-[#4A6741]/20 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
