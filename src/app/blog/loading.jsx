import React from "react";

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] pt-28 pb-20 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      {/* Blog Hero Skeleton */}
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <div className="h-3.5 w-28 bg-[#C8A97A]/30 rounded-full mx-auto animate-pulse" />
        <div className="h-10 sm:h-12 w-3/4 bg-[#E8DDD0] rounded-2xl mx-auto animate-pulse" />
        <div className="h-4 w-full bg-[#E8DDD0]/50 rounded-full mx-auto animate-pulse" />
      </div>

      {/* Featured Article Card Skeleton */}
      <div className="rounded-3xl border border-[#ECE6DF] bg-white p-6 sm:p-8 mb-16 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 aspect-[16/10] rounded-2xl bg-[#E8DDD0]/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
        </div>
        <div className="lg:col-span-5 space-y-4">
          <div className="h-3 w-20 bg-[#4A6741]/20 rounded-full" />
          <div className="h-8 w-4/5 bg-[#E8DDD0] rounded-xl" />
          <div className="h-4 w-full bg-[#E8DDD0]/50 rounded-full" />
          <div className="h-4 w-3/4 bg-[#E8DDD0]/50 rounded-full" />
          <div className="h-10 w-32 rounded-full bg-[#E8DDD0]/60 pt-2" />
        </div>
      </div>

      {/* 3-Card Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-3xl border border-[#ECE6DF] bg-white p-5 shadow-sm space-y-4">
            <div className="aspect-[16/10] rounded-2xl bg-[#E8DDD0]/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-24 bg-[#E8DDD0]/60 rounded-full" />
              <div className="h-6 w-5/6 bg-[#E8DDD0] rounded-lg" />
              <div className="h-3.5 w-full bg-[#E8DDD0]/40 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
