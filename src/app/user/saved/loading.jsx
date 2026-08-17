import React from "react";

export default function SavedLoading() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 pt-28 max-w-7xl mx-auto px-6">
      {/* Header & Back Link Skeleton */}
      <div className="mb-10">
        <div className="h-4 w-28 bg-[#E8DDD0] rounded-full mb-6 animate-pulse" />
        <div className="h-10 w-64 bg-[#E8DDD0] rounded-2xl mb-2 animate-pulse" />
        <div className="h-4 w-48 bg-[#E8DDD0]/60 rounded-full animate-pulse" />
      </div>

      {/* 6-Card Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="rounded-3xl border border-[#ECE6DF] bg-white p-4 shadow-sm space-y-4">
            <div className="w-full aspect-square rounded-2xl bg-[#E8DDD0]/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-20 bg-[#E8DDD0]/60 rounded-full" />
              <div className="h-5 w-3/4 bg-[#E8DDD0] rounded-md" />
              <div className="h-4 w-1/3 bg-[#E8DDD0] rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
